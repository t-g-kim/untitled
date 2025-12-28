/**
 * 클라이언트 사이드 작업 큐 관리
 * 
 * 변환 작업의 순서를 관리하고 동시 처리 제한을 구현합니다.
 * 서버리스 환경에서 클라이언트 측 큐 관리를 담당합니다.
 */

import { ConversionJob, updateConversionJob } from '@/lib/session';
import { cloudflareAPI } from '@/lib/cloudflare';

export interface QueueConfig {
  maxConcurrent: number; // 동시 처리 가능한 작업 수
  retryAttempts: number; // 재시도 횟수
  retryDelay: number; // 재시도 간격 (ms)
  timeoutMs: number; // 작업 타임아웃 (ms)
}

export interface QueueStats {
  totalJobs: number;
  pendingJobs: number;
  processingJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageProcessingTime: number;
}

class ConversionQueue {
  private static instance: ConversionQueue;
  private processingJobs = new Set<string>();
  private config: QueueConfig;
  private retryCounters = new Map<string, number>();
  private processingStartTimes = new Map<string, number>();

  private constructor(config: Partial<QueueConfig> = {}) {
    this.config = {
      maxConcurrent: 3, // 동시에 3개까지 처리
      retryAttempts: 3,
      retryDelay: 2000, // 2초
      timeoutMs: 5 * 60 * 1000, // 5분
      ...config
    };
  }

  public static getInstance(config?: Partial<QueueConfig>): ConversionQueue {
    if (!ConversionQueue.instance) {
      ConversionQueue.instance = new ConversionQueue(config);
    }
    return ConversionQueue.instance;
  }

  /**
   * 작업을 큐에 추가하고 처리 시작
   */
  public async enqueueJob(job: ConversionJob): Promise<void> {
    console.log(`Enqueuing job: ${job.id} (${job.fileName})`);
    
    // 이미 처리 중인 작업인지 확인
    if (this.processingJobs.has(job.id)) {
      console.warn(`Job ${job.id} is already being processed`);
      return;
    }

    // 동시 처리 제한 확인
    if (this.processingJobs.size >= this.config.maxConcurrent) {
      console.log(`Queue is full (${this.processingJobs.size}/${this.config.maxConcurrent}). Job ${job.id} will wait.`);
      // 실제로는 대기열에 추가하고 나중에 처리
      setTimeout(() => this.enqueueJob(job), 1000);
      return;
    }

    // 처리 시작
    this.processingJobs.add(job.id);
    this.processingStartTimes.set(job.id, Date.now());
    
    try {
      await this.processJob(job);
    } catch (error) {
      console.error(`Failed to process job ${job.id}:`, error);
      await this.handleJobError(job, error);
    } finally {
      this.processingJobs.delete(job.id);
      this.processingStartTimes.delete(job.id);
    }
  }

  /**
   * 작업 처리 메인 로직
   */
  private async processJob(job: ConversionJob): Promise<void> {
    console.log(`Processing job: ${job.id}`);

    try {
      // 1. 업로드 URL 요청
      updateConversionJob(job.id, { 
        status: 'uploading', 
        progress: 10 
      });

      const uploadResponse = await cloudflareAPI.getUploadUrl({
        fileName: job.fileName,
        fileSize: job.fileSize,
        contentType: this.getContentType(job.sourceFormat)
      });

      updateConversionJob(job.id, { 
        progress: 25,
        uploadUrl: uploadResponse.uploadUrl,
        fileKey: uploadResponse.fileKey
      });

      // 2. 파일 업로드 (실제 파일은 이미 업로드됨)
      updateConversionJob(job.id, { 
        progress: 50,
        status: 'processing'
      });

      // 3. 변환 요청
      const convertResponse = await cloudflareAPI.convertFile({
        fileKey: uploadResponse.fileKey,
        sourceFormat: job.sourceFormat,
        targetFormat: job.targetFormat,
        sessionId: uploadResponse.sessionId,
        options: job.options
      });

      updateConversionJob(job.id, { 
        progress: 75 
      });

      // 4. 상태 확인 및 완료 대기
      await this.waitForCompletion(job.id, convertResponse.jobId);

    } catch (error) {
      throw error;
    }
  }

  /**
   * 변환 완료 대기
   */
  private async waitForCompletion(jobId: string, workerJobId: string): Promise<void> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2초마다 확인
    
    while (Date.now() - startTime < this.config.timeoutMs) {
      try {
        const status = await cloudflareAPI.getStatus(workerJobId);
        
        updateConversionJob(jobId, { 
          progress: Math.min(90, 75 + (status.progress || 0) * 0.15) 
        });

        if (status.status === 'completed') {
          updateConversionJob(jobId, {
            status: 'completed',
            progress: 100,
            downloadUrl: status.downloadUrl,
            completedAt: new Date().toISOString()
          });
          
          console.log(`Job ${jobId} completed successfully`);
          return;
        }

        if (status.status === 'failed') {
          throw new Error(status.error || 'Conversion failed');
        }

        // 아직 처리 중이면 계속 대기
        await this.sleep(pollInterval);

      } catch (error) {
        if (Date.now() - startTime >= this.config.timeoutMs) {
          throw new Error('Job timeout');
        }
        throw error;
      }
    }

    throw new Error('Job timeout');
  }

  /**
   * 작업 에러 처리
   */
  private async handleJobError(job: ConversionJob, error: any): Promise<void> {
    const retryCount = this.retryCounters.get(job.id) || 0;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error(`Job ${job.id} failed (attempt ${retryCount + 1}):`, errorMessage);

    if (retryCount < this.config.retryAttempts) {
      // 재시도
      this.retryCounters.set(job.id, retryCount + 1);
      
      updateConversionJob(job.id, {
        status: 'uploading',
        progress: 0,
        error: `재시도 중... (${retryCount + 1}/${this.config.retryAttempts})`
      });

      console.log(`Retrying job ${job.id} in ${this.config.retryDelay}ms`);
      
      setTimeout(() => {
        this.enqueueJob(job);
      }, this.config.retryDelay);

    } else {
      // 최대 재시도 횟수 초과
      updateConversionJob(job.id, {
        status: 'failed',
        error: errorMessage,
        completedAt: new Date().toISOString()
      });

      this.retryCounters.delete(job.id);
      console.error(`Job ${job.id} failed permanently after ${this.config.retryAttempts} attempts`);
    }
  }

  /**
   * 작업 취소
   */
  public cancelJob(jobId: string): boolean {
    if (this.processingJobs.has(jobId)) {
      this.processingJobs.delete(jobId);
      this.processingStartTimes.delete(jobId);
      this.retryCounters.delete(jobId);
      
      updateConversionJob(jobId, {
        status: 'failed',
        error: 'Cancelled by user',
        completedAt: new Date().toISOString()
      });

      console.log(`Job ${jobId} cancelled`);
      return true;
    }
    return false;
  }

  /**
   * 큐 통계 가져오기
   */
  public getQueueStats(): QueueStats {
    const processingTimes: number[] = [];
    
    this.processingStartTimes.forEach((startTime, jobId) => {
      processingTimes.push(Date.now() - startTime);
    });

    const averageProcessingTime = processingTimes.length > 0
      ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length / 1000
      : 0;

    return {
      totalJobs: this.processingJobs.size + this.retryCounters.size,
      pendingJobs: 0, // 실제 구현에서는 대기 큐 크기
      processingJobs: this.processingJobs.size,
      completedJobs: 0, // 세션에서 가져와야 함
      failedJobs: 0, // 세션에서 가져와야 함
      averageProcessingTime
    };
  }

  /**
   * 현재 처리 중인 작업들
   */
  public getProcessingJobs(): string[] {
    return Array.from(this.processingJobs);
  }

  /**
   * 큐 설정 업데이트
   */
  public updateConfig(newConfig: Partial<QueueConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Queue config updated:', this.config);
  }

  /**
   * 모든 작업 취소
   */
  public cancelAllJobs(): void {
    const jobIds = Array.from(this.processingJobs);
    jobIds.forEach(jobId => this.cancelJob(jobId));
    console.log(`Cancelled ${jobIds.length} jobs`);
  }

  /**
   * 유틸리티 메서드들
   */
  private getContentType(format: string): string {
    switch (format) {
      case 'pdf':
        return 'application/pdf';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'doc':
        return 'application/msword';
      default:
        return 'application/octet-stream';
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 싱글톤 인스턴스 내보내기
export const conversionQueue = ConversionQueue.getInstance();

// 편의 함수들
export const enqueueConversionJob = (job: ConversionJob) => conversionQueue.enqueueJob(job);
export const cancelConversionJob = (jobId: string) => conversionQueue.cancelJob(jobId);
export const getQueueStats = () => conversionQueue.getQueueStats();
export const getProcessingJobs = () => conversionQueue.getProcessingJobs();
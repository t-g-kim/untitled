/**
 * 클라이언트 사이드 세션 관리
 * 
 * LocalStorage를 사용하여 사용자 세션과 변환 작업을 관리합니다.
 * DB 없는 아키텍처에서 클라이언트 상태를 유지하는 핵심 모듈입니다.
 */

import { generateUUID } from './utils';

export interface ConversionJob {
  id: string;
  sessionId: string;
  fileName: string;
  originalName: string;
  sourceFormat: 'pdf' | 'docx' | 'doc';
  targetFormat: 'pdf' | 'docx';
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  fileSize: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  uploadUrl?: string;
  downloadUrl?: string;
  fileKey?: string;
  error?: string;
  options?: {
    ocr?: boolean;
    quality?: 'fast' | 'balanced' | 'high';
  };
}

export interface ConversionSession {
  id: string;
  createdAt: string;
  lastActivity: string;
  jobs: ConversionJob[];
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  userAgent?: string;
  language?: string;
}

export interface SessionStats {
  totalSessions: number;
  totalJobs: number;
  successRate: number;
  averageProcessingTime: number;
  mostUsedConversion: string;
}



class SessionManager {
  private static instance: SessionManager;
  private currentSession: ConversionSession | null = null;
  private readonly STORAGE_KEY = 'file_conversion_session';
  private readonly STATS_KEY = 'file_conversion_stats';
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24시간

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadSession();
      this.setupCleanup();
    }
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * 현재 세션 가져오기 (없으면 새로 생성)
   */
  public getCurrentSession(): ConversionSession {
    if (!this.currentSession) {
      this.currentSession = this.createNewSession();
      this.saveSession();
    }
    
    this.updateLastActivity();
    return this.currentSession;
  }

  /**
   * 새 세션 생성
   */
  private createNewSession(): ConversionSession {
    const session: ConversionSession = {
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      jobs: [],
      totalJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      language: typeof navigator !== 'undefined' ? navigator.language : undefined
    };

    return session;
  }

  /**
   * 세션을 LocalStorage에서 로드
   */
  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const session: ConversionSession = JSON.parse(stored);
        
        // 세션 만료 확인
        const lastActivity = new Date(session.lastActivity).getTime();
        const now = Date.now();
        
        if (now - lastActivity < this.SESSION_TIMEOUT) {
          this.currentSession = session;
          this.cleanupExpiredJobs();
        } else {
          // 만료된 세션 삭제
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * 세션을 LocalStorage에 저장
   */
  private saveSession(): void {
    if (!this.currentSession) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentSession));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  /**
   * 마지막 활동 시간 업데이트
   */
  private updateLastActivity(): void {
    if (this.currentSession) {
      this.currentSession.lastActivity = new Date().toISOString();
      this.saveSession();
    }
  }

  /**
   * 새 변환 작업 추가
   */
  public addJob(jobData: Omit<ConversionJob, 'id' | 'sessionId' | 'createdAt' | 'progress' | 'status'>): ConversionJob {
    const session = this.getCurrentSession();
    
    const job: ConversionJob = {
      ...jobData,
      id: generateUUID(),
      sessionId: session.id,
      createdAt: new Date().toISOString(),
      progress: 0,
      status: 'uploading'
    };

    session.jobs.unshift(job); // 최신 작업을 앞에 추가
    session.totalJobs++;
    
    this.saveSession();
    return job;
  }

  /**
   * 작업 상태 업데이트
   */
  public updateJob(jobId: string, updates: Partial<ConversionJob>): ConversionJob | null {
    const session = this.getCurrentSession();
    const jobIndex = session.jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex === -1) {
      console.warn(`Job not found: ${jobId}`);
      return null;
    }

    const job = session.jobs[jobIndex];
    const updatedJob = { ...job, ...updates };

    // 상태 변경에 따른 세션 통계 업데이트
    if (job.status !== updatedJob.status) {
      if (updatedJob.status === 'completed') {
        session.completedJobs++;
        updatedJob.completedAt = new Date().toISOString();
      } else if (updatedJob.status === 'failed') {
        session.failedJobs++;
      } else if (updatedJob.status === 'processing' && !updatedJob.startedAt) {
        updatedJob.startedAt = new Date().toISOString();
      }
    }

    session.jobs[jobIndex] = updatedJob;
    this.updateLastActivity();
    this.saveSession();
    
    return updatedJob;
  }

  /**
   * 작업 제거
   */
  public removeJob(jobId: string): boolean {
    const session = this.getCurrentSession();
    const initialLength = session.jobs.length;
    
    session.jobs = session.jobs.filter(job => job.id !== jobId);
    
    if (session.jobs.length < initialLength) {
      this.saveSession();
      return true;
    }
    
    return false;
  }

  /**
   * 특정 작업 가져오기
   */
  public getJob(jobId: string): ConversionJob | null {
    const session = this.getCurrentSession();
    return session.jobs.find(job => job.id === jobId) || null;
  }

  /**
   * 모든 작업 가져오기
   */
  public getAllJobs(): ConversionJob[] {
    const session = this.getCurrentSession();
    return [...session.jobs];
  }

  /**
   * 진행 중인 작업들 가져오기
   */
  public getActiveJobs(): ConversionJob[] {
    const session = this.getCurrentSession();
    return session.jobs.filter(job => 
      job.status === 'uploading' || job.status === 'processing'
    );
  }

  /**
   * 완료된 작업들 가져오기
   */
  public getCompletedJobs(): ConversionJob[] {
    const session = this.getCurrentSession();
    return session.jobs.filter(job => job.status === 'completed');
  }

  /**
   * 만료된 작업들 정리
   */
  private cleanupExpiredJobs(): void {
    if (!this.currentSession) return;

    const now = Date.now();
    const JOB_EXPIRY = 48 * 60 * 60 * 1000; // 48시간

    const initialCount = this.currentSession.jobs.length;
    this.currentSession.jobs = this.currentSession.jobs.filter(job => {
      const jobTime = new Date(job.createdAt).getTime();
      return now - jobTime < JOB_EXPIRY;
    });

    if (this.currentSession.jobs.length < initialCount) {
      console.log(`Cleaned up ${initialCount - this.currentSession.jobs.length} expired jobs`);
      this.saveSession();
    }
  }

  /**
   * 세션 통계 가져오기
   */
  public getSessionStats(): SessionStats {
    const session = this.getCurrentSession();
    
    // 처리 시간 계산
    const completedJobs = session.jobs.filter(job => 
      job.status === 'completed' && job.startedAt && job.completedAt
    );
    
    let totalProcessingTime = 0;
    completedJobs.forEach(job => {
      if (job.startedAt && job.completedAt) {
        const start = new Date(job.startedAt).getTime();
        const end = new Date(job.completedAt).getTime();
        totalProcessingTime += end - start;
      }
    });

    const averageProcessingTime = completedJobs.length > 0 
      ? totalProcessingTime / completedJobs.length / 1000 // 초 단위
      : 0;

    // 가장 많이 사용된 변환 타입
    const conversionCounts: Record<string, number> = {};
    session.jobs.forEach(job => {
      const key = `${job.sourceFormat}-to-${job.targetFormat}`;
      conversionCounts[key] = (conversionCounts[key] || 0) + 1;
    });

    const mostUsedConversion = Object.entries(conversionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    return {
      totalSessions: 1, // 현재 세션만
      totalJobs: session.totalJobs,
      successRate: session.totalJobs > 0 
        ? (session.completedJobs / session.totalJobs) * 100 
        : 0,
      averageProcessingTime,
      mostUsedConversion
    };
  }

  /**
   * 세션 초기화
   */
  public clearSession(): void {
    this.currentSession = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 정리 작업 설정
   */
  private setupCleanup(): void {
    // 페이지 언로드 시 정리
    window.addEventListener('beforeunload', () => {
      this.cleanupExpiredJobs();
    });

    // 주기적 정리 (10분마다)
    setInterval(() => {
      this.cleanupExpiredJobs();
    }, 10 * 60 * 1000);
  }

  /**
   * 세션 내보내기 (디버깅용)
   */
  public exportSession(): string {
    const session = this.getCurrentSession();
    return JSON.stringify(session, null, 2);
  }

  /**
   * 세션 가져오기 (복원용)
   */
  public importSession(sessionData: string): boolean {
    try {
      const session: ConversionSession = JSON.parse(sessionData);
      
      // 기본 검증
      if (!session.id || !session.createdAt || !Array.isArray(session.jobs)) {
        throw new Error('Invalid session format');
      }

      this.currentSession = session;
      this.saveSession();
      return true;
    } catch (error) {
      console.error('Failed to import session:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const sessionManager = SessionManager.getInstance();

// 편의 함수들
export const getCurrentSession = () => sessionManager.getCurrentSession();
export const addConversionJob = (jobData: Omit<ConversionJob, 'id' | 'sessionId' | 'createdAt' | 'progress' | 'status'>) => 
  sessionManager.addJob(jobData);
export const updateConversionJob = (jobId: string, updates: Partial<ConversionJob>) => 
  sessionManager.updateJob(jobId, updates);
export const getConversionJob = (jobId: string) => sessionManager.getJob(jobId);
export const getAllConversionJobs = () => sessionManager.getAllJobs();
export const getActiveConversionJobs = () => sessionManager.getActiveJobs();
export const removeConversionJob = (jobId: string) => sessionManager.removeJob(jobId);
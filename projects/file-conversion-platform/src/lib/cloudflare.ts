/**
 * Cloudflare API 클라이언트
 * 
 * Workers API와 통신하기 위한 유틸리티 함수들
 */

export interface UploadUrlRequest {
  fileName: string;
  fileSize: number;
  contentType: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
  sessionId: string;
}

export interface ConvertRequest {
  fileKey: string;
  sourceFormat: 'pdf' | 'docx' | 'doc';
  targetFormat: 'pdf' | 'docx';
  sessionId: string;
  options?: {
    ocr?: boolean;
    quality?: 'fast' | 'balanced' | 'high';
  };
}

export interface ConvertResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  estimatedTime?: number;
  resultKey?: string;
  error?: string;
}

export interface StatusResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  downloadUrl?: string;
  error?: string;
}

class CloudflareAPI {
  private baseUrl: string;

  constructor() {
    // 개발 환경에서는 로컬 Workers, 프로덕션에서는 실제 Workers URL
    this.baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8787' 
      : 'https://your-worker.your-subdomain.workers.dev';
  }

  /**
   * 파일 업로드용 Signed URL 요청
   */
  async getUploadUrl(request: UploadUrlRequest): Promise<UploadUrlResponse> {
    const response = await fetch(`${this.baseUrl}/api/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get upload URL');
    }

    return response.json();
  }

  /**
   * 파일 변환 요청
   */
  async convertFile(request: ConvertRequest): Promise<ConvertResponse> {
    const response = await fetch(`${this.baseUrl}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Conversion failed');
    }

    return response.json();
  }

  /**
   * 변환 상태 확인
   */
  async getStatus(jobId: string): Promise<StatusResponse> {
    const response = await fetch(`${this.baseUrl}/api/status?jobId=${jobId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get status');
    }

    return response.json();
  }

  /**
   * 파일 다운로드 URL 생성
   */
  getDownloadUrl(fileKey: string): string {
    return `${this.baseUrl}/api/download?key=${encodeURIComponent(fileKey)}`;
  }

  /**
   * 파일 업로드 (Signed URL 사용)
   */
  async uploadFile(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }
  }
}

// 싱글톤 인스턴스
export const cloudflareAPI = new CloudflareAPI();

// 파일 타입 검증 유틸리티
export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  
  return allowedTypes.includes(file.type);
}

// 파일 크기 검증 유틸리티
export function validateFileSize(file: File, maxSize: number = 50 * 1024 * 1024): boolean {
  return file.size <= maxSize;
}

// 파일 확장자에서 포맷 추출
export function getFileFormat(fileName: string): 'pdf' | 'docx' | 'doc' | null {
  const extension = fileName.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'docx':
      return 'docx';
    case 'doc':
      return 'doc';
    default:
      return null;
  }
}
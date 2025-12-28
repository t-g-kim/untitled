/**
 * 변환 작업 상태 관리를 위한 React Hook
 * 
 * 세션 관리자와 연동하여 실시간으로 작업 상태를 업데이트하고
 * 컴포넌트에서 쉽게 사용할 수 있는 인터페이스를 제공합니다.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ConversionJob, 
  sessionManager, 
  addConversionJob, 
  updateConversionJob,
  getAllConversionJobs,
  getActiveConversionJobs,
  removeConversionJob
} from '@/lib/session';

export interface UseConversionJobsReturn {
  jobs: ConversionJob[];
  activeJobs: ConversionJob[];
  isProcessing: boolean;
  addJob: (jobData: Omit<ConversionJob, 'id' | 'sessionId' | 'createdAt' | 'progress' | 'status'>) => ConversionJob;
  updateJob: (jobId: string, updates: Partial<ConversionJob>) => ConversionJob | null;
  removeJob: (jobId: string) => boolean;
  getJob: (jobId: string) => ConversionJob | null;
  clearAllJobs: () => void;
  retryJob: (jobId: string) => void;
}

export function useConversionJobs(): UseConversionJobsReturn {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [activeJobs, setActiveJobs] = useState<ConversionJob[]>([]);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // 상태 새로고침
  const refreshJobs = useCallback(() => {
    const allJobs = getAllConversionJobs();
    const currentActiveJobs = getActiveConversionJobs();
    
    setJobs(allJobs);
    setActiveJobs(currentActiveJobs);
  }, []);

  // 컴포넌트 마운트 시 초기 로드
  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  // 주기적 상태 업데이트 (활성 작업이 있을 때만)
  useEffect(() => {
    if (activeJobs.length > 0) {
      updateTimeoutRef.current = setTimeout(() => {
        refreshJobs();
      }, 1000); // 1초마다 업데이트
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [activeJobs.length, refreshJobs]);

  // 새 작업 추가
  const addJob = useCallback((jobData: Omit<ConversionJob, 'id' | 'sessionId' | 'createdAt' | 'progress' | 'status'>) => {
    const newJob = addConversionJob(jobData);
    refreshJobs();
    return newJob;
  }, [refreshJobs]);

  // 작업 업데이트
  const updateJob = useCallback((jobId: string, updates: Partial<ConversionJob>) => {
    const updatedJob = updateConversionJob(jobId, updates);
    refreshJobs();
    return updatedJob;
  }, [refreshJobs]);

  // 작업 제거
  const removeJob = useCallback((jobId: string) => {
    const success = removeConversionJob(jobId);
    if (success) {
      refreshJobs();
    }
    return success;
  }, [refreshJobs]);

  // 특정 작업 가져오기
  const getJob = useCallback((jobId: string) => {
    return jobs.find(job => job.id === jobId) || null;
  }, [jobs]);

  // 모든 작업 제거
  const clearAllJobs = useCallback(() => {
    const currentJobs = getAllConversionJobs();
    currentJobs.forEach(job => removeConversionJob(job.id));
    refreshJobs();
  }, [refreshJobs]);

  // 작업 재시도
  const retryJob = useCallback((jobId: string) => {
    const job = getJob(jobId);
    if (job && job.status === 'failed') {
      updateJob(jobId, {
        status: 'uploading',
        progress: 0,
        error: undefined,
        startedAt: undefined,
        completedAt: undefined
      });
    }
  }, [getJob, updateJob]);

  const isProcessing = activeJobs.length > 0;

  return {
    jobs,
    activeJobs,
    isProcessing,
    addJob,
    updateJob,
    removeJob,
    getJob,
    clearAllJobs,
    retryJob
  };
}

/**
 * 특정 작업의 상태를 추적하는 Hook
 */
export function useConversionJob(jobId: string | null) {
  const { jobs, updateJob } = useConversionJobs();
  const [job, setJob] = useState<ConversionJob | null>(null);

  useEffect(() => {
    if (jobId) {
      const currentJob = jobs.find(j => j.id === jobId) || null;
      setJob(currentJob);
    } else {
      setJob(null);
    }
  }, [jobId, jobs]);

  const updateCurrentJob = useCallback((updates: Partial<ConversionJob>) => {
    if (jobId) {
      return updateJob(jobId, updates);
    }
    return null;
  }, [jobId, updateJob]);

  return {
    job,
    updateJob: updateCurrentJob,
    isActive: job?.status === 'uploading' || job?.status === 'processing',
    isCompleted: job?.status === 'completed',
    isFailed: job?.status === 'failed'
  };
}

/**
 * 세션 통계를 위한 Hook
 */
export function useSessionStats() {
  const [stats, setStats] = useState(() => sessionManager.getSessionStats());
  const { jobs } = useConversionJobs();

  useEffect(() => {
    setStats(sessionManager.getSessionStats());
  }, [jobs]);

  return stats;
}

/**
 * 로컬 스토리지 변경 감지 Hook
 */
export function useStorageSync() {
  const { refreshJobs } = useConversionJobs() as any;

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'file_conversion_session') {
        refreshJobs();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshJobs]);
}
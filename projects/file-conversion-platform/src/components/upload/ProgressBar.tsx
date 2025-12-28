'use client';

import { useEffect, useState } from 'react';

export interface ProgressBarProps {
  progress: number; // 0-100
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  message?: string;
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressBar({
  progress,
  status,
  message,
  showPercentage = true,
  className = ''
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // 부드러운 진행률 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  // 상태별 색상 및 스타일
  const getProgressStyles = () => {
    switch (status) {
      case 'uploading':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-700',
          bgLight: 'bg-blue-100'
        };
      case 'processing':
        return {
          bg: 'bg-yellow-500',
          text: 'text-yellow-700',
          bgLight: 'bg-yellow-100'
        };
      case 'completed':
        return {
          bg: 'bg-green-500',
          text: 'text-green-700',
          bgLight: 'bg-green-100'
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          text: 'text-red-700',
          bgLight: 'bg-red-100'
        };
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-700',
          bgLight: 'bg-gray-100'
        };
    }
  };

  const styles = getProgressStyles();

  // 상태별 아이콘
  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return (
          <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'processing':
        return (
          <svg className="animate-pulse h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // 상태별 메시지
  const getStatusMessage = () => {
    if (message) return message;
    
    switch (status) {
      case 'uploading':
        return '파일 업로드 중...';
      case 'processing':
        return '파일 변환 중...';
      case 'completed':
        return '변환 완료!';
      case 'error':
        return '오류가 발생했습니다';
      default:
        return '대기 중';
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* 상태 정보 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${styles.text}`}>
            {getStatusMessage()}
          </span>
        </div>
        
        {showPercentage && (
          <span className={`text-sm font-medium ${styles.text}`}>
            {Math.round(displayProgress)}%
          </span>
        )}
      </div>

      {/* 진행률 바 */}
      <div className={`w-full ${styles.bgLight} rounded-full h-2 overflow-hidden`}>
        <div
          className={`h-full ${styles.bg} transition-all duration-300 ease-out rounded-full`}
          style={{ 
            width: `${displayProgress}%`,
            transform: status === 'processing' ? 'translateX(-100%)' : 'none',
            animation: status === 'processing' ? 'progress-indeterminate 2s infinite linear' : 'none'
          }}
        />
      </div>

      {/* 처리 중일 때 무한 진행률 애니메이션 */}
      <style jsx>{`
        @keyframes progress-indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
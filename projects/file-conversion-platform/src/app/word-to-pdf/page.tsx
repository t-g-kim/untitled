'use client';

import { useCallback, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FileUpload from '@/components/upload/FileUpload';
import ProgressBar from '@/components/upload/ProgressBar';
import ClientOnly from '@/components/ClientOnly';
import { useConversionJobs } from '@/hooks/useConversionJobs';
import { convertWordToPdf, downloadConvertedFile, isSupportedFile } from '@/lib/conversion';

function WordToPdfContent() {
  const { jobs, addJob, updateJob } = useConversionJobs();
  const [isProcessing, setIsProcessing] = useState(false);

  // Word → PDF 작업만 필터링
  const wordToPdfJobs = jobs.filter(job => 
    (job.sourceFormat === 'docx' || job.sourceFormat === 'doc') && job.targetFormat === 'pdf'
  );

  // 파일 업로드 핸들러
  const handleFileUpload = useCallback(async (file: File) => {
    // 파일 형식 검증
    if (!isSupportedFile(file) || (!file.type.includes('word') && !file.type.includes('document'))) {
      throw new Error('Word 파일(.docx, .doc)만 업로드 가능합니다.');
    }

    setIsProcessing(true);

    try {
      // 파일 형식 감지
      const sourceFormat = file.type.includes('openxmlformats') ? 'docx' : 'doc';

      // 새 변환 작업 생성
      const job = addJob({
        fileName: `${file.name.replace(/\.(docx?|doc)$/i, '')}.pdf`,
        originalName: file.name,
        sourceFormat,
        targetFormat: 'pdf',
        fileSize: file.size
      });

      // 변환 시작
      updateJob(job.id, { status: 'processing', progress: 10 });

      try {
        // Word to PDF 변환 실행
        const result = await convertWordToPdf(file, {
          quality: 'balanced',
          preserveFormatting: true
        });

        if (result.success && result.blob) {
          // 변환 성공
          updateJob(job.id, {
            status: 'completed',
            progress: 100,
            completedAt: new Date().toISOString()
          });

          // 파일 다운로드
          downloadConvertedFile(result.blob, result.fileName);

          // 성공 메시지
          if (result.warnings && result.warnings.length > 0) {
            alert(`변환이 완료되었습니다.\n\n주의사항:\n${result.warnings.join('\n')}`);
          }
        } else {
          // 변환 실패
          updateJob(job.id, {
            status: 'failed',
            error: result.error || '변환 중 오류가 발생했습니다.'
          });
        }
      } catch (conversionError) {
        console.error('Conversion error:', conversionError);
        updateJob(job.id, {
          status: 'failed',
          error: conversionError instanceof Error ? conversionError.message : '변환 중 오류가 발생했습니다.'
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [addJob, updateJob]);

  // 재시도 핸들러
  const handleRetry = useCallback(async (job: any) => {
    updateJob(job.id, {
      status: 'uploading',
      progress: 0,
      error: undefined
    });

    // 원본 파일이 없으므로 재시도는 제한적
    updateJob(job.id, {
      status: 'failed',
      error: '재시도하려면 파일을 다시 업로드해주세요.'
    });
  }, [updateJob]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Word를 PDF로 변환
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Word 문서를 PDF 파일로 변환하세요. 
            서식과 레이아웃이 그대로 보존됩니다.
          </p>
        </div>

        {/* 광고 영역 (상단) */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
          <p>광고 영역 (Google AdSense)</p>
        </div>

        {/* 파일 업로드 영역 */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Word 파일 업로드
          </h2>
          
          <FileUpload
            acceptedTypes={[
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/msword'
            ]}
            maxSize={50 * 1024 * 1024} // 50MB
            onUpload={handleFileUpload}
            disabled={isProcessing}
          />
        </div>

        {/* 변환 진행 상황 */}
        {wordToPdfJobs.length > 0 && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              변환 진행 상황
            </h3>
            
            <div className="space-y-6">
              {wordToPdfJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 truncate">
                      {job.originalName}
                    </h4>
                    
                    <div className="text-sm text-gray-500">
                      {(job.fileSize / 1024 / 1024).toFixed(1)} MB
                    </div>
                  </div>

                  <ProgressBar
                    progress={job.progress}
                    status={job.status === 'failed' ? 'error' : job.status}
                    message={job.error}
                  />

                  {/* 완료 메시지 */}
                  {job.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-600 font-medium">
                        ✅ 변환이 완료되어 다운로드되었습니다!
                      </p>
                      <p className="text-xs text-green-500 mt-1">
                        파일명: {job.fileName}
                      </p>
                    </div>
                  )}

                  {/* 에러 메시지 및 재시도 */}
                  {job.status === 'failed' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-600 font-medium">
                            ❌ 변환 실패
                          </p>
                          <p className="text-xs text-red-500 mt-1">
                            {job.error || '변환 중 오류가 발생했습니다.'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRetry(job)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors"
                        >
                          재시도
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 광고 영역 (하단) */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
          <p>광고 영역 (Google AdSense)</p>
        </div>

        {/* 기능 설명 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ✨ 주요 기능
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 클라이언트 사이드 변환 (완전 보안)</li>
              <li>• 즉시 다운로드</li>
              <li>• .docx 및 .doc 파일 지원</li>
              <li>• 대용량 파일 지원 (최대 50MB)</li>
              <li>• 서식 및 레이아웃 보존</li>
              <li>• 회원가입 불필요</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              📄 지원 형식
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>입력:</strong> .docx, .doc</li>
              <li>• <strong>출력:</strong> .pdf</li>
              <li>• 텍스트 및 기본 서식 보존</li>
              <li>• 페이지 레이아웃 유지</li>
              <li>• 폰트 임베딩</li>
            </ul>
          </div>
        </div>

        {/* 사용법 안내 */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            사용법
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold text-lg">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Word 업로드</h4>
              <p className="text-sm text-gray-600">
                변환할 Word 파일(.docx 또는 .doc)을 업로드하세요.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold text-lg">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">자동 변환</h4>
              <p className="text-sm text-gray-600">
                브라우저에서 직접 PDF로 변환됩니다. 완전히 안전합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold text-lg">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">즉시 다운로드</h4>
              <p className="text-sm text-gray-600">
                변환이 완료되면 PDF 파일이 자동으로 다운로드됩니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function WordToPdfPage() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <WordToPdfContent />
    </ClientOnly>
  );
}
'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import { debounce, optimizeQRGeneration, performanceMonitor } from '@/lib/performance';
import { getTranslation } from '@/lib/i18n';

interface QRGeneratorProps {
  initialText?: string;
  locale: 'ko' | 'en';
}

interface QROptions {
  size: 128 | 256 | 512;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
}

interface GenerationResult {
  success: boolean;
  dataURL?: string;
  error?: string;
  processingTime: number;
}

export default function QRGenerator({ initialText = '', locale }: QRGeneratorProps) {
  const [inputText, setInputText] = useState(initialText);
  const [qrDataURL, setQrDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [options, setOptions] = useState<QROptions>({
    size: 256,
    errorCorrectionLevel: 'M',
    margin: 4
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedOptions = localStorage.getItem('qr-generator-options');
      if (savedOptions) {
        const parsedOptions = JSON.parse(savedOptions);
        setOptions(prev => ({ ...prev, ...parsedOptions }));
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
  }, []);

  // Save settings to localStorage when options change
  useEffect(() => {
    try {
      localStorage.setItem('qr-generator-options', JSON.stringify(options));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }, [options]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // URL validation function
  const isValidURL = useCallback((text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch {
      // Check for common URL patterns without protocol
      const urlPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      return urlPattern.test(text) || text.includes('.');
    }
  }, []);

  // Input validation function
  const validateInput = useCallback((text: string): { isValid: boolean; error?: string } => {
    if (!text.trim()) {
      return {
        isValid: false,
        error: getTranslation(locale, 'error.emptyText')
      };
    }
    
    if (text.length > 2048) {
      return {
        isValid: false,
        error: getTranslation(locale, 'error.tooLong')
      };
    }
    
    return { isValid: true };
  }, [locale]);

  // QR code generation function with caching and performance monitoring
  const generateQRCode = useCallback(async (text: string, qrOptions: QROptions): Promise<GenerationResult> => {
    return performanceMonitor.measureAsync('QR Generation', async () => {
      const startTime = performance.now();
      
      try {
        // Validate input
        const validation = validateInput(text);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.error,
            processingTime: performance.now() - startTime
          };
        }

        // Check cache first
        const cached = optimizeQRGeneration.getCached(text, qrOptions);
        if (cached) {
          return {
            success: true,
            dataURL: cached,
            processingTime: performance.now() - startTime
          };
        }

        // Generate QR code using qrcode.js
        const dataURL = await QRCode.toDataURL(text, {
          width: qrOptions.size,
          margin: qrOptions.margin,
          errorCorrectionLevel: qrOptions.errorCorrectionLevel,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        // Cache the result
        optimizeQRGeneration.setCached(text, qrOptions, dataURL);

        return {
          success: true,
          dataURL,
          processingTime: performance.now() - startTime
        };
      } catch (err) {
        return {
          success: false,
          error: getTranslation(locale, 'error.qrGeneration'),
          processingTime: performance.now() - startTime
        };
      }
    });
  }, [validateInput, locale]);

  // Handle QR code generation
  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setError('');
    
    const result = await generateQRCode(inputText, options);
    
    if (result.success && result.dataURL) {
      setQrDataURL(result.dataURL);
    } else {
      setError(result.error || 'Unknown error');
      setQrDataURL('');
    }
    
    setIsGenerating(false);
  }, [inputText, options, generateQRCode]);

  // Debounced generate function for better performance
  const debouncedGenerate = useMemo(
    () => debounce(handleGenerate, 300),
    [handleGenerate]
  );

  // Auto-generate QR code when input or options change
  useEffect(() => {
    if (inputText.trim()) {
      debouncedGenerate();
    } else {
      setQrDataURL('');
      setError('');
    }
  }, [inputText, options, debouncedGenerate]);

  // Download function
  const handleDownload = useCallback(() => {
    if (!qrDataURL) return;
    
    try {
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = qrDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(getTranslation(locale, 'error.download'));
    }
  }, [qrDataURL, locale]);

  // Reset settings to default
  const handleResetSettings = useCallback(() => {
    const defaultOptions: QROptions = {
      size: 256,
      errorCorrectionLevel: 'M',
      margin: 4
    };
    setOptions(defaultOptions);
    try {
      localStorage.removeItem('qr-generator-options');
    } catch (error) {
      console.warn('Failed to clear settings from localStorage:', error);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">
          {getTranslation(locale, 'qr.title')}
        </h2>
        <p className="text-gray-600">
          {getTranslation(locale, 'qr.subtitle')}
        </p>
      </div>
      
      {/* Input Form */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'ko' ? '텍스트 또는 URL' : 'Text or URL'}
            </label>
            <textarea
              id="qr-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={locale === 'ko' ? '여기에 텍스트나 URL을 입력하세요...' : 'Enter text or URL here...'}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={2048}
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>
                {inputText.length}/2048 {locale === 'ko' ? '자' : 'characters'}
              </span>
              {inputText && isValidURL(inputText) && (
                <span className="text-green-600">
                  {locale === 'ko' ? '✓ 유효한 URL' : '✓ Valid URL'}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={!inputText.trim() || isGenerating}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating 
              ? (locale === 'ko' ? '생성 중...' : 'Generating...') 
              : (locale === 'ko' ? 'QR 코드 생성' : 'Generate QR Code')
            }
          </button>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* QR Code Preview */}
      {qrDataURL && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium">
              {locale === 'ko' ? 'QR 코드 미리보기' : 'QR Code Preview'}
            </h3>
            <div className="flex justify-center">
              <img 
                src={qrDataURL} 
                alt="Generated QR Code"
                className="border border-gray-200 rounded-md"
                style={{ width: options.size, height: options.size }}
              />
            </div>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
            >
              {locale === 'ko' ? 'PNG로 다운로드' : 'Download as PNG'}
            </button>
          </div>
        </div>
      )}
      
      {/* Options Panel */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium mb-4">
          {locale === 'ko' ? '옵션' : 'Options'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'ko' ? '크기' : 'Size'}
            </label>
            <select
              value={options.size}
              onChange={(e) => setOptions(prev => ({ ...prev, size: Number(e.target.value) as 128 | 256 | 512 }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={128}>128x128px</option>
              <option value={256}>256x256px</option>
              <option value={512}>512x512px</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'ko' ? '오류 정정 레벨' : 'Error Correction Level'}
            </label>
            <select
              value={options.errorCorrectionLevel}
              onChange={(e) => setOptions(prev => ({ ...prev, errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="L">L (Low ~7%)</option>
              <option value="M">M (Medium ~15%)</option>
              <option value="Q">Q (Quartile ~25%)</option>
              <option value="H">H (High ~30%)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleResetSettings}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            {locale === 'ko' ? '기본 설정으로 초기화' : 'Reset to Default Settings'}
          </button>
        </div>
      </div>
      
      {/* Hidden canvas for advanced operations if needed */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
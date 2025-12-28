'use client';

import { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import OutputConsole from '@/components/OutputConsole';
import LanguageSelector from '@/components/LanguageSelector';
import HTMLPreview from '@/components/HTMLPreview';
import NoSSR from '@/components/NoSSR';
import ResizablePanel from '@/components/ResizablePanel';
import { getPyodideRunner } from '@/lib/pyodide-runner';
import { codeRunner } from '@/lib/code-runner';
import { StorageManager } from '@/lib/storage-utils';
import { CodeFormatter } from '@/lib/formatter';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SupportedLanguage, LANGUAGE_CONFIGS } from '@/types/languages';

function CodePlayground() {
  const [currentLanguage, setCurrentLanguage] = useLocalStorage<SupportedLanguage>('selected-language', 'python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  // Initialize Python runtime only
  useEffect(() => {
    const initializePyodide = async () => {
      try {
        const runner = getPyodideRunner();
        await runner.initialize();
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize Pyodide:', error);
        setErrors(['Failed to initialize Python runtime. Python code execution will not work.']);
        setIsInitializing(false);
      }
    };

    initializePyodide();
  }, []);

  // Check and clean localStorage on initial load
  useEffect(() => {
    // Check if any localStorage data is corrupted
    const languages: SupportedLanguage[] = ['python', 'javascript', 'typescript', 'html', 'css', 'json', 'java', 'cpp', 'c', 'csharp', 'php', 'ruby', 'go', 'rust', 'kotlin', 'swift'];
    let hasCorruptedData = false;
    
    languages.forEach(lang => {
      const savedCode = StorageManager.loadCode(lang);
      if (savedCode && (savedCode.includes('\\\\\\\\') || savedCode.includes('\\\\\\\\'))) {
        hasCorruptedData = true;
      }
    });
    
    if (hasCorruptedData) {
      console.log('Detected corrupted localStorage data, performing full reset...');
      StorageManager.resetToDefaults();
      // Force reload current language code
      setCode(LANGUAGE_CONFIGS[currentLanguage].defaultCode);
    }
  }, [currentLanguage]);

  // Load code when language changes
  useEffect(() => {
    const savedCode = StorageManager.loadCode(currentLanguage);
    
    // Check if saved code contains problematic characters (backslashes)
    if (savedCode && (savedCode.includes('\\\\\\\\') || savedCode.includes('\\\\\\\\'))) {
      console.log('Detected corrupted localStorage data, resetting to defaults...');
      StorageManager.resetToDefaults();
      setCode(LANGUAGE_CONFIGS[currentLanguage].defaultCode);
    } else if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(LANGUAGE_CONFIGS[currentLanguage].defaultCode);
    }
    
    setOutput([]);
    setErrors([]);
    setShowPreview(false);
    setHtmlContent('');
  }, [currentLanguage]);

  // Save code to localStorage when it changes
  useEffect(() => {
    if (code) {
      StorageManager.saveCode(currentLanguage, code);
    }
  }, [code, currentLanguage]);

  const handleLanguageChange = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
  };

  const handleRunCode = async () => {
    if (currentLanguage === 'python' && isInitializing) {
      setErrors(['Python runtime is still initializing. Please wait...']);
      return;
    }

    const currentConfig = LANGUAGE_CONFIGS[currentLanguage];
    if (!currentConfig.supportsExecution) {
      setErrors([`${currentConfig.name} does not support execution. Use it for syntax highlighting and editing only.`]);
      return;
    }

    setIsRunning(true);
    setOutput([]);
    setErrors([]);
    setShowPreview(false);
    setHtmlContent('');

    try {
      const result = await codeRunner.runCode(code, currentLanguage);
      
      setOutput(result.output);
      setErrors(result.errors);
      
      // Show HTML preview if it's HTML code
      if (currentLanguage === 'html' && result.htmlContent) {
        setHtmlContent(result.htmlContent);
        setShowPreview(true);
      }
    } catch (error: any) {
      setErrors([error.message || 'An unexpected error occurred']);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearOutput = () => {
    setOutput([]);
    setErrors([]);
    setShowPreview(false);
    setHtmlContent('');
  };

  const handleFormat = () => {
    const result = CodeFormatter.autoFormat(code, currentLanguage);
    if (result.error) {
      setErrors([result.error]);
    } else {
      setCode(result.formatted);
      setErrors([]);
      // Show success message in output for JSON formatting
      if (currentLanguage === 'json') {
        setOutput(['✅ JSON formatted successfully']);
      }
    }
  };

  const handleMinifyJSON = () => {
    if (currentLanguage !== 'json') return;
    
    const result = CodeFormatter.minifyJSON(code);
    if (result.error) {
      setErrors([result.error]);
    } else {
      setCode(result.formatted);
      setErrors([]);
      setOutput(['✅ JSON minified successfully']);
    }
  };

  const handleClearStorage = () => {
    if (confirm('This will clear all saved code and reset everything to defaults. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const currentConfig = LANGUAGE_CONFIGS[currentLanguage];

  if (currentLanguage === 'python' && isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Initializing Python runtime...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments on first load</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src="/logo.svg" alt="Code Playground" className="h-8" />
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                <span>•</span>
                <span>Multi-Language Online Editor</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSelector 
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
              <button
                onClick={handleClearStorage}
                className="px-2 py-1.5 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                title="Clear all storage and reload page"
              >
                Clear Storage
              </button>
              {currentLanguage === 'json' && (
                <>
                  <button
                    onClick={handleFormat}
                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    title="Format JSON with proper indentation"
                  >
                    Format
                  </button>
                  <button
                    onClick={handleMinifyJSON}
                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    title="Minify JSON (remove whitespace)"
                  >
                    Minify
                  </button>
                </>
              )}
              {currentLanguage !== 'json' && ['html', 'css', 'javascript', 'typescript'].includes(currentLanguage) && (
                <button
                  onClick={handleFormat}
                  className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  title="Format code with proper indentation"
                >
                  Format
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full h-[calc(100vh-64px)]">
        <ResizablePanel
          defaultLeftWidth={70}
          minLeftWidth={30}
          maxLeftWidth={85}
          storageKey="editor-panel-width"
          leftPanel={
            <div className="h-full bg-gray-800 border-r border-gray-700">
              <div className="h-full flex flex-col">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">main.{currentConfig.fileExtension}</span>
                    {!currentConfig.supportsExecution && (
                      <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                        View Only
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentLanguage === 'html' && showPreview && (
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Preview</span>
                      </button>
                    )}
                    {currentConfig.supportsExecution && (
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="flex items-center space-x-2 px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isRunning ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Running...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">Run</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Editor */}
                <div className="flex-1">
                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    language={currentConfig.monacoLanguage as any}
                    onFormat={handleFormat}
                  />
                </div>
              </div>
            </div>
          }
          rightPanel={
            <div className="h-full bg-gray-900 flex flex-col">
              {/* Console Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-sm text-gray-400">
                  {showPreview ? 'Preview' : 'Output'}
                </span>
                <div className="flex items-center space-x-2">
                  {currentLanguage === 'html' && htmlContent && (
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {showPreview ? 'Show Output' : 'Show Preview'}
                    </button>
                  )}
                  <button
                    onClick={handleClearOutput}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              {/* Console Content */}
              <div className="flex-1">
                {showPreview ? (
                  <HTMLPreview htmlContent={htmlContent} isVisible={showPreview} />
                ) : (
                  <OutputConsole
                    output={output}
                    errors={errors}
                    isRunning={isRunning}
                    onClear={handleClearOutput}
                  />
                )}
              </div>
            </div>
          }
        />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <NoSSR>
      <CodePlayground />
    </NoSSR>
  );
}
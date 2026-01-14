'use client';

import { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import OutputConsole from '@/components/OutputConsole';
import ResizablePanel from '@/components/ResizablePanel';
import { getPyodideRunner } from '@/lib/pyodide-runner';

const DEFAULT_PYTHON_CODE = `# Welcome to Python Online Editor
# Write your Python code here and click Run

def greet(name):
    return f"Hello, {name}!"

# Example usage
message = greet("World")
print(message)

# Try some calculations
numbers = [1, 2, 3, 4, 5]
sum_numbers = sum(numbers)
print(f"Sum of {numbers} = {sum_numbers}")
`;

function PythonPlayground() {
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Python runtime on mount
  useEffect(() => {
    const initializePyodide = async () => {
      setIsInitializing(true);
      try {
        setOutput(['🐍 Initializing Python runtime...']);
        const runner = getPyodideRunner();
        await runner.initialize();
        setOutput(['✅ Python runtime ready. Write your code and click Run!']);
      } catch (error: any) {
        console.error('Failed to initialize Pyodide:', error);
        setErrors([
          '❌ Failed to initialize Python runtime.',
          'Please refresh the page to try again.',
          `Error: ${error.message || error}`
        ]);
      } finally {
        setIsInitializing(false);
      }
    };

    initializePyodide();
  }, []);

  // Load saved code from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('python-code');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Save code to localStorage when it changes
  useEffect(() => {
    if (code && code !== DEFAULT_PYTHON_CODE) {
      localStorage.setItem('python-code', code);
    }
  }, [code]);

  const handleRunCode = async () => {
    if (isInitializing) {
      setErrors(['Python runtime is still initializing. Please wait...']);
      return;
    }

    setIsRunning(true);
    setOutput([]);
    setErrors([]);

    try {
      const runner = getPyodideRunner();
      const result = await runner.runPython(code);
      
      setOutput(result.output);
      setErrors(result.errors);
    } catch (error: any) {
      setErrors([error.message || 'An unexpected error occurred']);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearOutput = () => {
    setOutput([]);
    setErrors([]);
  };

  const handleClearStorage = () => {
    if (confirm('This will clear your saved code and reset to the default example. Continue?')) {
      localStorage.removeItem('python-code');
      setCode(DEFAULT_PYTHON_CODE);
      setOutput([]);
      setErrors([]);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Initializing Python runtime...</p>
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
                <img src="/logo.svg" alt="Python Editor" className="h-8" />
                <span className="text-xl font-semibold">Python Editor</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                <span>•</span>
                <span>Online Python Playground</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearStorage}
                className="px-3 py-1.5 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                title="Clear saved code and reset"
              >
                Reset Code
              </button>
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
          storageKey="python-editor-panel-width"
          leftPanel={
            <div className="h-full bg-gray-800 border-r border-gray-700">
              <div className="h-full flex flex-col">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">main.py</span>
                  </div>
                  <div className="flex items-center space-x-2">
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
                          <span className="text-sm">Run Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Editor */}
                <div className="flex-1">
                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    language="python"
                  />
                </div>
              </div>
            </div>
          }
          rightPanel={
            <div className="h-full bg-gray-900 flex flex-col">
              {/* Console Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-sm text-gray-400">Output</span>
                <div className="flex items-center space-x-2">
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
                <OutputConsole
                  output={output}
                  errors={errors}
                  isRunning={isRunning}
                  onClear={handleClearOutput}
                />
              </div>
            </div>
          }
        />
      </main>
    </div>
  );
}

export default function Home() {
  return <PythonPlayground />;
}

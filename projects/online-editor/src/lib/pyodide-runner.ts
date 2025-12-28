export interface ExecutionResult {
  output: string[];
  errors: string[];
  executionTime: number;
}

export interface PyodideRunner {
  initialize(): Promise<void>;
  runCode(code: string): Promise<ExecutionResult>;
  installPackage(packageName: string): Promise<void>;
  isReady(): boolean;
}

// Global Pyodide type declaration
declare global {
  interface Window {
    loadPyodide: any;
  }
}

class PyodideRunnerImpl implements PyodideRunner {
  private pyodide: any = null;
  private ready = false;
  private initializing = false;

  async initialize(): Promise<void> {
    if (this.ready) return;
    if (this.initializing) {
      // Wait for existing initialization to complete
      while (this.initializing && !this.ready) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.initializing = true;

    try {
      console.log('Starting Pyodide initialization...');
      
      // Wait for Pyodide script to load
      await this.waitForPyodide();

      if (!window.loadPyodide) {
        throw new Error('Pyodide script not loaded');
      }
      
      this.pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
      });

      console.log('Pyodide loaded successfully');

      // Test basic functionality
      this.pyodide.runPython(`
import sys
print("Python", sys.version)
`);

      this.ready = true;
      this.initializing = false;
      console.log('Pyodide initialization completed successfully');
    } catch (error: any) {
      this.initializing = false;
      console.error('Failed to initialize Pyodide:', error);
      throw new Error(`Pyodide initialization failed: ${error.message || error}`);
    }
  }

  private async waitForPyodide(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window not available'));
        return;
      }

      if (window.loadPyodide) {
        resolve();
        return;
      }

      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max
      
      const checkPyodide = () => {
        attempts++;
        if (window.loadPyodide) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Pyodide script failed to load within timeout'));
        } else {
          setTimeout(checkPyodide, 100);
        }
      };

      checkPyodide();
    });
  }

  async runCode(code: string): Promise<ExecutionResult> {
    if (!this.ready) {
      throw new Error('Pyodide not initialized. Please wait for initialization to complete.');
    }

    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      // Simple approach: capture print output
      this.pyodide.runPython(`
import sys
from io import StringIO

# Capture stdout
old_stdout = sys.stdout
sys.stdout = captured_output = StringIO()
`);

      try {
        // Execute user code
        this.pyodide.runPython(code);
      } catch (execError: any) {
        errors.push(execError.message || 'Execution error');
      }

      // Get captured output and restore stdout
      const result = this.pyodide.runPython(`
output = captured_output.getvalue()
sys.stdout = old_stdout
output
`);
      
      if (result) {
        output.push(...result.split('\n').filter((line: string) => line.trim()));
      }
      
    } catch (error: any) {
      console.error('Python execution error:', error);
      errors.push(error.message || 'Unknown error occurred');
    }

    const executionTime = performance.now() - startTime;

    return {
      output,
      errors,
      executionTime,
    };
  }

  async installPackage(packageName: string): Promise<void> {
    if (!this.ready) {
      throw new Error('Pyodide not initialized');
    }

    try {
      await this.pyodide.loadPackage(packageName);
    } catch (error: any) {
      console.error(`Failed to install package ${packageName}:`, error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.ready;
  }
}

// Singleton instance
let pyodideRunner: PyodideRunner | null = null;

export function getPyodideRunner(): PyodideRunner {
  if (!pyodideRunner) {
    pyodideRunner = new PyodideRunnerImpl();
  }
  return pyodideRunner;
}
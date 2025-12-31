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
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.ready) return;
    
    // Return existing initialization promise if already initializing
    if (this.initializing && this.initPromise) {
      return this.initPromise;
    }

    this.initializing = true;
    this.initPromise = this.doInitialize();
    
    try {
      await this.initPromise;
    } finally {
      this.initializing = false;
    }
  }

  private async doInitialize(): Promise<void> {
    try {
      console.log('Starting Pyodide initialization...');
      
      // Wait for Pyodide script to load
      await this.waitForPyodide();

      if (!window.loadPyodide) {
        throw new Error('Pyodide script not loaded');
      }
      
      console.log('Loading Pyodide...');
      this.pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/',
        stdout: (text: string) => console.log('Python stdout:', text),
        stderr: (text: string) => console.error('Python stderr:', text),
      });

      console.log('Pyodide loaded successfully');

      // Test basic functionality
      await this.pyodide.runPythonAsync(`
import sys
print("Python", sys.version)
print("Pyodide initialization complete")
`);

      this.ready = true;
      console.log('Pyodide initialization completed successfully');
    } catch (error: any) {
      console.error('Failed to initialize Pyodide:', error);
      this.ready = false;
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
      // Setup output capture
      await this.pyodide.runPythonAsync(`
import sys
import io
import contextlib

# Create string buffers for stdout and stderr
stdout_buffer = io.StringIO()
stderr_buffer = io.StringIO()

# Context manager to capture output
@contextlib.contextmanager
def capture_output():
    old_stdout, old_stderr = sys.stdout, sys.stderr
    try:
        sys.stdout, sys.stderr = stdout_buffer, stderr_buffer
        yield
    finally:
        sys.stdout, sys.stderr = old_stdout, old_stderr
`);

      try {
        // Execute user code with output capture
        await this.pyodide.runPythonAsync(`
with capture_output():
${code.split('\n').map(line => '    ' + line).join('\n')}
`);
      } catch (execError: any) {
        errors.push(execError.message || 'Execution error');
      }

      // Get captured output
      const stdoutResult = await this.pyodide.runPythonAsync('stdout_buffer.getvalue()');
      const stderrResult = await this.pyodide.runPythonAsync('stderr_buffer.getvalue()');
      
      if (stdoutResult && stdoutResult.trim()) {
        output.push(...stdoutResult.split('\n').filter((line: string) => line.trim()));
      }
      
      if (stderrResult && stderrResult.trim()) {
        errors.push(...stderrResult.split('\n').filter((line: string) => line.trim()));
      }

      // Clear buffers for next execution
      await this.pyodide.runPythonAsync(`
stdout_buffer.seek(0)
stdout_buffer.truncate(0)
stderr_buffer.seek(0)
stderr_buffer.truncate(0)
`);
      
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
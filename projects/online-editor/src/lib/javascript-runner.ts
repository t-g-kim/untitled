interface ExecutionResult {
  output: string[];
  errors: string[];
  executionTime: number;
}

export class JavaScriptRunner {
  private originalConsole: Console;
  private capturedLogs: string[] = [];

  constructor() {
    this.originalConsole = console;
  }

  private captureConsole() {
    const self = this;
    
    // Override console methods
    (window as any).console = {
      log: (...args: any[]) => {
        self.capturedLogs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        self.originalConsole.log(...args);
      },
      error: (...args: any[]) => {
        self.capturedLogs.push(`ERROR: ${args.map(arg => String(arg)).join(' ')}`);
        self.originalConsole.error(...args);
      },
      warn: (...args: any[]) => {
        self.capturedLogs.push(`WARN: ${args.map(arg => String(arg)).join(' ')}`);
        self.originalConsole.warn(...args);
      },
      info: (...args: any[]) => {
        self.capturedLogs.push(`INFO: ${args.map(arg => String(arg)).join(' ')}`);
        self.originalConsole.info(...args);
      }
    };
  }

  private restoreConsole() {
    (window as any).console = this.originalConsole;
  }

  async runCode(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    this.capturedLogs = [];
    const errors: string[] = [];

    try {
      this.captureConsole();
      
      // Create a function to execute the code in a controlled environment
      const executeCode = new Function(code);
      executeCode();
      
    } catch (error: any) {
      errors.push(error.message || 'JavaScript execution error');
    } finally {
      this.restoreConsole();
    }

    const executionTime = performance.now() - startTime;

    return {
      output: this.capturedLogs,
      errors,
      executionTime
    };
  }

  async runTypeScript(code: string): Promise<ExecutionResult> {
    // For TypeScript, we'll transpile it to JavaScript first
    // This is a simplified version - in production you'd use the TypeScript compiler
    try {
      // Use a line-by-line approach for safer conversion
      const lines = code.split('\n');
      const jsLines: string[] = [];
      let insideInterface = false;
      let braceCount = 0;
      
      for (let line of lines) {
        const trimmedLine = line.trim();
        
        // Handle interface declarations
        if (trimmedLine.startsWith('interface ')) {
          insideInterface = true;
          braceCount = 1; // Start with 1 because interface line has opening brace
          continue;
        }
        
        if (insideInterface) {
          // Count braces to know when interface ends
          for (let char of line) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
          }
          
          if (braceCount <= 0) {
            insideInterface = false;
          }
          continue;
        }
        
        // Skip type declarations
        if (trimmedLine.startsWith('type ')) {
          continue;
        }
        
        // Process function declarations with return types
        if (line.includes('function ') && line.includes('): ')) {
          line = line.replace(/\):\s*\w+\s*\{/, ') {');
        }
        
        // Process parameter type annotations in function declarations
        if (line.includes('function ') && line.includes(':')) {
          line = line.replace(/(\w+):\s*\w+\[\]/g, '$1'); // Handle array types like number[]
          line = line.replace(/(\w+):\s*\w+/g, '$1'); // Handle regular types
        }
        
        // Process variable declarations with type annotations
        if ((line.includes('const ') || line.includes('let ') || line.includes('var ')) && line.includes(': ')) {
          line = line.replace(/(const|let|var)\s+(\w+):\s*[^=]+=/g, '$1 $2 =');
        }
        
        jsLines.push(line);
      }
      
      const jsCode = jsLines.join('\n');
      
      console.log('Original TypeScript:', code);
      console.log('Converted JavaScript:', jsCode);

      return await this.runCode(jsCode);
    } catch (error: any) {
      console.error('TypeScript conversion error:', error);
      return {
        output: [],
        errors: [`TypeScript compilation error: ${error.message}`],
        executionTime: 0
      };
    }
  }
}

export const javascriptRunner = new JavaScriptRunner();
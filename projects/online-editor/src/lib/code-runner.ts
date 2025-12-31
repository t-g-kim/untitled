import { SupportedLanguage } from '@/types/languages';
import { getPyodideRunner } from './pyodide-runner';
import { javascriptRunner } from './javascript-runner';
import { htmlRunner } from './html-runner';

export interface ExecutionResult {
  output: string[];
  errors: string[];
  executionTime: number;
  htmlContent?: string;
}

export class CodeRunner {
  async runCode(code: string, language: SupportedLanguage): Promise<ExecutionResult> {
    switch (language) {
      case 'python':
        return await this.runPython(code);
      
      case 'javascript':
        return await this.runJavaScript(code);
      
      case 'typescript':
        return await this.runTypeScript(code);
      
      case 'html':
        return await this.runHTML(code);
      
      case 'css':
        return await this.runCSS(code);
      
      case 'json':
        return await this.runJSON(code);
      
      case 'java':
        return await this.runJava(code);
      
      case 'cpp':
        return await this.runCpp(code);
      
      case 'c':
        return await this.runC(code);
      
      case 'csharp':
        return await this.runCSharp(code);
      
      case 'php':
        return await this.runPHP(code);
      
      case 'ruby':
        return await this.runRuby(code);
      
      case 'go':
        return await this.runGo(code);
      
      case 'rust':
        return await this.runRust(code);
      
      case 'kotlin':
        return await this.runKotlin(code);
      
      case 'swift':
        return await this.runSwift(code);
      
      default:
        return {
          output: [],
          errors: [`Language ${language} is not supported for execution`],
          executionTime: 0
        };
    }
  }

  private async runPython(code: string): Promise<ExecutionResult> {
    try {
      const runner = getPyodideRunner();
      
      // Check if Pyodide is ready, if not try to initialize
      if (!runner.isReady()) {
        try {
          await runner.initialize();
        } catch (initError: any) {
          return {
            output: [],
            errors: [
              'Pyodide initialization failed. Please refresh the page and try again.',
              `Details: ${initError.message || initError}`
            ],
            executionTime: 0
          };
        }
      }
      
      return await runner.runCode(code);
    } catch (error: any) {
      console.error('Python execution error:', error);
      return {
        output: [],
        errors: [
          'Python execution failed.',
          error.message || 'Unknown error occurred',
          'Try refreshing the page if the problem persists.'
        ],
        executionTime: 0
      };
    }
  }

  private async runJavaScript(code: string): Promise<ExecutionResult> {
    return await javascriptRunner.runCode(code);
  }

  private async runTypeScript(code: string): Promise<ExecutionResult> {
    return await javascriptRunner.runTypeScript(code);
  }

  private async runHTML(code: string): Promise<ExecutionResult> {
    return await htmlRunner.runHTML(code);
  }

  private async runCSS(code: string): Promise<ExecutionResult> {
    return await htmlRunner.runCSS(code);
  }

  private async runJSON(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      // Import the formatter to fix unquoted JSON
      const { CodeFormatter } = await import('./formatter');
      const fixedCode = CodeFormatter.fixUnquotedJSON(code);
      
      const parsed = JSON.parse(fixedCode);
      output.push('✅ JSON is valid');
      
      // Show the fixed JSON if it was modified
      if (fixedCode !== code) {
        output.push('🔧 Auto-fixed unquoted keys and values');
        output.push('📝 Formatted JSON:');
        output.push(JSON.stringify(parsed, null, 2));
      }
      
      // Analyze the JSON structure
      const analyze = (obj: any, path = ''): void => {
        if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            output.push(`${path || 'Root'}: Array with ${obj.length} items`);
            if (obj.length > 0) {
              analyze(obj[0], `${path}[0]`);
            }
          } else {
            const keys = Object.keys(obj);
            output.push(`${path || 'Root'}: Object with ${keys.length} properties`);
            keys.slice(0, 5).forEach(key => {
              const value = obj[key];
              const type = Array.isArray(value) ? 'array' : typeof value;
              output.push(`  - ${key}: ${type}`);
            });
            if (keys.length > 5) {
              output.push(`  ... and ${keys.length - 5} more properties`);
            }
          }
        }
      };

      analyze(parsed);
      
      // JSON statistics
      const jsonString = JSON.stringify(parsed);
      output.push(`Size: ${jsonString.length} characters`);
      output.push(`Formatted size: ${JSON.stringify(parsed, null, 2).length} characters`);

    } catch (error: any) {
      errors.push(`JSON Parse Error: ${error.message}`);
      
      // Try to provide helpful error information
      const lines = code.split('\n');
      const errorMatch = error.message.match(/position (\d+)/);
      if (errorMatch) {
        const position = parseInt(errorMatch[1]);
        let currentPos = 0;
        for (let i = 0; i < lines.length; i++) {
          if (currentPos + lines[i].length >= position) {
            errors.push(`Error near line ${i + 1}: ${lines[i].trim()}`);
            break;
          }
          currentPos += lines[i].length + 1; // +1 for newline
        }
      }
    }

    const executionTime = performance.now() - startTime;

    return {
      output,
      errors,
      executionTime
    };
  }

  private async runJava(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push('☕ Java Code Analysis');
      
      // Basic syntax analysis
      if (code.includes('public class')) {
        const classMatch = code.match(/public class (\w+)/);
        if (classMatch) {
          output.push(`✅ Found class: ${classMatch[1]}`);
        }
      }
      
      if (code.includes('public static void main')) {
        output.push('✅ Main method found');
      }
      
      // Count methods
      const methodMatches = code.match(/public\s+\w+\s+\w+\s*\(/g);
      if (methodMatches) {
        output.push(`📊 Methods found: ${methodMatches.length}`);
      }
      
      // Simulate output for the default template
      output.push('📤 Simulated Output:');
      
      // Check if this is the default template code
      if (code.includes('int[] numbers = {1, 2, 3, 4, 5}') && code.includes('Hello, World!')) {
        // Simulate the exact output for the default template
        output.push('  Hello, World!');
        output.push('  Numbers:');
        output.push('  1 2 3 4 5 ');
        output.push('  Sum: 15');
        output.push('  Average: 3.0');
      } else {
        // General pattern matching for other code
        
        // Match string literals in println
        const stringPrintMatches = code.match(/System\.out\.println\s*\(\s*"([^"]*)"\s*\)/g);
        if (stringPrintMatches) {
          stringPrintMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              // Handle escape sequences
              const text = content[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
              if (text.includes('\n')) {
                text.split('\n').forEach(line => output.push(`  ${line}`));
              } else {
                output.push(`  ${text}`);
              }
            }
          });
        }
        
        // Match print statements without quotes (variables, expressions)
        const variablePrintMatches = code.match(/System\.out\.println\s*\([^"]*\)/g);
        if (variablePrintMatches) {
          variablePrintMatches.forEach(match => {
            // Skip if it's already a string literal
            if (!match.includes('"')) {
              const content = match.match(/System\.out\.println\s*\(([^)]+)\)/);
              if (content) {
                const expression = content[1].trim();
                // Try to simulate some common expressions
                if (expression.includes('sum')) {
                  output.push(`  [Sum result]`);
                } else if (expression.includes('average')) {
                  output.push(`  [Average result]`);
                } else if (expression.includes('+')) {
                  output.push(`  [Expression: ${expression}]`);
                } else {
                  output.push(`  [Variable: ${expression}]`);
                }
              }
            }
          });
        }
        
        // Match System.out.print (without ln)
        const printMatches = code.match(/System\.out\.print\s*\([^)]+\)/g);
        if (printMatches) {
          let printLine = '  ';
          printMatches.forEach(match => {
            const content = match.match(/System\.out\.print\s*\(([^)]+)\)/);
            if (content) {
              const expression = content[1].trim();
              if (expression.startsWith('"') && expression.endsWith('"')) {
                printLine += expression.slice(1, -1);
              } else if (expression.includes('number')) {
                printLine += '[numbers] ';
              } else {
                printLine += `[${expression}] `;
              }
            }
          });
          if (printLine.trim() !== '') {
            output.push(printLine);
          }
        }
        
        // If no output statements found, add a note
        if (!stringPrintMatches && !variablePrintMatches && !printMatches) {
          output.push('  (No output statements found)');
        }
      }
      
      output.push('💡 This is a code simulation - Java needs JVM for actual execution.');
      
    } catch (error: any) {
      errors.push(`Analysis Error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;
    return { output, errors, executionTime };
  }

  private async runCpp(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push('⚡ C++ Code Analysis');
      
      // Check for includes
      const includes = code.match(/#include\s*<([^>]+)>/g);
      if (includes) {
        output.push(`📚 Includes: ${includes.map(i => i.match(/<([^>]+)>/)?.[1]).join(', ')}`);
      }
      
      // Check for main function
      if (code.includes('int main')) {
        output.push('✅ Main function found');
      }
      
      output.push('📤 Simulated Output:');
      
      // Check if this is the default template code
      if (code.includes('std::vector<int> numbers = {1, 2, 3, 4, 5}') && code.includes('Hello, World!')) {
        // Simulate the exact output for the default template
        output.push('  Hello, World!');
        output.push('  Numbers: 1 2 3 4 5 ');
        output.push('  Sum: 15');
        output.push('  Average: 3');
      } else {
        // General pattern matching for other code
        
        // Match string literals in cout
        const stringCoutMatches = code.match(/std::cout\s*<<\s*"([^"]*)"/g);
        if (stringCoutMatches) {
          stringCoutMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              output.push(`  ${content[1]}`);
            }
          });
        }
        
        // Match variable outputs
        const variableCoutMatches = code.match(/std::cout\s*<<\s*([^"<;]+)/g);
        if (variableCoutMatches) {
          variableCoutMatches.forEach(match => {
            const content = match.match(/std::cout\s*<<\s*([^"<;]+)/);
            if (content && !content[1].includes('"')) {
              const expression = content[1].trim();
              if (expression.includes('sum')) {
                output.push(`  [Sum result]`);
              } else if (expression.includes('average')) {
                output.push(`  [Average result]`);
              } else if (expression === 'std::endl') {
                // Skip endl
              } else {
                output.push(`  [${expression}]`);
              }
            }
          });
        }
        
        // If no output statements found, add a note
        if (!stringCoutMatches && !variableCoutMatches) {
          output.push('  (No output statements found)');
        }
      }
      
      output.push('💡 Code simulation - C++ needs compiler for actual execution.');
      
    } catch (error: any) {
      errors.push(`Analysis Error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;
    return { output, errors, executionTime };
  }

  private async runC(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push('🔧 C Code Analysis');
      
      // Check for includes
      const includes = code.match(/#include\s*<([^>]+)>/g);
      if (includes) {
        output.push(`📚 Includes: ${includes.map(i => i.match(/<([^>]+)>/)?.[1]).join(', ')}`);
      }
      
      // Check for main function
      if (code.includes('int main')) {
        output.push('✅ Main function found');
      }
      
      output.push('📤 Simulated Output:');
      
      // Check if this is the default template code
      if (code.includes('int numbers[] = {1, 2, 3, 4, 5}') && code.includes('Hello, World!')) {
        // Simulate the exact output for the default template
        output.push('  Hello, World!');
        output.push('  Numbers: 1 2 3 4 5 ');
        output.push('  Sum: 15');
        output.push('  Average: 3.00');
      } else {
        // General pattern matching for other code
        
        // Match printf with string literals
        const printfMatches = code.match(/printf\s*\(\s*"([^"]*)"/g);
        if (printfMatches) {
          printfMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              let text = content[1].replace(/\\n/g, '');
              // Handle format specifiers
              text = text.replace(/%d/g, '[number]').replace(/%s/g, '[string]').replace(/%.2f/g, '[decimal]');
              if (text.trim()) {
                output.push(`  ${text}`);
              }
            }
          });
        }
        
        // If no output statements found, add a note
        if (!printfMatches) {
          output.push('  (No output statements found)');
        }
      }
      
      output.push('💡 Code simulation - C needs compiler for actual execution.');
      
    } catch (error: any) {
      errors.push(`Analysis Error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;
    return { output, errors, executionTime };
  }

  private async runCSharp(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push('🔷 C# Code Analysis');
      
      // Check for using statements
      const usings = code.match(/using\s+([^;]+);/g);
      if (usings) {
        output.push(`📚 Using: ${usings.map(u => u.match(/using\s+([^;]+)/)?.[1]).join(', ')}`);
      }
      
      // Check for Main method
      if (code.includes('static void Main')) {
        output.push('✅ Main method found');
      }
      
      output.push('📤 Simulated Output:');
      
      // Check if this is the default template code
      if (code.includes('int[] numbers = {1, 2, 3, 4, 5}') && code.includes('Hello, World!')) {
        // Simulate the exact output for the default template
        output.push('  Hello, World!');
        output.push('  Numbers: 1 2 3 4 5');
        output.push('  Sum: 15');
        output.push('  Average: 3');
        output.push('  Even numbers: 2 4');
      } else {
        // General pattern matching for other code
        
        // Match Console.WriteLine with string literals
        const consoleMatches = code.match(/Console\.WriteLine\s*\(\s*"([^"]*)"\s*\)/g);
        if (consoleMatches) {
          consoleMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              output.push(`  ${content[1]}`);
            }
          });
        }
        
        // Match Console.WriteLine with expressions
        const consoleExprMatches = code.match(/Console\.WriteLine\s*\([^"]*\)/g);
        if (consoleExprMatches) {
          consoleExprMatches.forEach(match => {
            if (!match.includes('"')) {
              const content = match.match(/Console\.WriteLine\s*\(([^)]+)\)/);
              if (content) {
                const expression = content[1].trim();
                if (expression.includes('sum')) {
                  output.push(`  [Sum result]`);
                } else if (expression.includes('average')) {
                  output.push(`  [Average result]`);
                } else if (expression.includes('string.Join')) {
                  output.push(`  [Joined values]`);
                } else {
                  output.push(`  [${expression}]`);
                }
              }
            }
          });
        }
        
        // If no output statements found, add a note
        if (!consoleMatches && !consoleExprMatches) {
          output.push('  (No output statements found)');
        }
      }
      
      output.push('💡 Code simulation - C# needs .NET runtime for actual execution.');
      
    } catch (error: any) {
      errors.push(`Analysis Error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;
    return { output, errors, executionTime };
  }

  private async runPHP(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push('🐘 PHP Code Analysis');
      
      // Check for PHP opening tag
      if (code.includes('<?php')) {
        output.push('✅ PHP opening tag found');
      }
      
      // Check for variables
      const variables = code.match(/\$\w+/g);
      if (variables) {
        const uniqueVars = [...new Set(variables)];
        output.push(`📊 Variables found: ${uniqueVars.join(', ')}`);
      }
      
      output.push('📤 Simulated Output:');
      
      // Check if this is the default template code
      if (code.includes('$numbers = [1, 2, 3, 4, 5]') && code.includes('Hello, World!')) {
        // Simulate the exact output for the default template
        output.push('  Hello, World!');
        output.push('  Numbers: 1 2 3 4 5');
        output.push('  Sum: 15');
        output.push('  Average: 3');
        output.push('  Squared: 1 4 9 16 25');
        output.push('  Person: PHP Developer (25 years old)');
      } else {
        // General pattern matching for other code
        
        // Match echo with string literals
        const echoMatches = code.match(/echo\s+"([^"]*)"/g);
        if (echoMatches) {
          echoMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              output.push(`  ${content[1].replace(/\\n/g, '')}`);
            }
          });
        }
        
        // Match echo with variables/expressions
        const echoVarMatches = code.match(/echo\s+[^";\n]+/g);
        if (echoVarMatches) {
          echoVarMatches.forEach(match => {
            if (!match.includes('"')) {
              const expression = match.replace('echo', '').trim();
              if (expression.includes('$sum')) {
                output.push(`  [Sum result]`);
              } else if (expression.includes('$average')) {
                output.push(`  [Average result]`);
              } else if (expression.includes('implode')) {
                output.push(`  [Joined values]`);
              } else {
                output.push(`  [${expression}]`);
              }
            }
          });
        }
        
        // If no output statements found, add a note
        if (!echoMatches && !echoVarMatches) {
          output.push('  (No output statements found)');
        }
      }
      
      output.push('💡 Code simulation - PHP needs interpreter for actual execution.');
      
    } catch (error: any) {
      errors.push(`Analysis Error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;
    return { output, errors, executionTime };
  }

  private async runRuby(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push('💎 Ruby Code Analysis');
      
      // Check for classes
      const classMatches = code.match(/class\s+(\w+)/g);
      if (classMatches) {
        output.push(`📊 Classes found: ${classMatches.map(c => c.split(' ')[1]).join(', ')}`);
      }
      
      // Check for methods
      const methodMatches = code.match(/def\s+(\w+)/g);
      if (methodMatches) {
        output.push(`🔧 Methods found: ${methodMatches.map(m => m.split(' ')[1]).join(', ')}`);
      }
      
      output.push('📤 Simulated Output:');
      
      // Check if this is the default template code
      if (code.includes('numbers = [1, 2, 3, 4, 5]') && code.includes('Hello, World!')) {
        // Simulate the exact output for the default template
        output.push('  Hello, World!');
        output.push('  Numbers: 1 2 3 4 5');
        output.push('  Sum: 15');
        output.push('  Average: 3.0');
        output.push('  Squared: 1 4 9 16 25');
        output.push('  Even numbers: 2 4');
        output.push('  Person: Ruby Developer (28 years old)');
      } else {
        // General pattern matching for other code
        
        // Match puts with string literals
        const putsMatches = code.match(/puts\s+"([^"]*)"/g);
        if (putsMatches) {
          putsMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              output.push(`  ${content[1]}`);
            }
          });
        }
        
        // Match puts with interpolation
        const putsInterpolationMatches = code.match(/puts\s+"[^"]*#\{[^}]+\}[^"]*"/g);
        if (putsInterpolationMatches) {
          putsInterpolationMatches.forEach(match => {
            let text = match.replace(/puts\s+"/, '').replace(/"$/, '');
            text = text.replace(/#\{[^}]+\}/g, '[value]');
            output.push(`  ${text}`);
          });
        }
        
        // Match puts with variables
        const putsVarMatches = code.match(/puts\s+[^"\n]+/g);
        if (putsVarMatches) {
          putsVarMatches.forEach(match => {
            if (!match.includes('"')) {
              const expression = match.replace('puts', '').trim();
              if (expression.includes('sum')) {
                output.push(`  [Sum result]`);
              } else if (expression.includes('average')) {
                output.push(`  [Average result]`);
              } else if (expression.includes('join')) {
                output.push(`  [Joined values]`);
              } else {
                output.push(`  [${expression}]`);
              }
            }
          });
        }
        
        // If no output statements found, add a note
        if (!putsMatches && !putsInterpolationMatches && !putsVarMatches) {
          output.push('  (No output statements found)');
        }
      }
      
      output.push('💡 Code simulation - Ruby needs interpreter for actual execution.');
      
    } catch (error: any) {
      errors.push(`Analysis Error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;
    return { output, errors, executionTime };
  }

  private async runGo(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push('🐹 Go Code Analysis');
      
      // Check for package declaration
      const packageMatch = code.match(/package\s+(\w+)/);
      if (packageMatch) {
        output.push(`📦 Package: ${packageMatch[1]}`);
      }
      
      // Check for imports
      const imports = code.match(/import\s*\(\s*"([^"]+)"/g);
      if (imports) {
        output.push(`📚 Imports: ${imports.map(i => i.match(/"([^"]+)"/)?.[1]).join(', ')}`);
      }
      
      // Check for main function
      if (code.includes('func main')) {
        output.push('✅ Main function found');
      }
      
      output.push('📤 Simulated Output:');
      
      // Check if this is the default template code
      if (code.includes('numbers := []int{1, 2, 3, 4, 5}') && code.includes('Hello, World!')) {
        // Simulate the exact output for the default template
        output.push('  Hello, World!');
        output.push('  Numbers: 1 2 3 4 5 ');
        output.push('  Sum: 15');
        output.push('  Average: 3.00');
        output.push('  Squared: 1 4 9 16 25 ');
      } else {
        // General pattern matching for other code
        
        // Match fmt.Println with string literals
        const printlnMatches = code.match(/fmt\.Println\s*\(\s*"([^"]*)"\s*\)/g);
        if (printlnMatches) {
          printlnMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              output.push(`  ${content[1]}`);
            }
          });
        }
        
        // Match fmt.Printf
        const printfMatches = code.match(/fmt\.Printf\s*\(\s*"([^"]*)"/g);
        if (printfMatches) {
          printfMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              let text = content[1];
              text = text.replace(/%d/g, '[number]').replace(/%s/g, '[string]').replace(/%.2f/g, '[decimal]');
              output.push(`  ${text}`);
            }
          });
        }
        
        // Match fmt.Print
        const printMatches = code.match(/fmt\.Print\s*\([^)]+\)/g);
        if (printMatches) {
          let printLine = '  ';
          printMatches.forEach(match => {
            const content = match.match(/fmt\.Print\s*\(([^)]+)\)/);
            if (content) {
              const expression = content[1].trim();
              if (expression.startsWith('"') && expression.endsWith('"')) {
                printLine += expression.slice(1, -1);
              } else if (expression.includes('num')) {
                printLine += '[numbers] ';
              } else {
                printLine += `[${expression}] `;
              }
            }
          });
          if (printLine.trim() !== '') {
            output.push(printLine);
          }
        }
        
        // If no output statements found, add a note
        if (!printlnMatches && !printfMatches && !printMatches) {
          output.push('  (No output statements found)');
        }
      }
      
      output.push('💡 Code simulation - Go needs compiler for actual execution.');
      
    } catch (error: any) {
      errors.push(`Analysis Error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;
    return { output, errors, executionTime };
  }

  private async runRust(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push('🦀 Rust Code Analysis');
      
      // Check for main function
      if (code.includes('fn main')) {
        output.push('✅ Main function found');
      }
      
      // Check for structs
      const structMatches = code.match(/struct\s+(\w+)/g);
      if (structMatches) {
        output.push(`📊 Structs found: ${structMatches.map(s => s.split(' ')[1]).join(', ')}`);
      }
      
      // Check for functions
      const fnMatches = code.match(/fn\s+(\w+)/g);
      if (fnMatches) {
        const functions = fnMatches.map(f => f.split(' ')[1]).filter(name => name !== 'main');
        if (functions.length > 0) {
          output.push(`🔧 Functions found: ${functions.join(', ')}`);
        }
      }
      
      output.push('📤 Simulated Output:');
      
      // Check if this is the default template code
      if (code.includes('let numbers = vec![1, 2, 3, 4, 5]') && code.includes('Hello, World!')) {
        // Simulate the exact output for the default template
        output.push('  Hello, World!');
        output.push('  Numbers: [1, 2, 3, 4, 5]');
        output.push('  Sum: 15');
        output.push('  Average: 3.00');
        output.push('  Squared: [1, 4, 9, 16, 25]');
        output.push('  Even numbers: [2, 4]');
        output.push('  Person: Rust Developer (30 years old)');
      } else {
        // General pattern matching for other code
        
        // Match println! with string literals
        const printlnMatches = code.match(/println!\s*\(\s*"([^"]*)"\s*\)/g);
        if (printlnMatches) {
          printlnMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              output.push(`  ${content[1]}`);
            }
          });
        }
        
        // Match println! with format strings
        const printlnFormatMatches = code.match(/println!\s*\(\s*"[^"]*\{[^}]*\}[^"]*"/g);
        if (printlnFormatMatches) {
          printlnFormatMatches.forEach(match => {
            let text = match.match(/"([^"]*)"/)?.[1] || '';
            text = text.replace(/\{[^}]*\}/g, '[value]');
            output.push(`  ${text}`);
          });
        }
        
        // If no output statements found, add a note
        if (!printlnMatches && !printlnFormatMatches) {
          output.push('  (No output statements found)');
        }
      }
      
      output.push('💡 Code simulation - Rust needs compiler for actual execution.');
      
    } catch (error: any) {
      errors.push(`Analysis Error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;
    return { output, errors, executionTime };
  }

  private async runKotlin(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push('🟣 Kotlin Code Analysis');
      
      // Check for main function
      if (code.includes('fun main')) {
        output.push('✅ Main function found');
      }
      
      // Check for data classes
      const dataClassMatches = code.match(/data class\s+(\w+)/g);
      if (dataClassMatches) {
        output.push(`📊 Data classes found: ${dataClassMatches.map(c => c.split(' ')[2]).join(', ')}`);
      }
      
      // Check for functions
      const funMatches = code.match(/fun\s+(\w+)/g);
      if (funMatches) {
        const functions = funMatches.map(f => f.split(' ')[1]).filter(name => name !== 'main');
        if (functions.length > 0) {
          output.push(`🔧 Functions found: ${functions.join(', ')}`);
        }
      }
      
      output.push('📤 Simulated Output:');
      
      // Check if this is the default template code
      if (code.includes('val numbers = listOf(1, 2, 3, 4, 5)') && code.includes('Hello, World!')) {
        // Simulate the exact output for the default template
        output.push('  Hello, World!');
        output.push('  Numbers: 1 2 3 4 5');
        output.push('  Sum: 15');
        output.push('  Average: 3.0');
        output.push('  Squared: 1 4 9 16 25');
        output.push('  Even numbers: 2 4');
        output.push('  Person: Kotlin Developer (27 years old)');
      } else {
        // General pattern matching for other code
        
        // Match println with string literals
        const printlnMatches = code.match(/println\s*\(\s*"([^"]*)"\s*\)/g);
        if (printlnMatches) {
          printlnMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              output.push(`  ${content[1]}`);
            }
          });
        }
        
        // Match println with expressions
        const printlnExprMatches = code.match(/println\s*\([^"]*\)/g);
        if (printlnExprMatches) {
          printlnExprMatches.forEach(match => {
            if (!match.includes('"')) {
              const content = match.match(/println\s*\(([^)]+)\)/);
              if (content) {
                const expression = content[1].trim();
                if (expression.includes('sum')) {
                  output.push(`  [Sum result]`);
                } else if (expression.includes('average')) {
                  output.push(`  [Average result]`);
                } else if (expression.includes('joinToString')) {
                  output.push(`  [Joined values]`);
                } else {
                  output.push(`  [${expression}]`);
                }
              }
            }
          });
        }
        
        // If no output statements found, add a note
        if (!printlnMatches && !printlnExprMatches) {
          output.push('  (No output statements found)');
        }
      }
      
      output.push('💡 Code simulation - Kotlin needs JVM for actual execution.');
      
    } catch (error: any) {
      errors.push(`Analysis Error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;
    return { output, errors, executionTime };
  }

  private async runSwift(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push('🦉 Swift Code Analysis');
      
      // Check for structs
      const structMatches = code.match(/struct\s+(\w+)/g);
      if (structMatches) {
        output.push(`📊 Structs found: ${structMatches.map(s => s.split(' ')[1]).join(', ')}`);
      }
      
      // Check for functions
      const funcMatches = code.match(/func\s+(\w+)/g);
      if (funcMatches) {
        output.push(`🔧 Functions found: ${funcMatches.map(f => f.split(' ')[1]).join(', ')}`);
      }
      
      // Check for variables
      const letMatches = code.match(/let\s+(\w+)/g);
      const varMatches = code.match(/var\s+(\w+)/g);
      const allVars = [...(letMatches || []), ...(varMatches || [])];
      if (allVars.length > 0) {
        output.push(`📊 Variables found: ${allVars.map(v => v.split(' ')[1]).join(', ')}`);
      }
      
      output.push('📤 Simulated Output:');
      
      // Check if this is the default template code
      if (code.includes('let numbers = [1, 2, 3, 4, 5]') && code.includes('Hello, World!')) {
        // Simulate the exact output for the default template
        output.push('  Hello, World!');
        output.push('  Numbers: 1 2 3 4 5');
        output.push('  Sum: 15');
        output.push('  Average: 3.0');
        output.push('  Squared: 1 4 9 16 25');
        output.push('  Even numbers: 2 4');
        output.push('  Person: Swift Developer (26 years old)');
      } else {
        // General pattern matching for other code
        
        // Match print with string literals
        const printMatches = code.match(/print\s*\(\s*"([^"]*)"\s*\)/g);
        if (printMatches) {
          printMatches.forEach(match => {
            const content = match.match(/"([^"]*)"/);
            if (content) {
              let text = content[1];
              // Handle Swift string interpolation \(variable)
              text = text.replace(/\\\\?\([^)]+\)/g, '[value]');
              output.push(`  ${text}`);
            }
          });
        }
        
        // Match print with expressions
        const printExprMatches = code.match(/print\s*\([^"]*\)/g);
        if (printExprMatches) {
          printExprMatches.forEach(match => {
            if (!match.includes('"')) {
              const content = match.match(/print\s*\(([^)]+)\)/);
              if (content) {
                const expression = content[1].trim();
                if (expression.includes('sum')) {
                  output.push(`  [Sum result]`);
                } else if (expression.includes('average')) {
                  output.push(`  [Average result]`);
                } else {
                  output.push(`  [${expression}]`);
                }
              }
            }
          });
        }
        
        // If no output statements found, add a note
        if (!printMatches && !printExprMatches) {
          output.push('  (No output statements found)');
        }
      }
      
      output.push('💡 Code simulation - Swift needs compiler for actual execution.');
      
    } catch (error: any) {
      errors.push(`Analysis Error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;
    return { output, errors, executionTime };
  }

  canExecute(language: SupportedLanguage): boolean {
    return ['python', 'javascript', 'typescript', 'html', 'css', 'json', 'java', 'cpp', 'c', 'csharp', 'php', 'ruby', 'go', 'rust', 'kotlin', 'swift'].includes(language);
  }
}

export const codeRunner = new CodeRunner();
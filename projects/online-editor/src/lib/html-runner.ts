interface HTMLExecutionResult {
  output: string[];
  errors: string[];
  executionTime: number;
  htmlContent?: string;
}

export class HTMLRunner {
  async runHTML(code: string): Promise<HTMLExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      // Validate HTML structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'text/html');
      
      // Check for parsing errors
      const parserErrors = doc.querySelectorAll('parsererror');
      if (parserErrors.length > 0) {
        parserErrors.forEach(error => {
          errors.push(`HTML Parse Error: ${error.textContent}`);
        });
      } else {
        output.push('HTML parsed successfully');
        output.push(`Document title: ${doc.title || 'Untitled'}`);
        
        // Count elements
        const elements = doc.querySelectorAll('*');
        output.push(`Total elements: ${elements.length}`);
        
        // List main sections
        const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length > 0) {
          output.push(`Headings found: ${headings.length}`);
          headings.forEach((heading, index) => {
            if (index < 5) { // Show first 5 headings
              output.push(`  - ${heading.tagName}: ${heading.textContent?.substring(0, 50) || ''}`);
            }
          });
        }

        // Check for scripts
        const scripts = doc.querySelectorAll('script');
        if (scripts.length > 0) {
          output.push(`JavaScript blocks found: ${scripts.length}`);
        }

        // Check for styles
        const styles = doc.querySelectorAll('style');
        if (styles.length > 0) {
          output.push(`CSS style blocks found: ${styles.length}`);
        }
      }

    } catch (error: any) {
      errors.push(`HTML processing error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;

    return {
      output,
      errors,
      executionTime,
      htmlContent: code
    };
  }

  async runCSS(code: string): Promise<HTMLExecutionResult> {
    const startTime = performance.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      // Basic CSS validation
      const rules = code.split('}').filter(rule => rule.trim());
      output.push(`CSS rules parsed: ${rules.length}`);
      
      // Count selectors
      let selectorCount = 0;
      let propertyCount = 0;
      
      rules.forEach(rule => {
        const parts = rule.split('{');
        if (parts.length === 2) {
          selectorCount++;
          const properties = parts[1].split(';').filter(prop => prop.trim());
          propertyCount += properties.length;
        }
      });
      
      output.push(`Selectors found: ${selectorCount}`);
      output.push(`Properties found: ${propertyCount}`);
      
      // Check for common CSS features
      if (code.includes('@media')) {
        const mediaQueries = code.match(/@media[^{]+/g);
        output.push(`Media queries found: ${mediaQueries?.length || 0}`);
      }
      
      if (code.includes('@keyframes')) {
        const animations = code.match(/@keyframes\s+[\w-]+/g);
        output.push(`Animations defined: ${animations?.length || 0}`);
      }
      
      if (code.includes('var(--')) {
        const customProps = code.match(/var\(--[\w-]+\)/g);
        output.push(`CSS custom properties used: ${customProps?.length || 0}`);
      }

    } catch (error: any) {
      errors.push(`CSS processing error: ${error.message}`);
    }

    const executionTime = performance.now() - startTime;

    return {
      output,
      errors,
      executionTime
    };
  }
}

export const htmlRunner = new HTMLRunner();
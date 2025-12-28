export class CodeFormatter {
  // Helper function to fix unquoted JSON keys and values
  static fixUnquotedJSON(code: string): string {
    try {
      // First try to parse as-is to see if it's already valid JSON
      JSON.parse(code);
      return code; // If it parses successfully, return as-is
    } catch {
      // If parsing fails, try to fix unquoted keys and values
      let fixed = code;
      
      // Step 1: Fix unquoted keys
      fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
      
      // Step 2: Fix unquoted string values in objects
      fixed = fixed.replace(/:\s*([^",\[\]{}\n]+?)(?=\s*[,}\n])/g, (match, value) => {
        const trimmedValue = value.trim();
        
        // Skip if already quoted, boolean, null, number, or starts with [ or {
        if (trimmedValue.startsWith('"') || trimmedValue.startsWith("'") ||
            trimmedValue === 'true' || trimmedValue === 'false' || 
            trimmedValue === 'null' || trimmedValue === 'undefined' ||
            /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmedValue) ||
            trimmedValue.startsWith('[') || trimmedValue.startsWith('{')) {
          return match;
        }
        
        return `: "${trimmedValue}"`;
      });
      
      // Step 3: Fix unquoted string values in arrays
      fixed = fixed.replace(/(\[\s*|\,\s*)([^",\[\]{}\n]+?)(?=\s*[,\]\n])/g, (match, prefix, value) => {
        const trimmedValue = value.trim();
        
        // Skip if already quoted, boolean, null, number, or starts with [ or {
        if (trimmedValue.startsWith('"') || trimmedValue.startsWith("'") ||
            trimmedValue === 'true' || trimmedValue === 'false' || 
            trimmedValue === 'null' || trimmedValue === 'undefined' ||
            /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmedValue) ||
            trimmedValue.startsWith('[') || trimmedValue.startsWith('{')) {
          return match;
        }
        
        return `${prefix}"${trimmedValue}"`;
      });
      
      // Step 4: Handle values at the end of lines
      fixed = fixed.replace(/:\s*([^",\[\]{}\n]+?)\s*$/gm, (match, value) => {
        const trimmedValue = value.trim();
        
        if (trimmedValue.startsWith('"') || trimmedValue.startsWith("'") ||
            trimmedValue === 'true' || trimmedValue === 'false' || 
            trimmedValue === 'null' || /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmedValue) ||
            trimmedValue.startsWith('[') || trimmedValue.startsWith('{')) {
          return match;
        }
        
        return `: "${trimmedValue}"`;
      });
      
      // Step 5: Convert single quotes to double quotes
      fixed = fixed.replace(/'([^']*)'/g, '"$1"');
      
      return fixed;
    }
  }

  static formatJSON(code: string, indent: number = 2): { formatted: string; error?: string } {
    try {
      // First try to fix unquoted keys and values
      const fixedCode = this.fixUnquotedJSON(code);
      const parsed = JSON.parse(fixedCode);
      const formatted = JSON.stringify(parsed, null, indent);
      return { formatted };
    } catch (error: any) {
      return { 
        formatted: code, 
        error: `JSON Parse Error: ${error.message}` 
      };
    }
  }

  static minifyJSON(code: string): { formatted: string; error?: string } {
    try {
      // First try to fix unquoted keys and values
      const fixedCode = this.fixUnquotedJSON(code);
      const parsed = JSON.parse(fixedCode);
      const formatted = JSON.stringify(parsed);
      return { formatted };
    } catch (error: any) {
      return { 
        formatted: code, 
        error: `JSON Parse Error: ${error.message}` 
      };
    }
  }

  static formatCSS(code: string): string {
    // Basic CSS formatting
    return code
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n\n')
      .replace(/,\s*/g, ',\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  }

  static formatHTML(code: string): string {
    // Basic HTML formatting with proper indentation
    let formatted = code;
    let indent = 0;
    const indentSize = 2;
    
    // Remove extra whitespace
    formatted = formatted.replace(/>\s+</g, '><');
    
    // Add line breaks and indentation
    formatted = formatted.replace(/></g, '>\n<');
    
    const lines = formatted.split('\n');
    const result: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Decrease indent for closing tags
      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - indentSize);
      }
      
      // Add indented line
      result.push(' '.repeat(indent) + trimmed);
      
      // Increase indent for opening tags (but not self-closing)
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        // Check if it's not a self-closing tag
        const tagMatch = trimmed.match(/<(\w+)/);
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
          if (!selfClosingTags.includes(tagName)) {
            indent += indentSize;
          }
        }
      }
    }
    
    return result.join('\n');
  }

  static formatJavaScript(code: string): string {
    // Basic JavaScript formatting
    return code
      .replace(/;/g, ';\n')
      .replace(/{/g, ' {\n  ')
      .replace(/}/g, '\n}\n')
      .replace(/,/g, ',\n  ')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  }

  static autoFormat(code: string, language: string): { formatted: string; error?: string } {
    switch (language.toLowerCase()) {
      case 'json':
        return this.formatJSON(code);
      case 'css':
        return { formatted: this.formatCSS(code) };
      case 'html':
        return { formatted: this.formatHTML(code) };
      case 'javascript':
      case 'typescript':
        return { formatted: this.formatJavaScript(code) };
      default:
        return { formatted: code };
    }
  }
}
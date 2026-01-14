'use client';

import { useRef, useEffect, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

// Configure Monaco Editor to use CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  onFormat?: () => void;
}

export default function CodeEditor({ code, onChange, language, onFormat }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    
    // Define custom theme for better syntax highlighting
    const monacoEditor = (window as any).monaco;
    if (monacoEditor) {
      monacoEditor.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          // Comments - 흐린 회색 (모든 언어)
          { token: 'comment', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line.double-slash', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.documentation', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // Python comments
          { token: 'comment.line.python', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.python', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line.number-sign.python', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line.hash.python', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // JavaScript/TypeScript comments
          { token: 'comment.line.double-slash.js', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.js', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line.double-slash.ts', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.ts', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line.double-slash.javascript', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.javascript', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line.double-slash.typescript', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.typescript', foreground: '7C7C7C', fontStyle: 'italic' },
          // Additional JavaScript/TypeScript comment tokens
          { token: 'comment.js', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.ts', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.javascript', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.typescript', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line.js', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line.ts', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.documentation.js', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.documentation.ts', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // HTML comments
          { token: 'comment.block.html', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.html', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // CSS comments
          { token: 'comment.block.css', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.css', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // Java comments
          { token: 'comment.line.double-slash.java', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.java', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.javadoc.java', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // C/C++ comments
          { token: 'comment.line.double-slash.c', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.c', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line.double-slash.cpp', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.cpp', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // C# comments
          { token: 'comment.line.double-slash.cs', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.cs', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // PHP comments
          { token: 'comment.line.double-slash.php', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.line.number-sign.php', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.php', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // Ruby comments
          { token: 'comment.line.number-sign.ruby', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.ruby', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // Go comments
          { token: 'comment.line.double-slash.go', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.go', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // Rust comments
          { token: 'comment.line.double-slash.rust', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.rust', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // Kotlin comments
          { token: 'comment.line.double-slash.kotlin', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.kotlin', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // Swift comments
          { token: 'comment.line.double-slash.swift', foreground: '7C7C7C', fontStyle: 'italic' },
          { token: 'comment.block.swift', foreground: '7C7C7C', fontStyle: 'italic' },
          
          // Python
          { token: 'keyword.python', foreground: 'FF7B72' }, // 빨간색 키워드
          { token: 'string.python', foreground: 'A5D6FF' }, // 파란색 문자열
          { token: 'string.quoted.single.python', foreground: 'A5D6FF' },
          { token: 'string.quoted.double.python', foreground: 'A5D6FF' },
          { token: 'number.python', foreground: '79C0FF' }, // 밝은 파란색 숫자
          { token: 'constant.language.python', foreground: '79C0FF' },
          { token: 'support.function.builtin.python', foreground: 'D2A8FF' }, // 보라색 내장함수
          
          // JavaScript/TypeScript
          { token: 'keyword.js', foreground: 'FF7B72' },
          { token: 'keyword.ts', foreground: 'FF7B72' },
          { token: 'string.js', foreground: 'A5D6FF' },
          { token: 'string.ts', foreground: 'A5D6FF' },
          { token: 'number.js', foreground: '79C0FF' },
          { token: 'number.ts', foreground: '79C0FF' },
          { token: 'type.identifier.ts', foreground: '7EE787' }, // 초록색 타입
          
          // HTML
          { token: 'tag.html', foreground: 'FF7B72' }, // 빨간색 태그
          { token: 'attribute.name.html', foreground: '7EE787' }, // 초록색 속성
          { token: 'attribute.value.html', foreground: 'A5D6FF' }, // 파란색 속성값
          { token: 'string.html', foreground: 'A5D6FF' },
          
          // CSS
          { token: 'tag.css', foreground: 'FF7B72' }, // 빨간색 선택자
          { token: 'attribute.name.css', foreground: '7EE787' }, // 초록색 속성
          { token: 'attribute.value.css', foreground: 'A5D6FF' }, // 파란색 값
          { token: 'number.css', foreground: '79C0FF' },
          
          // JSON
          { token: 'string.key.json', foreground: '7EE787' }, // 초록색 키
          { token: 'string.value.json', foreground: 'A5D6FF' }, // 파란색 값
          { token: 'number.json', foreground: '79C0FF' },
          { token: 'keyword.json', foreground: 'FF7B72' },
          
          // Java
          { token: 'keyword.java', foreground: 'FF7B72' },
          { token: 'string.java', foreground: 'A5D6FF' },
          { token: 'number.java', foreground: '79C0FF' },
          { token: 'type.java', foreground: '7EE787' },
          
          // C/C++
          { token: 'keyword.c', foreground: 'FF7B72' },
          { token: 'keyword.cpp', foreground: 'FF7B72' },
          { token: 'string.c', foreground: 'A5D6FF' },
          { token: 'string.cpp', foreground: 'A5D6FF' },
          { token: 'number.c', foreground: '79C0FF' },
          { token: 'number.cpp', foreground: '79C0FF' },
          
          // 일반적인 토큰들
          { token: 'keyword', foreground: 'FF7B72' }, // 빨간색 키워드
          { token: 'string', foreground: 'A5D6FF' }, // 파란색 문자열
          { token: 'number', foreground: '79C0FF' }, // 밝은 파란색 숫자
          { token: 'regexp', foreground: '7EE787' }, // 초록색 정규식
          { token: 'operator', foreground: 'FFA657' }, // 주황색 연산자
          { token: 'namespace', foreground: 'D2A8FF' }, // 보라색 네임스페이스
          { token: 'type', foreground: '7EE787' }, // 초록색 타입
          { token: 'struct', foreground: '7EE787' },
          { token: 'class', foreground: '7EE787' },
          { token: 'interface', foreground: '7EE787' },
          { token: 'enum', foreground: '7EE787' },
          { token: 'function', foreground: 'D2A8FF' }, // 보라색 함수
          { token: 'method', foreground: 'D2A8FF' },
          { token: 'variable', foreground: 'FFA657' }, // 주황색 변수
          { token: 'parameter', foreground: 'FFA657' },
          { token: 'property', foreground: 'FFA657' },
          { token: 'constant', foreground: '79C0FF' },
        ],
        colors: {
          'editor.background': '#0D1117',
          'editor.foreground': '#E6EDF3',
          'editorLineNumber.foreground': '#7D8590',
          'editor.selectionBackground': '#264F78',
          'editor.inactiveSelectionBackground': '#3A3D41'
        }
      });
      
      // Apply the custom theme
      monacoEditor.editor.setTheme('custom-dark');
      
      // Force comment styling for all languages by overriding tokenization
      const originalTokenize = monacoEditor.languages.getLanguages();
      
      // Additional language-specific token rules for JavaScript/TypeScript
      if (monacoEditor.languages.setTokensProvider) {
        // Create a more comprehensive theme that covers all possible comment tokens
        monacoEditor.editor.defineTheme('custom-dark-enhanced', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            // Universal comment rules (highest priority)
            { token: 'comment', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.line', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.block', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.line.double-slash', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.block.documentation', foreground: '7C7C7C', fontStyle: 'italic' },
            
            // All the existing rules from custom-dark theme
            { token: 'comment.line.python', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.block.python', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.line.number-sign.python', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.line.hash.python', foreground: '7C7C7C', fontStyle: 'italic' },
            
            // JavaScript/TypeScript comments (all possible variations)
            { token: 'comment.line.double-slash.js', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.block.js', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.line.double-slash.ts', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.block.ts', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.line.double-slash.javascript', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.block.javascript', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.line.double-slash.typescript', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.block.typescript', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.js', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.ts', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.javascript', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.typescript', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.line.js', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.line.ts', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.block.documentation.js', foreground: '7C7C7C', fontStyle: 'italic' },
            { token: 'comment.block.documentation.ts', foreground: '7C7C7C', fontStyle: 'italic' },
            
            // Other language syntax highlighting
            { token: 'keyword', foreground: 'FF7B72' },
            { token: 'string', foreground: 'A5D6FF' },
            { token: 'number', foreground: '79C0FF' },
            { token: 'regexp', foreground: '7EE787' },
            { token: 'operator', foreground: 'FFA657' },
            { token: 'namespace', foreground: 'D2A8FF' },
            { token: 'type', foreground: '7EE787' },
            { token: 'struct', foreground: '7EE787' },
            { token: 'class', foreground: '7EE787' },
            { token: 'interface', foreground: '7EE787' },
            { token: 'enum', foreground: '7EE787' },
            { token: 'function', foreground: 'D2A8FF' },
            { token: 'method', foreground: 'D2A8FF' },
            { token: 'variable', foreground: 'FFA657' },
            { token: 'parameter', foreground: 'FFA657' },
            { token: 'property', foreground: 'FFA657' },
            { token: 'constant', foreground: '79C0FF' },
          ],
          colors: {
            'editor.background': '#0D1117',
            'editor.foreground': '#E6EDF3',
            'editorLineNumber.foreground': '#7D8590',
            'editor.selectionBackground': '#264F78',
            'editor.inactiveSelectionBackground': '#3A3D41'
          }
        });
        
        // Apply the enhanced theme
        monacoEditor.editor.setTheme('custom-dark-enhanced');
      }
    }
    
    // Enable auto-formatting features
    editor.updateOptions({
      formatOnPaste: true,
      formatOnType: true,
      autoIndent: 'full',
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoSurround: 'languageDefined',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
    });

    // Disable diagnostics for all languages to prevent red underlines
    const monaco = (window as any).monaco;
    if (monaco) {
      // TypeScript/JavaScript
      if (language === 'typescript' || language === 'javascript') {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
          noSuggestionDiagnostics: true,
        });
        
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
          noSuggestionDiagnostics: true,
        });
      }

      // Python
      if (language === 'python') {
        try {
          if (monaco.languages.python) {
            monaco.languages.python.pythonDefaults?.setDiagnosticsOptions?.({
              noSemanticValidation: true,
              noSyntaxValidation: false,
            });
          }
        } catch (e) {
          console.log('Python language configuration not available');
        }
      }

      // HTML
      if (language === 'html') {
        try {
          if (monaco.languages.html) {
            monaco.languages.html.htmlDefaults?.setOptions?.({
              validate: false,
              format: {
                enable: true
              }
            });
          }
        } catch (e) {
          console.log('HTML language configuration not available');
        }
      }

      // CSS
      if (language === 'css') {
        try {
          if (monaco.languages.css) {
            monaco.languages.css.cssDefaults?.setOptions?.({
              validate: false,
              lint: {
                validProperties: []
              }
            });
          }
        } catch (e) {
          console.log('CSS language configuration not available');
        }
      }

      // JSON
      if (language === 'json') {
        try {
          if (monaco.languages.json) {
            monaco.languages.json.jsonDefaults?.setDiagnosticsOptions?.({
              validate: false,
              enableSchemaRequest: false,
              hover: true,
              completion: true
            });
          }
        } catch (e) {
          console.log('JSON language configuration not available');
        }
      }

      // For other languages (Java, C++, C, C#, PHP, Ruby, Go, Rust, Kotlin, Swift)
      // These typically don't have built-in language services in Monaco, so they rely on syntax highlighting only
      // The renderValidationDecorations: 'off' option in the editor config handles most validation display
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S for formatting
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleFormat();
        return;
      }
      
      // Shift+Alt+F for formatting
      if (e.shiftKey && e.altKey && e.key === 'F') {
        e.preventDefault();
        handleFormat();
        return;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // Re-apply diagnostics settings when language changes
  useEffect(() => {
    if (editorRef.current) {
      const monacoInstance = (window as any).monaco;
      if (monacoInstance) {
        // Re-apply theme for JavaScript/TypeScript
        if (language === 'javascript' || language === 'typescript') {
          monacoInstance.editor.setTheme('custom-dark-enhanced');
          
          // Force re-tokenization for comments
          setTimeout(() => {
            if (editorRef.current) {
              const model = editorRef.current.getModel();
              if (model) {
                monacoInstance.editor.setModelLanguage(model, language);
                // Force theme reapplication
                monacoInstance.editor.setTheme('custom-dark-enhanced');
              }
            }
          }, 100);
        } else {
          monacoInstance.editor.setTheme('custom-dark-enhanced');
        }
        
        // Apply diagnostics settings for the current language
        if (language === 'typescript' || language === 'javascript') {
          monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
            noSuggestionDiagnostics: true,
          });
          
          monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
            noSuggestionDiagnostics: true,
          });
        }

        if (language === 'python') {
          try {
            if (monacoInstance.languages.python) {
              monacoInstance.languages.python.pythonDefaults?.setDiagnosticsOptions?.({
                noSemanticValidation: true,
                noSyntaxValidation: false,
              });
            }
          } catch (e) {
            console.log('Python language configuration not available');
          }
        }

        if (language === 'html') {
          try {
            if (monacoInstance.languages.html) {
              monacoInstance.languages.html.htmlDefaults?.setOptions?.({
                validate: false,
                format: { enable: true }
              });
            }
          } catch (e) {
            console.log('HTML language configuration not available');
          }
        }

        if (language === 'css') {
          try {
            if (monacoInstance.languages.css) {
              monacoInstance.languages.css.cssDefaults?.setOptions?.({
                validate: false,
                lint: { validProperties: [] }
              });
            }
          } catch (e) {
            console.log('CSS language configuration not available');
          }
        }

        if (language === 'json') {
          try {
            if (monacoInstance.languages.json) {
              monacoInstance.languages.json.jsonDefaults?.setDiagnosticsOptions?.({
                validate: false,
                enableSchemaRequest: false,
                hover: true,
                completion: true
              });
            }
          } catch (e) {
            console.log('JSON language configuration not available');
          }
        }
      }
    }
  }, [language]);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleFormat = async () => {
    if (!editorRef.current) return;

    try {
      // Trigger Monaco's built-in formatting
      await editorRef.current.getAction('editor.action.formatDocument')?.run();
      
      // Get the formatted code and update parent
      const formattedCode = editorRef.current.getValue();
      onChange(formattedCode);
      
      // Call the optional onFormat callback
      onFormat?.();
    } catch (error) {
      console.warn('Formatting failed:', error);
    }
  };

  const handleJSONFormat = async () => {
    if (!editorRef.current || language !== 'json') return;

    try {
      const { CodeFormatter } = await import('../lib/formatter');
      const currentCode = editorRef.current.getValue();
      const result = CodeFormatter.formatJSON(currentCode);
      
      if (result.error) {
        console.warn('JSON formatting failed:', result.error);
      } else {
        editorRef.current.setValue(result.formatted);
        onChange(result.formatted);
        onFormat?.();
      }
    } catch (error) {
      console.warn('JSON formatting failed:', error);
    }
  };

  const handleJSONMinify = async () => {
    if (!editorRef.current || language !== 'json') return;

    try {
      const { CodeFormatter } = await import('../lib/formatter');
      const currentCode = editorRef.current.getValue();
      const result = CodeFormatter.minifyJSON(currentCode);
      
      if (result.error) {
        console.warn('JSON minification failed:', result.error);
      } else {
        editorRef.current.setValue(result.formatted);
        onChange(result.formatted);
        onFormat?.();
      }
    } catch (error) {
      console.warn('JSON minification failed:', error);
    }
  };

  const canFormat = () => {
    // Languages that support formatting
    const formattableLanguages = [
      'javascript', 'typescript', 'json', 'html', 'css', 
      'python', 'java', 'cpp', 'c', 'csharp', 'php', 'go', 'rust'
    ];
    return formattableLanguages.includes(language.toLowerCase());
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-gray-800" tabIndex={-1}>
      {/* Format Buttons */}
      {canFormat() && (
        <div className="flex justify-end p-2 bg-gray-800 border-b border-gray-700">
          {language === 'json' ? (
            <div className="flex space-x-2">
              <button
                onClick={handleJSONFormat}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                title="Format JSON (Ctrl+S or Shift+Alt+F)"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Format</span>
              </button>
              <button
                onClick={handleJSONMinify}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                title="Minify JSON"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>Minify</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleFormat}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              title="Format Code (Ctrl+S or Shift+Alt+F)"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Format</span>
            </button>
          )}
        </div>
      )}
      
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="custom-dark"
          loading={
            <div className="flex items-center justify-center h-full bg-gray-800">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                <p className="text-sm text-gray-400">Loading Monaco Editor from CDN...</p>
                <p className="text-xs text-gray-500 mt-1">This may take a moment on first load</p>
              </div>
            </div>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            // Enhanced formatting options
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: 'full',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoSurround: 'languageDefined',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            // Better editing experience
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            },
            parameterHints: { enabled: true },
            hover: { enabled: true },
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'mouseover',
            // Reduce error highlighting
            renderValidationDecorations: 'off',
            showUnused: false,
            showDeprecated: false,
          }}
        />
      </div>
    </div>
  );
}
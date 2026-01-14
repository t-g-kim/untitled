'use client';

import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  onFormat?: () => void;
}

export default function CodeEditor({ code, onChange, language, onFormat }: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('CodeMirror Editor mounted');
  }, []);

  const getLanguageExtension = () => {
    switch (language) {
      case 'python':
        return [python()];
      case 'javascript':
        return [javascript()];
      case 'typescript':
        return [javascript({ typescript: true })];
      case 'html':
        return [html()];
      case 'css':
        return [css()];
      case 'json':
        return [json()];
      default:
        return [];
    }
  };

  const canFormat = () => {
    const formattableLanguages = [
      'javascript', 'typescript', 'json', 'html', 'css', 
      'python', 'java', 'cpp', 'c', 'csharp', 'php', 'go', 'rust'
    ];
    return formattableLanguages.includes(language.toLowerCase());
  };

  const handleFormat = () => {
    if (onFormat) {
      onFormat();
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
          <p className="text-sm text-gray-400">Initializing editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Format Buttons */}
      {canFormat() && (
        <div className="flex justify-end p-2 bg-gray-800 border-b border-gray-700">
          <button
            onClick={handleFormat}
            className="flex items-center space-x-2 px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            title="Format Code (Ctrl+S)"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Format</span>
          </button>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={getLanguageExtension()}
          onChange={(value) => onChange(value)}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          style={{
            fontSize: '14px',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
}

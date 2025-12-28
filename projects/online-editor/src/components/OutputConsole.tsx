'use client';

import React from 'react';

interface OutputConsoleProps {
  output: string[];
  errors: string[];
  isRunning: boolean;
  onClear: () => void;
}

export default function OutputConsole({ output, errors, isRunning }: OutputConsoleProps) {
  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex-1 p-4 overflow-auto font-mono text-sm">
        {isRunning && (
          <div className="text-yellow-400 mb-2 flex items-center space-x-2">
            <div className="w-3 h-3 border border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Running...</span>
          </div>
        )}
        
        {output.map((line, index) => (
          <div key={`output-${index}`} className="mb-1 text-green-400">
            {line}
          </div>
        ))}
        
        {errors.map((error, index) => (
          <div key={`error-${index}`} className="mb-1 text-red-400">
            {error}
          </div>
        ))}
        
        {!isRunning && output.length === 0 && errors.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            <div className="mb-2">
              <svg className="w-12 h-12 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm">No output yet</p>
            <p className="text-xs text-gray-600 mt-1">Run your Python code to see results here</p>
          </div>
        )}
      </div>
    </div>
  );
}
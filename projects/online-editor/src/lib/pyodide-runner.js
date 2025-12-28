// Global Pyodide type declaration
let pyodideInstance = null;
let isReady = false;
let isInitializing = false;

async function waitForPyodide() {
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

async function initialize() {
  if (isReady) return;
  if (isInitializing) {
    // Wait for existing initialization to complete
    while (isInitializing && !isReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  isInitializing = true;

  try {
    console.log('Starting Pyodide initialization...');
    
    // Wait for Pyodide script to load
    await waitForPyodide();

    if (!window.loadPyodide) {
      throw new Error('Pyodide script not loaded');
    }
    
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
    });

    console.log('Pyodide loaded successfully');

    // Test basic functionality
    pyodideInstance.runPython(`
import sys
print("Python", sys.version)
`);

    isReady = true;
    isInitializing = false;
    console.log('Pyodide initialization completed successfully');
  } catch (error) {
    isInitializing = false;
    console.error('Failed to initialize Pyodide:', error);
    throw new Error(`Pyodide initialization failed: ${error.message || error}`);
  }
}

async function runCode(code) {
  if (!isReady) {
    throw new Error('Pyodide not initialized. Please wait for initialization to complete.');
  }

  const startTime = performance.now();
  const output = [];
  const errors = [];

  try {
    // Simple approach: capture print output
    pyodideInstance.runPython(`
import sys
from io import StringIO

# Capture stdout
old_stdout = sys.stdout
sys.stdout = captured_output = StringIO()
`);

    try {
      // Execute user code
      pyodideInstance.runPython(code);
    } catch (execError) {
      errors.push(execError.message || 'Execution error');
    }

    // Get captured output and restore stdout
    const result = pyodideInstance.runPython(`
output = captured_output.getvalue()
sys.stdout = old_stdout
output
`);
    
    if (result) {
      output.push(...result.split('\n').filter(line => line.trim()));
    }
    
  } catch (error) {
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

async function installPackage(packageName) {
  if (!isReady) {
    throw new Error('Pyodide not initialized');
  }

  try {
    await pyodideInstance.loadPackage(packageName);
  } catch (error) {
    console.error(`Failed to install package ${packageName}:`, error);
    throw error;
  }
}

function isReadyCheck() {
  return isReady;
}

export function getPyodideRunner() {
  return {
    initialize,
    runCode,
    installPackage,
    isReady: isReadyCheck,
  };
}
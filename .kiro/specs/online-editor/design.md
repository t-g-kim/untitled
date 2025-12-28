# Online Python Editor Design Document

## Overview

온라인 Python 편집기는 웹 브라우저에서 Python 코드를 작성, 실행, 공유할 수 있는 현대적인 웹 애플리케이션입니다. Next.js와 React를 기반으로 구축되며, 클라이언트 사이드에서 Python 코드를 실행하기 위해 Pyodide를 사용합니다. 사용자 친화적인 인터페이스와 강력한 코드 편집 기능을 제공하여 교육, 프로토타이핑, 코드 공유 목적으로 활용할 수 있습니다.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Storage       │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ - Code Editor   │    │ - Share API     │    │ - Shared Code   │
│ - Output Console│    │ - Code Storage  │    │ - User Sessions │
│ - UI Components │    │ - Rate Limiting │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Pyodide       │
│   (Python       │
│    Runtime)     │
└─────────────────┘
```

### Component Architecture

- **Frontend Layer**: React 컴포넌트 기반 사용자 인터페이스
- **Code Execution Layer**: Pyodide를 통한 클라이언트 사이드 Python 실행
- **API Layer**: Next.js API routes를 통한 백엔드 서비스
- **Storage Layer**: 코드 공유 및 세션 관리를 위한 데이터베이스

## Components and Interfaces

### Frontend Components

#### CodeEditor Component
```typescript
interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  isRunning: boolean;
  language: 'python';
}
```

#### OutputConsole Component
```typescript
interface OutputConsoleProps {
  output: string[];
  errors: string[];
  isRunning: boolean;
  onClear: () => void;
}
```

#### ShareDialog Component
```typescript
interface ShareDialogProps {
  isOpen: boolean;
  shareUrl: string;
  onClose: () => void;
  onShare: (code: string) => Promise<string>;
}
```

### Backend APIs

#### Share API
```typescript
// POST /api/share
interface ShareRequest {
  code: string;
  title?: string;
}

interface ShareResponse {
  id: string;
  url: string;
  expiresAt: string;
}
```

#### Retrieve Shared Code API
```typescript
// GET /api/share/[id]
interface RetrieveResponse {
  code: string;
  title?: string;
  createdAt: string;
}
```

### Python Runtime Interface

#### PyodideRunner
```typescript
interface PyodideRunner {
  initialize(): Promise<void>;
  runCode(code: string): Promise<ExecutionResult>;
  installPackage(packageName: string): Promise<void>;
  isReady(): boolean;
}

interface ExecutionResult {
  output: string[];
  errors: string[];
  executionTime: number;
}
```

## Data Models

### SharedCode Model
```typescript
interface SharedCode {
  id: string;
  code: string;
  title?: string;
  createdAt: Date;
  expiresAt: Date;
  accessCount: number;
}
```

### UserSession Model
```typescript
interface UserSession {
  sessionId: string;
  lastCode: string;
  lastSaved: Date;
  settings: {
    theme: 'light' | 'dark';
    fontSize: number;
    autoSave: boolean;
  };
}
```

### ExecutionContext Model
```typescript
interface ExecutionContext {
  code: string;
  output: string[];
  errors: string[];
  isRunning: boolean;
  executionTime?: number;
  installedPackages: string[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all properties identified in the prework analysis, several redundancies were identified and consolidated:

- Properties related to code execution output (2.2, 2.4) can be combined into a comprehensive execution output property
- Properties related to error handling (2.3, 5.3, 5.5) can be consolidated into error display properties
- Storage-related properties (3.1, 3.2) form a round-trip consistency property
- Library import properties (5.1, 5.2) can be combined into library support property

### Core Properties

**Property 1: Code input consistency**
*For any* text input to the code editor, the displayed content should exactly match the input text
**Validates: Requirements 1.2**

**Property 2: Syntax highlighting application**
*For any* valid Python code entered in the editor, syntax highlighting should be applied to appropriate language constructs
**Validates: Requirements 1.3**

**Property 3: Indentation insertion**
*For any* cursor position in the code editor, pressing the tab key should insert appropriate indentation based on Python syntax rules
**Validates: Requirements 1.4**

**Property 4: Change reflection**
*For any* code modification in the editor, the changes should be immediately visible in the editor interface
**Validates: Requirements 1.5**

**Property 5: Code execution initiation**
*For any* Python code in the editor, clicking the run button should initiate code execution
**Validates: Requirements 2.1**

**Property 6: Execution output display**
*For any* successfully executed Python code that produces output, the output console should display all generated output including print statements and return values
**Validates: Requirements 2.2, 2.4**

**Property 7: Error message display**
*For any* Python code that contains syntax or runtime errors, the output console should display error messages with line number information
**Validates: Requirements 2.3**

**Property 8: Execution completion notification**
*For any* code execution, the editor should indicate completion status to the user when execution finishes
**Validates: Requirements 2.5**

**Property 9: Code storage round-trip**
*For any* code saved to local storage, retrieving the code should return the exact same content
**Validates: Requirements 3.1, 3.2**

**Property 10: Auto-save functionality**
*For any* code changes in the editor, the system should automatically save changes to local storage within a specified time interval
**Validates: Requirements 3.5**

**Property 11: Share link generation**
*For any* code content, generating a share link should produce a unique, valid URL that can be used to access the code
**Validates: Requirements 4.1**

**Property 12: Share link clipboard copy**
*For any* generated share link, the link should be successfully copied to the user's clipboard
**Validates: Requirements 4.2**

**Property 13: Shared code retrieval**
*For any* valid share link, accessing the link should display the original shared code in read-only mode
**Validates: Requirements 4.3**

**Property 14: Standard library import**
*For any* Python standard library module, importing the module should succeed without errors
**Validates: Requirements 5.1**

**Property 15: External library support**
*For any* supported external library (numpy, pandas, requests), importing and using the library should function correctly
**Validates: Requirements 5.2**

**Property 16: Unsupported library error handling**
*For any* unsupported library import attempt, the system should display a clear error message indicating the library is not available
**Validates: Requirements 5.3**

**Property 17: Library loading indication**
*For any* library that requires loading time, the system should display loading status to the user during the loading process
**Validates: Requirements 5.4**

**Property 18: Library error reporting**
*For any* error that occurs while using an imported library, the output console should display detailed error information
**Validates: Requirements 5.5**

**Property 19: Responsive layout adjustment**
*For any* change in viewport size, the editor layout should automatically adjust to maintain usability
**Validates: Requirements 6.4**

**Property 20: File system access restriction**
*For any* code that attempts to access the file system, only access to the virtual file system should be permitted
**Validates: Requirements 7.2**

**Property 21: Network request filtering**
*For any* network request attempted by user code, only requests to whitelisted domains should be allowed
**Validates: Requirements 7.3**

**Property 22: Execution timeout enforcement**
*For any* code that runs longer than the specified timeout limit, execution should be terminated and a timeout message should be displayed
**Validates: Requirements 7.4**

**Property 23: Memory limit enforcement**
*For any* code that exceeds the memory usage limit, execution should be terminated and a memory limit message should be displayed
**Validates: Requirements 7.5**

## Error Handling

### Client-Side Error Handling

- **Code Execution Errors**: Python runtime errors are caught and displayed in the output console with stack traces
- **Network Errors**: API failures for sharing functionality are handled with user-friendly error messages
- **Storage Errors**: Local storage failures fall back to session-only storage with user notification
- **Library Loading Errors**: Failed library imports are caught and reported with helpful error messages

### Server-Side Error Handling

- **Database Errors**: Share API failures are logged and return appropriate HTTP status codes
- **Rate Limiting**: Excessive API usage is throttled with 429 status codes
- **Validation Errors**: Invalid share requests return 400 status codes with error details
- **Not Found Errors**: Invalid share IDs return 404 status codes

### Security Error Handling

- **Sandbox Violations**: Attempts to break out of the Python sandbox are blocked
- **Resource Exhaustion**: Memory and CPU limits are enforced with graceful degradation
- **Malicious Code**: Potentially harmful code patterns are detected and blocked

## Testing Strategy

### Unit Testing Approach

Unit tests will focus on:
- Individual component functionality (CodeEditor, OutputConsole, ShareDialog)
- API endpoint behavior and error handling
- Utility functions for code parsing and validation
- Local storage operations and session management

### Property-Based Testing Approach

Property-based testing will be implemented using **fast-check** for JavaScript/TypeScript. Each property-based test will:
- Run a minimum of 100 iterations to ensure comprehensive coverage
- Use smart generators that create realistic test inputs
- Be tagged with comments referencing the specific correctness property

**Property-based testing requirements:**
- Each correctness property must be implemented by a single property-based test
- Tests must be tagged with the format: `**Feature: online-editor, Property {number}: {property_text}**`
- Generators should create valid Python code, realistic user inputs, and appropriate test scenarios
- Tests should avoid mocking where possible to validate real functionality

**Testing Framework Configuration:**
- Primary testing framework: Jest with React Testing Library
- Property-based testing: fast-check library
- End-to-end testing: Playwright for critical user flows
- Code coverage target: 80% for core functionality

### Integration Testing

Integration tests will cover:
- Complete user workflows (write code → run → save → share)
- Pyodide integration and Python code execution
- API integration between frontend and backend
- Cross-browser compatibility for core features
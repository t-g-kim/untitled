# Multi-Language Code Playground

A modern web-based code editor that supports multiple programming languages and runs entirely in your browser. Write, execute, and share code in Python, JavaScript, TypeScript, HTML, CSS, and JSON without any server-side setup.

## Features

- 🌐 **Multi-Language Support**: Python, JavaScript, TypeScript, HTML, CSS, and JSON
- 🐍 **Full Python Support**: Execute Python code directly in your browser using Pyodide
- 🟨 **JavaScript & TypeScript**: Run JavaScript and TypeScript code with real-time execution
- 🌐 **HTML Preview**: Live preview for HTML code with embedded CSS and JavaScript
- 🎨 **CSS Analysis**: Syntax highlighting and structure analysis for CSS
- 📄 **JSON Validation**: Parse and validate JSON with detailed error reporting
- 📝 **Monaco Editor**: Professional code editing experience with syntax highlighting for all languages
- 💾 **Auto-save**: Your code is automatically saved to local storage per language
- 🔗 **Code Sharing**: Generate shareable links for your scripts (coming soon)
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🔒 **Secure Execution**: Code runs in a sandboxed environment
- 📚 **Library Support**: Import and use popular Python libraries like numpy, pandas, and more

## Supported Languages

### Executable Languages
- **Python** 🐍 - Full Python 3.x support with Pyodide
- **JavaScript** 🟨 - ES6+ features with console output
- **TypeScript** 🔷 - TypeScript with basic transpilation
- **HTML** 🌐 - Live preview with embedded CSS/JS
- **CSS** 🎨 - Syntax validation and analysis
- **JSON** 📄 - Parsing and validation

### View-Only Languages
Some languages provide syntax highlighting and editing capabilities without execution.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd projects/online-editor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (generates static files in `out/` folder)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Deployment

This project is configured for deployment on **Cloudflare Pages** with static site generation.

### Quick Deploy to Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Set build configuration:
   - **Root directory**: `projects/online-editor`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Node.js version**: `18`

For detailed deployment instructions, see [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md).

## Architecture

The application is built with:

- **Frontend**: Next.js 14 with React and TypeScript
- **Code Editor**: Monaco Editor (VS Code editor) with multi-language support
- **Python Runtime**: Pyodide (Python compiled to WebAssembly)
- **JavaScript Runtime**: Native browser JavaScript engine
- **HTML Preview**: Sandboxed iframe for safe HTML rendering
- **Styling**: Tailwind CSS
- **Testing**: Jest with React Testing Library and fast-check for property-based testing

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── CodeEditor.tsx   # Monaco editor wrapper
│   ├── OutputConsole.tsx # Output display component
│   ├── LanguageSelector.tsx # Language selection dropdown
│   └── HTMLPreview.tsx  # HTML preview component
├── hooks/               # Custom React hooks
│   └── useLocalStorage.ts # Local storage hook
├── lib/                 # Utility libraries
│   ├── pyodide-runner.js # Pyodide integration
│   ├── javascript-runner.ts # JavaScript execution
│   ├── html-runner.ts   # HTML/CSS processing
│   └── code-runner.ts   # Unified code execution
└── types/               # TypeScript type definitions
    └── languages.ts     # Language configurations
```

## Usage

1. **Selecting Language**: Use the language dropdown in the header to switch between supported languages
2. **Writing Code**: Use the Monaco editor on the left to write code in your selected language
3. **Running Code**: Click the "Run" button to execute your code (for executable languages)
4. **Viewing Output**: See results and errors in the console on the right
5. **HTML Preview**: For HTML code, toggle between output console and live preview
6. **Auto-save**: Code is automatically saved to your browser's local storage per language
7. **Sharing**: Use the "Share" button to generate a shareable link (coming soon)

## Language-Specific Features

### Python
- Full Python 3.x standard library
- Popular packages: NumPy, Pandas, Matplotlib, Requests
- Real-time execution with Pyodide

### JavaScript/TypeScript
- ES6+ features support
- Console output capture
- Basic TypeScript transpilation
- Error handling and reporting

### HTML
- Live preview in sandboxed iframe
- Embedded CSS and JavaScript support
- Element and structure analysis
- Safe rendering environment

### CSS
- Syntax validation
- Rule and selector counting
- Media query detection
- Animation and custom property analysis

### JSON
- Real-time parsing and validation
- Structure analysis
- Detailed error reporting with line numbers
- Size and formatting statistics

## Supported Python Libraries

The Python environment supports many popular libraries through Pyodide:

- Standard library modules (os, sys, json, etc.)
- NumPy for numerical computing
- Pandas for data analysis
- Matplotlib for plotting
- Requests for HTTP requests
- And many more...

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Pyodide](https://pyodide.org/) for making Python in the browser possible
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the excellent multi-language code editing experience
- [Next.js](https://nextjs.org/) for the React framework
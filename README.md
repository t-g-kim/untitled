# 🚀 Web Tools Monorepo

A collection of modern web applications built with Next.js and deployed on Cloudflare Pages.

## 📁 Projects

### 🎨 [Online Code Editor](./projects/online-editor/)
A powerful web-based code editor supporting multiple programming languages including Python, JavaScript, TypeScript, HTML, CSS, and JSON.

**Features:**
- Multi-language support with syntax highlighting
- Python execution via Pyodide
- Live HTML preview
- Auto-save functionality
- Responsive design

**Live Demo:** [Coming Soon]

---

### 📱 [QR Code Generator](./projects/qr-generator/)
A fast and reliable QR code generator with customization options.

**Features:**
- Instant QR code generation
- Multiple export formats
- Customizable styling
- Mobile-friendly interface

**Live Demo:** [Coming Soon]

---

### 😀 [Emoji Search](./projects/emoji-search/)
An intuitive emoji search and discovery tool.

**Features:**
- Fast emoji search
- Category browsing
- Copy to clipboard
- Keyboard shortcuts

**Live Demo:** [Coming Soon]

---

### 🔄 [File Conversion Platform](./projects/file-conversion-platform/)
A comprehensive file conversion service supporting multiple formats.

**Features:**
- Multiple file format support
- Batch processing
- Secure client-side conversion
- Progress tracking

**Live Demo:** [Coming Soon]

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd web-tools-monorepo
```

2. **Install dependencies for all projects:**
```bash
# Windows
build-all.bat

# Or manually for each project
cd projects/online-editor && npm install
cd ../qr-generator && npm install
cd ../emoji-search && npm install
cd ../file-conversion-platform && npm install
```

3. **Run a specific project:**
```bash
cd projects/online-editor
npm run dev
```

### Build All Projects

```bash
# Windows
build-all.bat

# Manual build
cd projects/online-editor && npm run build
cd ../qr-generator && npm run build
cd ../emoji-search && npm run build
cd ../file-conversion-platform && npm run build
```

## 🚀 Deployment

Each project is configured for deployment on **Cloudflare Pages** with the following settings:

| Project | Root Directory | Build Command | Output Directory |
|---------|---------------|---------------|------------------|
| Online Editor | `projects/online-editor` | `npm run build` | `out` |
| QR Generator | `projects/qr-generator` | `npm run build` | `.next` |
| Emoji Search | `projects/emoji-search` | `npm run build` | `.next` |
| File Conversion | `projects/file-conversion-platform` | `npm run build` | `.next` |

### Deployment Steps

1. **Push to GitHub:**
```bash
git add .
git commit -m "Deploy all projects"
git push origin main
```

2. **Configure Cloudflare Pages:**
   - Connect each project separately in Cloudflare Pages
   - Use the settings from the table above
   - Set `NODE_VERSION=18` in environment variables

3. **Custom Domains (Optional):**
   - `editor.yourdomain.com`
   - `qr.yourdomain.com`
   - `emoji.yourdomain.com`
   - `convert.yourdomain.com`

## 📊 Project Status

| Project | Status | Build | Tests | Deployment |
|---------|--------|-------|-------|------------|
| Online Editor | ✅ Ready | ✅ Passing | ✅ Passing | 🚀 Ready |
| QR Generator | ✅ Ready | ✅ Passing | ✅ Passing | 🚀 Ready |
| Emoji Search | ✅ Ready | ✅ Passing | ✅ Passing | 🚀 Ready |
| File Conversion | 🔄 In Progress | ⏳ Pending | ⏳ Pending | ⏳ Pending |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes in the appropriate project directory
4. Test your changes (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Cloudflare Pages](https://pages.cloudflare.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Pyodide](https://pyodide.org/) - Python in the browser

---

## 📞 Support

If you have any questions or need help with deployment, please open an issue or contact the maintainers.

**Happy coding! 🎉**
@echo off
REM Online Editor Build Script for Cloudflare Pages
REM This script prepares the project for deployment

echo 🚀 Building Online Code Editor for Cloudflare Pages...
echo 📁 Project Directory: %CD%

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

REM Build the project
echo 🔨 Building project...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

REM Check if build was successful
if exist "out" (
    echo ✅ Build successful! Static files generated in 'out/' directory
    echo 📊 Build statistics:
    for /f %%i in ('dir /s /b out ^| find /c /v ""') do echo    - Total files: %%i
    for /f "tokens=3" %%i in ('dir /s /-c out ^| find "File(s)"') do echo    - Total size: %%i bytes
    echo.
    echo 🌐 Ready for Cloudflare Pages deployment!
    echo    - Root directory: projects/online-editor
    echo    - Build command: npm run build
    echo    - Build output directory: out
) else (
    echo ❌ Build failed! 'out' directory not found
    exit /b 1
)

echo.
echo 📋 Next steps:
echo 1. Push your code to GitHub
echo 2. Connect to Cloudflare Pages
echo 3. Set build configuration as shown above
echo 4. Deploy! 🎉

pause
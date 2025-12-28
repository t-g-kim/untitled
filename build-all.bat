@echo off
REM Build all projects for Cloudflare Pages deployment

echo 🚀 Building all projects for Cloudflare Pages...
echo.

set PROJECTS=online-editor qr-generator emoji-search file-conversion-platform

for %%p in (%PROJECTS%) do (
    echo 📦 Building %%p...
    if exist "projects\%%p" (
        cd "projects\%%p"
        echo   - Installing dependencies...
        call npm install --silent
        if %ERRORLEVEL% neq 0 (
            echo   ❌ Failed to install dependencies for %%p
            cd ..\..
            goto :error
        )
        
        echo   - Building project...
        call npm run build --silent
        if %ERRORLEVEL% neq 0 (
            echo   ❌ Build failed for %%p
            cd ..\..
            goto :error
        )
        
        echo   ✅ %%p built successfully
        cd ..\..
    ) else (
        echo   ⚠️  Project %%p not found, skipping...
    )
    echo.
)

echo 🎉 All projects built successfully!
echo.
echo 📋 Next steps:
echo 1. Push your code to GitHub
echo 2. Set up each project in Cloudflare Pages:
echo    - online-editor: Root=projects/online-editor, Output=out
echo    - qr-generator: Root=projects/qr-generator, Output=.next  
echo    - emoji-search: Root=projects/emoji-search, Output=.next
echo    - file-conversion-platform: Root=projects/file-conversion-platform, Output=.next
echo.
goto :end

:error
echo ❌ Build process failed!
exit /b 1

:end
pause
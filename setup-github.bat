@echo off
REM 🚀 TinyDose GitHub Repository Setup Script (Windows)
REM Run this script from the pediatric-drug-calculator directory

echo 🎉 Setting up TinyDose PWA repository...

REM Check if we're in the right directory
if not exist "vite.config.ts" (
    echo ❌ Error: Please run this script from the pediatric-drug-calculator directory
    exit /b 1
)

REM Initialize git repository
echo 📁 Initializing git repository...
git init

REM Add all files to git
echo 📝 Adding all files to git...
git add .

REM Create initial commit with detailed message
echo 💾 Creating initial commit...
git commit -m "🎉 Initial commit: TinyDose PWA - Precision care in every drop"

echo ✅ Git repository initialized and initial commit created!
echo.
echo 🔗 Next steps:
echo 1. Create a new repository on GitHub.com named 'tinydose-pwa'
echo 2. Copy the repository URL (e.g., https://github.com/YOUR_USERNAME/tinydose-pwa.git)
echo 3. Run the following commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/tinydose-pwa.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 📚 See GITHUB_SETUP.md for detailed instructions!

REM Check if GitHub CLI is available
gh --version >nul 2>&1
if %errorlevel% == 0 (
    echo.
    echo 🤖 GitHub CLI detected! Would you like me to create the repository automatically? (y/n)
    set /p response=
    if /i "%response%"=="y" (
        echo 🚀 Creating GitHub repository...
        gh repo create tinydose-pwa --public --description "💧 TinyDose - Precision care in every drop. Professional pediatric drug calculator PWA for healthcare providers." --push
        echo ✅ Repository created and code pushed to GitHub!
    )
)

echo.
echo 🎉 TinyDose repository setup complete!
pause
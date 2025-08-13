@echo off
echo 🏥 TinyDose PWA - Git Initialization
echo ==================================

REM Check if git is already initialized
if exist ".git" (
    echo ✅ Git repository already initialized
) else (
    echo 📁 Initializing git repository...
    git init
)

REM Add all files
echo 📋 Adding all files to git...
git add .

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: TinyDose PWA - Complete pediatric drug calculator

Features:
- 444 pediatric medications across 23 medical specialties
- Progressive Web App with offline support and installability
- Dose calculator with safety checks and unit conversions
- Modern React 19 + TypeScript + TailwindCSS stack
- Comprehensive search and filtering capabilities
- Favorites and recent drugs tracking
- Dark/light mode support
- Responsive design for mobile and desktop

Technical Stack:
- React 19 with TypeScript for type safety
- Vite 6.3 for fast development and building
- TailwindCSS V4 for modern styling
- ShadCN UI components for consistent design
- Workbox for service worker and offline support
- Comprehensive PWA manifest for app installation

Medical Database:
- Complete CSV database with 444 pediatric medications
- Covers 23 medical specialties from Cardiovascular to Emergency
- Includes dosing, contraindications, side effects, and special notes
- Built-in safety checks and maximum dose calculations

Scout jam: pediatric-drug-calculator-ebe965d7"

echo.
echo 🎉 Git repository ready!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub named 'tinydose-pediatric-calculator'
echo 2. Copy the remote URL from GitHub
echo 3. Run: git remote add origin ^<your-github-url^>
echo 4. Run: git push -u origin main
echo.
echo Or use GitHub CLI:
echo gh repo create tinydose-pediatric-calculator --public --description "TinyDose - Pediatric Drug Calculator PWA. Precision care in every drop." --push
echo.
echo 📖 See PUSH_TO_GITHUB.md for detailed instructions

pause
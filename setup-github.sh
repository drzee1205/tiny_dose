#!/bin/bash

# 🚀 TinyDose GitHub Repository Setup Script
# Run this script from the pediatric-drug-calculator directory

echo "🎉 Setting up TinyDose PWA repository..."

# Check if we're in the right directory
if [ ! -f "vite.config.ts" ]; then
    echo "❌ Error: Please run this script from the pediatric-drug-calculator directory"
    exit 1
fi

# Initialize git repository
echo "📁 Initializing git repository..."
git init

# Add all files to git
echo "📝 Adding all files to git..."
git add .

# Create initial commit with detailed message
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: TinyDose PWA - Precision care in every drop

✨ Features:
- 💧 Complete PWA with offline support  
- 📊 444 pediatric medications across 23 specialties
- 🧮 Smart dosage calculator with safety checks
- ⭐ Favorites and recent drugs  
- 🌙 Dark/light mode support
- 📱 Installable on iOS, Android, and Desktop
- 🔒 Privacy-first, no data collection
- 🏥 Designed for healthcare professionals

🛠️ Tech Stack:
- React 19 + TypeScript
- Vite 6.3 + TailwindCSS V4  
- Workbox PWA + ShadCN UI
- Complete offline functionality

📚 Documentation:
- README.md - Complete project overview
- PWA_FEATURES.md - PWA capabilities  
- INSTALLATION_GUIDE.md - User installation guide
- TINYDOSE_BRANDING.md - Brand guidelines
- GITHUB_SETUP.md - Repository setup instructions

🌐 Live Demo: https://pediatric-drug-calculator-ebe965d7.scout.site"

echo "✅ Git repository initialized and initial commit created!"
echo ""
echo "🔗 Next steps:"
echo "1. Create a new repository on GitHub.com named 'tinydose-pwa'"
echo "2. Copy the repository URL (e.g., https://github.com/YOUR_USERNAME/tinydose-pwa.git)"
echo "3. Run the following commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/tinydose-pwa.git"
echo "   git branch -M main" 
echo "   git push -u origin main"
echo ""
echo "📚 See GITHUB_SETUP.md for detailed instructions!"

# Optional: If GitHub CLI is available, offer to create repo
if command -v gh &> /dev/null; then
    echo ""
    echo "🤖 GitHub CLI detected! Would you like me to create the repository automatically? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🚀 Creating GitHub repository..."
        gh repo create tinydose-pwa \
            --public \
            --description "💧 TinyDose - Precision care in every drop. Professional pediatric drug calculator PWA for healthcare providers." \
            --push
        echo "✅ Repository created and code pushed to GitHub!"
        echo "🌐 Repository URL: https://github.com/$(gh api user --jq .login)/tinydose-pwa"
    fi
fi

echo ""
echo "🎉 TinyDose repository setup complete!"
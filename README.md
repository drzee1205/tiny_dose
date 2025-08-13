# 💧 TinyDose - Pediatric Drug Calculator PWA

*"Precision care in every drop"*

<div align="center">
  <img src="public/pwa-192x192.png" alt="TinyDose Logo" width="128" height="128">
  
  [![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen.svg)](https://web.dev/progressive-web-apps/)
  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.3-purple.svg)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Latest-teal.svg)](https://tailwindcss.com/)
</div>

## 🏥 Overview

TinyDose is a professional Progressive Web App (PWA) designed for healthcare providers to calculate safe and accurate pediatric drug dosages. With precision care in every drop, TinyDose provides instant access to comprehensive pediatric medication information and dosing calculations that work offline.

### ✨ Key Features

- 📊 **444 Pediatric Medications** across 23 medical specialties
- 🧮 **Intelligent Calculator** with weight-based dosing and safety checks
- 🔍 **Advanced Search** by drug name, indication, or medical system
- ⭐ **Favorites & Recent** drugs for quick access
- ⚠️ **Safety Alerts** for contraindications and dose limits
- 📱 **Offline Ready** - works without internet connection
- 🔧 **Installable** - add to home screen like a native app
- 🌙 **Dark/Light Mode** with system preference support

## 🚀 Live Demo

**Try TinyDose now**: [https://pediatric-drug-calculator-ebe965d7.scout.site](https://pediatric-drug-calculator-ebe965d7.scout.site)

### 📱 Installation

1. **Android/Chrome**: Look for "Add to Home Screen" prompt
2. **iOS/Safari**: Tap Share → "Add to Home Screen"  
3. **Desktop**: Click install icon in address bar

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS V4 + ShadCN UI
- **Build Tool**: Vite 6.3
- **PWA**: Workbox service worker + Web App Manifest
- **Icons**: Lucide React
- **Fonts**: Inter + Playfair Display (Google Fonts)

## 🏗️ Development Setup

### Prerequisites

- Node.js 18+ or Bun 1.2+
- Modern browser (Chrome 67+, Safari 11.1+, Firefox 63+)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/tinydose-pwa.git
cd tinydose-pwa

# Install dependencies
bun install
# or
npm install

# Start development server
bun run dev
# or
npm run dev

# Build for production
bun run build
# or
npm run build

# Preview production build
bun run preview
# or
npm run preview
```

### 📁 Project Structure

```
tinydose-pwa/
├── public/
│   ├── pwa-192x192.png         # App icons
│   ├── pwa-512x512.png
│   ├── apple-touch-icon.png
│   ├── pediatric_drugs.csv     # Drug database
│   └── manifest.webmanifest    # PWA manifest
├── src/
│   ├── components/            # React components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── DrugSearch.tsx    # Drug search interface
│   │   ├── DosageCalculator.tsx # Dosing calculator
│   │   └── SplashScreen.tsx  # Loading screen
│   ├── hooks/                # Custom React hooks
│   │   ├── useDrugDatabase.ts
│   │   └── useSettings.ts
│   ├── lib/                  # Utility libraries
│   │   └── drugDatabase.ts   # Database operations
│   ├── types/                # TypeScript definitions
│   │   └── drug.ts
│   ├── App.tsx              # Main application
│   ├── main.tsx             # Application entry
│   └── index.css            # Global styles
└── docs/                    # Documentation
    ├── PWA_FEATURES.md      # PWA capabilities
    ├── INSTALLATION_GUIDE.md # User installation guide
    └── TINYDOSE_BRANDING.md  # Brand guidelines
```

## 📊 Database

### Drug Information Includes:
- **Basic Info**: Name, class, indication, route, frequency
- **Dosing**: Pediatric dose formulas, maximum doses, units
- **Safety**: Contraindications, side effects, special notes
- **Forms**: Available dosage forms and administration routes

### Coverage:
- **Medical Systems**: 23 specialties (Cardiology, Neurology, etc.)
- **Drug Classes**: Antibiotics, analgesics, cardiac medications, etc.
- **Age Groups**: Neonates to pediatric patients
- **Routes**: PO, IV, IM, topical, inhalation, etc.

## 🔒 Privacy & Security

- ✅ **No Data Collection**: Zero tracking or analytics
- ✅ **Local Storage**: All data stays on user's device
- ✅ **No PHI**: No patient information stored
- ✅ **HTTPS Only**: Secure connections required
- ✅ **Offline First**: Full functionality without internet

## 📱 PWA Features

### Installation
- **Android**: Native app experience via Chrome
- **iOS**: Add to home screen via Safari
- **Desktop**: Install from Chrome/Edge browser
- **Windows**: Integrates with Start Menu and taskbar

### Offline Capabilities
- **Complete Drug Database**: 444 medications cached locally
- **Full Calculator**: All dosing functions work offline
- **Settings Persistence**: Favorites and preferences saved
- **Service Worker**: Automatic updates when online

### Performance
- **Fast Loading**: < 2 second initial load
- **Responsive**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons for mobile/tablet use
- **Lighthouse Score**: 100/100 PWA compliance

## 🏥 Clinical Use

### Target Users
- **Pediatric Physicians** - Dosing calculations during rounds
- **Nurses** - Medication administration verification  
- **Pharmacists** - Prescription validation and consultation
- **Medical Residents** - Learning and reference tool
- **Emergency Medicine** - Quick dosing in critical situations

### Clinical Settings
- **Hospital Wards** - Bedside medication reference
- **Emergency Departments** - Rapid dosing calculations
- **Outpatient Clinics** - Consultation support
- **Pharmacies** - Prescription verification
- **Medical Education** - Student and resident training

## ⚠️ Medical Disclaimer

**Important**: TinyDose is a reference tool for healthcare professionals. 

- Always verify dosages with current prescribing information
- Use clinical judgment for all dosing decisions
- Consult with physicians or pharmacists when in doubt
- Not a substitute for professional medical advice
- Regularly updated but may not reflect latest changes

## 🤝 Contributing

We welcome contributions from the medical and developer community!

### Areas for Contribution
- **Drug Database Updates**: New medications, dosing updates
- **Feature Enhancements**: UI improvements, new calculations
- **Documentation**: User guides, medical content review
- **Testing**: Cross-browser compatibility, PWA features
- **Accessibility**: Screen reader support, keyboard navigation

### Development Guidelines
1. **Medical Accuracy**: All drug information must be verified
2. **Code Quality**: TypeScript, ESLint, proper testing
3. **PWA Compliance**: Maintain offline functionality
4. **Mobile First**: Touch-friendly, responsive design
5. **Performance**: Fast loading, efficient caching

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Medical Data**: Compiled from reputable pediatric formularies
- **Design System**: ShadCN UI component library
- **Icons**: Lucide React icon set
- **PWA Tools**: Workbox and Vite PWA plugin

## 📞 Support

- **Documentation**: Check the `docs/` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Medical Questions**: Consult healthcare professionals
- **Feature Requests**: Submit via GitHub Discussions

---

<div align="center">
  <p><strong>TinyDose - Precision care in every drop</strong></p>
  <p>Built for healthcare professionals who demand accuracy and reliability</p>
  
  ⭐ **Star this repo** if TinyDose helps you provide better pediatric care!
</div>

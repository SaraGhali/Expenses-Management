# 💰 Expenses Management System

A modern, feature-rich expense tracking application built with React, Vite, Material-UI, and Firebase. Manage your income and expenses with beautiful charts, detailed reporting, and complete offline support.

## ✨ Features

### Core Functionality
- **📱 Progressive Web App (PWA)** - Install on any device, works offline
- **🔥 Firebase Firestore Integration** - Real-time cloud database synchronization
- **💳 Dual-Mode Transactions** - Track both income (+) and expenses (-)
- **📊 Monthly Summary** - Comprehensive table with income/expense breakdown
- **📈 Advanced Reports** - Charts, trends, and category analysis
- **🌍 Multi-Language Support** - English and Arabic (RTL support)
- **🎨 Beautiful UI** - Material Design with gradient cards and smooth animations

### Transaction Management
- Add income (positive amounts) or expenses (negative amounts)
- Multiple categories (Food, Transport, Entertainment, Utilities, Health, Education, Shopping, etc.)
- Edit and delete transactions
- Date-based tracking
- Real-time Firebase synchronization

### Analytics & Insights
- **Dashboard** - Quick overview of totals and monthly stats
- **Summary Page** - Detailed monthly transaction table with filtering by month/year
- **Reports Page** - 
  - Monthly trend visualization (Line chart)
  - Category breakdown (Bar chart)
  - Category details table
  - Yearly summary with income vs expenses

### Design Improvements
- Modern gradient-based color scheme
- Smooth hover animations on cards
- Better typography and spacing
- Responsive layout for mobile, tablet, and desktop
- Dark header with gradient background
- Color-coded transactions (green for income, red for expenses)

### Internationalization (i18n)
- Complete English translations
- Full Arabic translations with RTL layout support
- Language toggle in app header
- Persistent language preference (localStorage)
- Cairo font for better Arabic rendering

### PWA Features
- Offline functionality
- Service worker for caching
- Installable on home screen
- App shortcuts for quick actions
- Screenshots for app stores
- Workbox caching strategy for Firebase

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will open at http://localhost:3001

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── pages/
│   ├── Dashboard.jsx      # Overview and statistics
│   ├── Expenses.jsx       # Transaction management
│   ├── Summary.jsx        # Monthly summary table (NEW)
│   └── Reports.jsx        # Analytics and charts
├── components/            # Reusable components (to be added)
├── utils/
│   ├── firebaseService.js # Firebase Firestore API
│   └── authService.js     # Authentication
├── i18n/                  # Internationalization (NEW)
│   ├── en.json           # English translations
│   ├── ar.json           # Arabic translations
│   └── i18n.js           # i18n utility functions
├── theme.js              # Material-UI theme (NEW)
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── App.css               # Global styles
public/
├── icon-192x192.svg      # App icon (PWA)
├── icon-512x512.svg      # App icon (PWA)
├── screenshot-540.svg    # Mobile screenshot
└── screenshot-1280.svg   # Desktop screenshot
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at https://firebase.google.com
2. Update `src/firebase.config.js` with your credentials:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  storageBucket: 'your-project.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
}
```

3. Enable Firestore Database in Firebase Console
4. Set up authentication (optional, currently using test-user)

### PWA Configuration
- Edit `vite.config.js` to customize PWA settings
- Update `index.html` for theme colors and metadata
- PWA icons are in `public/` folder as SVG files

## 🎯 Usage Guide

### Adding Transactions
1. Click "Add Transaction" button on Expenses page
2. Enter:
   - **Date**: When the transaction occurred
   - **Description**: What the transaction is for
   - **Amount**: Use positive number for income, negative for expenses
     - Example: `500` for income, `-50` for expense
   - **Category**: Select appropriate category
3. Click "Save"

### Viewing Monthly Summary
1. Go to "Summary" page
2. Select month and year using dropdowns
3. View:
   - Total income and expenses
   - Net balance
   - Detailed transaction table
   - Edit or delete transactions

### Generating Reports
1. Go to "Reports" page
2. Select year to view
3. View:
   - Monthly trend line chart (income vs expenses)
   - Category breakdown bar chart
   - Detailed category summary table

### Changing Language
1. Click language button in top-right corner
2. Select "English" or "العربية" (Arabic)
3. Preference is saved automatically

## 📦 Dependencies

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Routing
- **@mui/material** - UI components
- **@mui/icons-material** - Icon library
- **firebase** - Backend services (Auth, Firestore)
- **recharts** - Charting library
- **@emotion/react** & **@emotion/styled** - CSS-in-JS
- **vite-plugin-pwa** - PWA support

## 🌐 Internationalization

### Adding New Translations
1. Update `src/i18n/en.json` for English
2. Update `src/i18n/ar.json` for Arabic
3. Use in components:

```jsx
import { i18n } from '../i18n/i18n'

const t = (key) => i18n.t(key)
// Usage: {t('dashboard.title')}
```

## 🔐 Firebase Security Rules

Recommended Firestore rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Deployment

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🐛 Troubleshooting

### Firebase Data Not Showing
- Ensure Firebase Firestore database is initialized
- Check collection name is "transactions"
- Verify user ID in component (currently "test-user")
- Check Firebase security rules allow read/write

### PWA Not Working
- Clear browser cache
- Check service worker registration in DevTools
- Ensure HTTPS is enabled on production

### Arabic Text Not Displaying Correctly
- Ensure Cairo font is loaded from Google Fonts
- Check direction: RTL is automatically applied
- Verify i18n.getDirection() returns 'rtl'

## 🎨 Customization

### Change Primary Color
Edit `src/theme.js`:
```javascript
primary: {
  main: '#YOUR_COLOR'
}
```

### Add New Categories
Edit `src/i18n/en.json` and `ar.json`:
```json
"categories": {
  "newCategory": "New Category Name"
}
```

Update the Select options in `Expenses.jsx` and `Summary.jsx`

## 📝 License

MIT License

## 👨‍💻 Author

Expenses Management Team

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

**Made with ❤️ for better expense management**

├── pages/          # Page components
├── components/     # Reusable components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── firebase.config.js  # Firebase setup
├── App.jsx        # Main App component
└── main.jsx       # Entry point
```

## Firebase Setup

The app uses Firebase for:
- Authentication
- Real-time database (Firestore)
- Cloud Storage

Firebase config is pre-configured in `src/firebase.config.js`

## License

MIT

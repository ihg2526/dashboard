# Score Dashboard

A React + Tailwind CSS score dashboard for a 6-team league with standings and match results.

## 📁 Project Structure

```
score/
├── index.html                 # Vite entry
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── components/
│   │   ├── StandingsTable.jsx  # League standings table
│   │   └── ResultsGrid.jsx     # Recent results cards
│   ├── App.jsx                 # Main app component
│   ├── data.js                 # Fixed standings and fixtures data
│   ├── index.js                # React entry point
│   └── index.css               # Tailwind directives
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.js              # Vite configuration
└── .gitignore                  # Git ignore file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+) and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev
```

The app will open at `http://localhost:3000` (configured in vite.config.js)

## 🎨 Features

- ✅ **League Standings Table** - Auto-sorted by points and goal difference
- ✅ **Recent Results** - Grid view of recent matches
- ✅ **Top 3 Highlighting** - Color-coded for 1st, 2nd, and 3rd place
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Tailwind CSS** - Easy to customize and scale

## 📝 Customization

### Edit Teams & Data

Modify `src/data.js` to change:

- Team names, emojis, and IDs
- Match results and dates
- Standings and points

### Customize Styling

All styles use Tailwind CSS classes. Modify `tailwind.config.js` for:

- Color palette
- Spacing
- Responsive breakpoints

### Add Components

To add new features:

1. Create a new component in `src/components/`
2. Import and use it in `App.jsx`

## 🏗️ Build for Production

```bash
npm run build

# Optionally preview the production build
npm run preview
```

Creates an optimized production build in the `dist/` directory.

## 📦 Dependencies

- **React 19** - UI framework
- **Tailwind CSS 3** - Utility-first CSS
- **Vite** - Dev server and bundler
- **PostCSS** - CSS processing

---

**Version**: 0.1.0 | **React + Tailwind CSS**

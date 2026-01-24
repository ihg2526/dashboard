# Score Dashboard

A React + Tailwind CSS score dashboard for a 6-team league with standings and match results.

**Live Demo:** [https://ihg2526.github.io/dashboard/](https://ihg2526.github.io/dashboard/)

## 📁 Project Structure

```
score/
├── index.html                 # Vite entry
├── public/                    # Static assets & Uploads
│   └── uploads/               # User-uploaded files (document forms)
├── backend/                   # Local development server
│   ├── data/
│   │   └── db.json            # LIVE local database
│   └── server.js              # Express server
├── src/
│   ├── staticDb.json          # STATIC production database (auto-published)
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── services/
│   │   └── api.js             # API interaction logic
│   ├── App.jsx                # Main app component
│   └── index.css              # Tailwind directives
├── package.json               # Dependencies
├── vite.config.js             # Configuration
└── DEPLOY.md                  # Deployment Guide
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+) and npm

### Installation

```bash
### Local Development (With Admin Panel)

To run the app with the Admin Panel and live database editing:

```bash
# Terminal 1: Start the Frontend
npm run dev

# Terminal 2: Start the Backend (in root folder)
node backend/server.js
```

- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/admin (Only available in Dev mode)
- **Backend API**: http://localhost:3001

## 🎨 Features

- ✅ **League Standings Table** - Auto-sorted by points and goal difference
- ✅ **Recent Results** - Grid view of recent matches
- ✅ **Top 3 Highlighting** - Color-coded for 1st, 2nd, and 3rd place
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Tailwind CSS** - Easy to customize and scale

## 📝 Customization

### Edit Teams & Data

### 1. Update Data
1.  Run the project locally (`npm run dev` and `node backend/server.js`).
2.  Go to the **Admin Panel** (`/admin`).
3.  Add matches, upload forms, or update standings.

### 2. Publish Changes
The app is built to be deployed as a **static site**. The live database is not used in production.
1.  In the Admin Panel header, click **"☁️ Publish Changes"**.
2.  This copies the live data from `backend/data/db.json` to `src/staticDb.json` and syncs uploaded files.

### 3. Deploy
See the detailed guide in [DEPLOY.md](./DEPLOY.md).

Essentially:
1.  Commit the updated `src/staticDb.json` and `public/uploads` folders.
2.  Push to GitHub.
3.  The GitHub Action will automatically build and deploy.

## 📝 Customization

### Edit Teams & Configuration
Modify `backend/data/db.json` directly or use the Admin UI.

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

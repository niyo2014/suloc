# 🚀 SULOC CMS - Modernized Quick Start Guide

Welcome to the modernized SULOC CMS! The project has been migrated from PHP to a high-performance **Node.js/Express** backend and a **Vite/React** frontend.

---

## 🛠 Prerequisites

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MySQL 5.7+** or MariaDB 10.3+

---

## 📂 Project Structure

```text
SULOC_2/
├── server/             # Node.js/Express Backend
│   ├── src/            # Source code (API, Logic, Middleware)
│   ├── prisma/         # Database schema & migrations
│   └── .env            # Backend environment config
├── client/             # Vite/React Frontend
│   ├── src/            # React components & pages
│   ├── public/         # Static assets & locales
│   └── .env            # Frontend environment config
└── uploads/            # Shared media storage
```

---

## 🚀 Step 1: Backend Setup (3 minutes)

1.  **Install Dependencies**:
    ```bash
    cd server
    npm install
    ```

2.  **Configure Environment**:
    Create `server/.env`:
    ```env
    PORT=5000
    DATABASE_URL="mysql://user:pass@localhost:3306/suloc_db"
    JWT_SECRET="your_very_secure_secret"
    NODE_ENV=development
    ```

3.  **Database Introspection**:
    ```bash
    npx prisma generate
    ```

4.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    The backend will run on `http://localhost:5000`.

---

## 🎨 Step 2: Frontend Setup (2 minutes)

1.  **Install Dependencies**:
    ```bash
    cd client
    npm install
    ```

2.  **Start Vite Dev Server**:
    ```bash
    npm run dev
    ```
    The frontend will run on `http://localhost:5173`.

---

## 🌍 Step 3: Localization (Bilingual Support)

- Translations are managed in `client/public/locales/`.
- Edit `fr.json` or `en.json` to update text across the site.
- The system uses `i18next` for instant language switching without page reloads.

---

## 🏗 Production Build

To prepare the application for production:

### Backend
```bash
cd server
npm run build # if using TS, otherwise just deploy
```

### Frontend
```bash
cd client
npm run build
```
The optimized assets will be in `client/dist/`.

---

## 🎯 Verification Checklist

- [ ] Backend health check: `http://localhost:5000/api/health` returns `status: ok`.
- [ ] Frontend loads at `http://localhost:5173`.
- [ ] Database content (services/vehicles) appears on the Home page.
- [ ] Language switcher (FR/EN) updates UI instantly.
- [ ] Mobile navigation works on small screens.

---

## 📞 Support & Documentation

- **Migration Walkthrough**: Check `walkthrough.md` for technical deep-dives.
- **Legacy Reference**: The original PHP files are preserved in the root for reference during transition.

---
**Setup Time**: < 5 minutes
**Stack**: Node.js, Express, Prisma, React, Vite, Tailwind CSS

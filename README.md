# Samadhaan Setu

**Samadhaan Setu** is a civic issue reporting platform built for **Nagpur city**. It connects citizens directly with local municipal authorities — allowing them to report issues like potholes, garbage, broken streetlights, and water leakage, then track every complaint until it's resolved.

> *Your voice, delivered to the administration.*

---

## Project Structure

This is a monorepo with two independent parts:

```
samadhaan-setu/
├── frontend/     # React + Vite + Tailwind CSS (citizen-facing web app)
└── backend/      # Node.js + Express (API — in progress)
```

---

## Tech Stack

**Frontend**
- React 19 (via Vite)
- React Router (`react-router-dom`) for page navigation
- Tailwind CSS v4 for styling
- `react-icons` for iconography
- Browser Geolocation API + OpenStreetMap Nominatim (reverse geocoding)

**Backend**
- Node.js + Express (scaffolded, core routes not yet built)

**ML Model (separate component)**
- A custom-trained **MobileNetV2** image classification model
- Trained to detect: **Garbage**, **Pothole**, **Manhole**, **Water Leak**
- Includes an **"Unknown"** class — irrelevant/unrelated images submitted by users are rejected instead of being misclassified into a real category
- Purpose: validate photos uploaded during complaint submission so junk/irrelevant images don't get filed as real civic complaints

---

## What's Been Built So Far

### Homepage (`pages/HomePageUI.jsx`)
Composed from modular, reusable sections:
- **Carousel** — rotating hero banner with headline, CTA, and illustration
- **Search** — auto-detects the user's current location (via Geolocation + reverse geocoding) and pre-fills the "area" field; single "Report Issue" button (category dropdown removed for simplicity)
- **ServiceGrid** — 6 issue categories (Roads & Potholes, Garbage & Sanitation, Street Lighting, Water Supply, Parks & Public Spaces, Public Safety)
- **SpecialityCard** — browse by civic department (Municipal Corporation, Water Department, Electricity Board, Traffic Police, Sanitation Department, Parks & Horticulture)
- **ServiceCard** — live stats band (issues reported, resolved, wards covered, avg. resolution time)
- **RecentResolved** — showcase of recently resolved complaints
- **Banners** — promotional strip (track status / ward dashboard)
- **JoinUsCard** — CTA for ward officers / municipal staff to register

### Layout Components
- **Header** — sticky nav bar with logo, links, and "Report an Issue" CTA; responsive mobile menu
- **Footer** — logo, description, and link columns (Services / Company / Support), mobile-responsive
- **BottomNav** — mobile-only fixed bottom navigation (Home, Track Status, **+** Report, Your Complaints, Profile), hidden on desktop
- **LocationGate** — checks that the user is physically within ~30km of Nagpur before allowing full access to the app

### Routing
- `react-router-dom` set up in `App.jsx` with routes for the homepage and an "Under Development" placeholder page, defaulting unknown routes back to the homepage

### Design System
- Custom Tailwind color tokens: `brand-green` (`#0B3D3A`) and `brand-coral` (`#FF6B54`)
- Fonts: Fraunces (headings), IBM Plex Sans (body), IBM Plex Mono (labels)

---

## What's Not Built Yet
- Backend API routes (complaint submission, status tracking, auth)
- Database integration
- Actual "Report an Issue" form/page
- Integration of the MobileNetV2 image-validation model into the upload flow
- Ward officer / admin dashboard
- User authentication

---

## Setting Up the Project on a New Computer

### Prerequisites
Install these first:
- **Node.js** (LTS version) — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)

Check both are installed:
```bash
node -v
npm -v
git --version
```

### Step 1: Clone the repository
```bash
git clone <your-github-repo-url>
cd samadhaan-setu
```

### Step 2: Set up the frontend
```bash
cd frontend
npm install
```

This installs everything already listed in `package.json`, including:
- `react`, `react-dom`, `react-router-dom`
- `react-icons`
- `tailwindcss`, `@tailwindcss/vite` (dev dependency)

### Step 3: Run the frontend
```bash
npm run dev
```
Open the URL shown in the terminal (usually `http://localhost:5173`).

### Step 4: Set up the backend (once it has real code)
```bash
cd ../backend
npm install
node server.js
```

### Notes for a fresh machine
- Geolocation features (`LocationGate`, auto-location in `Search`) require **HTTPS in production** — this works automatically once deployed (e.g. on Vercel). On `localhost`, browsers allow it over plain HTTP.
- Make sure `tailwind.config.js` and the `@theme` block in `src/index.css` (defining `brand-green` / `brand-coral`) are present — without them, the site will load unstyled.
- Place the logo file at `frontend/src/assets/logo.png` and the hero banner at `frontend/src/assets/hero-banner.png` if they aren't already tracked in Git (check `.gitignore` if images are missing after clone).

---

## Deployment

Currently deployed via **Vercel**:
- Root Directory: `frontend`
- Framework Preset: Vite (auto-detected)
- Build Command: `npm run build`
- Output Directory: `dist`

The backend is not yet deployed — it will need a separate host  Render once built out.

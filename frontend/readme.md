# Samadhaan Setu - Frontend

React web app for citizens and admins. Citizens report civic issues with a photo (camera or upload), the app checks the photo with the AI model, attaches the precise GPS location, and lets them track the status. Admins manage all complaints from one panel. It is mobile first and works as a normal website.

**Stack:** React 19, Vite, Tailwind CSS v4, React Router, react-icons.

## Requirements

- **Node.js 18 or newer** (Node 20 LTS recommended). Check with `node -v`.
- The **backend** running (see `backend/README.md`) and the **ML service** (see root `README.md`).

## Setup on a new machine

**1. Clone and install**

```bash
git clone <your-repo-url>
cd samadhaan-setu/frontend
npm install
```

If something is reported missing, install the full list:

```bash
npm install react react-dom react-router-dom react-icons
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite
```

**2. Create `.env`**

```bash
cp .env.example .env
```

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Node backend |
| `VITE_ML_API_URL` | `http://127.0.0.1:8000` | FastAPI model service |

Vite reads `.env` only at start. **Restart `npm run dev` after any change.** Only variables starting with `VITE_` reach the browser, so never put secrets here.

**3. Add the image files** (if they are not in Git)

```
src/assets/logo.png
src/assets/hero-banner.png
public/favicon.png        # square image works best for the browser tab icon
```

**4. Run**

```bash
npm run dev
```

Open `http://localhost:5173`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Required configuration (check these if the page is blank or unstyled)

**`vite.config.js`** needs the Tailwind plugin:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**`src/index.css`** needs the Tailwind import and the brand colours (Tailwind v4 reads colours from CSS, not from `tailwind.config.js`):

```css
@import "tailwindcss";

@theme {
  --color-brand-green: #0B3D3A;
  --color-brand-coral: #FF6B54;
}

body {
  margin: 0;
}
```

**`src/main.jsx`** must wrap the app in a router:

```jsx
import { BrowserRouter } from "react-router-dom";
// ...
<BrowserRouter>
  <App />
</BrowserRouter>
```

## Pages

| Route | Access | Page |
|---|---|---|
| `/` | public | Home |
| `/login`, `/signup` | public | Authentication |
| `/report` | logged in | Camera / upload, AI check, precise location, submit |
| `/track` | logged in | Track Status: your complaints, progress bar and timeline |
| `/admin` | admin only | Admin panel: all complaints with photo, map and status update |
| `/under-development` | public | Placeholder for pages not built yet |

Logged-out users who open a protected page are sent to `/login` and come back after logging in.

## Folder structure

```
frontend/src/
├── components/     # Header, Footer, BottomNav (mobile), LocationGate, Search,
│                   # ProtectedRoute, AuthImage, Section
├── layouts/home/   # Home page sections (Carousel, ServiceGrid, Banners, ...)
├── pages/          # HomePageUI, AuthPage, ReportIssue, TrackStatus, AdminPanel
├── context/        # AuthContext (login state, token)
├── hooks/          # useCurrentLocation (GPS + address)
├── services/       # api.js (backend calls), classifyImage.js (ML calls)
├── constants/      # complaint labels and status colours
└── App.jsx         # routes
```

## How location works

- `LocationGate` asks for location when the site opens and only allows users who are within 30 km of a supported city (Nagpur, Mumbai, Pune, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad, Jaipur, Lucknow, Surat, Indore, Nashik). To add a city, edit the list in `components/LocationGate.jsx` **and** `components/Search.jsx` (keep both lists the same).
- The report page reads the precise GPS position again and looks up the address with OpenStreetMap Nominatim.
- Browsers allow **location and live camera only on HTTPS or `localhost`**.

### Testing on a phone

`http://192.168.x.x:5173` is not a secure origin, so GPS is blocked there. Test on the deployed Vercel site, or use an HTTPS tunnel (for example `cloudflared` or `ngrok`) to your dev server.

## Deployment (Vercel)

1. Import the repo. **Root Directory: `frontend`**. Framework preset: Vite (auto detected).
2. Add environment variables in Vercel: `VITE_API_URL` (your deployed backend, ending with `/api`) and `VITE_ML_API_URL` (your deployed model service, https).
3. Add `frontend/vercel.json` so that opening or refreshing a route like `/track` does not show a 404:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

4. Redeploy after changing environment variables, and add the Vercel URL to `CLIENT_URL` in the backend.

## Troubleshooting

| Problem | Fix |
|---|---|
| Blank white page | Open the browser console (F12). Fix the first red error |
| Page loads but looks unstyled | `tailwindcss()` missing in `vite.config.js`, or `@import "tailwindcss";` missing in `index.css`. Restart `npm run dev` |
| Brand colour classes do nothing | `@theme` block is missing in `index.css` |
| `Failed to resolve import ...` | File name case must match exactly on Linux (for example `Banners.jsx`, not `banners.jsx`) |
| `useRoutes() may be used only in the context of a <Router>` | Wrap `<App />` in `<BrowserRouter>` in `main.jsx` |
| "Failed to fetch" on login | Backend is not running, or `VITE_API_URL` is wrong. Restart the dev server after editing `.env` |
| CORS error | Add your frontend address to `CLIENT_URL` in the backend `.env` |
| "Could not reach the AI service" | FastAPI is not running, or `VITE_ML_API_URL` is wrong |
| Stuck on "Location access needed" | Allow location in the browser (lock icon in the address bar) and tap Allow Location |
| Camera does not open | Needs HTTPS or localhost, and camera permission. Upload still works |
| `/track` or `/login` gives 404 after deploy | Add the `vercel.json` rewrite shown above |# Samadhaan Setu - Frontend

React web app for citizens and admins. Citizens report civic issues with a photo (camera or upload), the app checks the photo with the AI model, attaches the precise GPS location, and lets them track the status. Admins manage all complaints from one panel. It is mobile first and works as a normal website.

**Stack:** React 19, Vite, Tailwind CSS v4, React Router, react-icons.

## Requirements

- **Node.js 18 or newer** (Node 20 LTS recommended). Check with `node -v`.
- The **backend** running (see `backend/README.md`) and the **ML service** (see root `README.md`).

## Setup on a new machine

**1. Clone and install**

```bash
git clone <your-repo-url>
cd samadhaan-setu/frontend
npm install
```

If something is reported missing, install the full list:

```bash
npm install react react-dom react-router-dom react-icons
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite
```

**2. Create `.env`**

```bash
cp .env.example .env
```

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Node backend |
| `VITE_ML_API_URL` | `http://127.0.0.1:8000` | FastAPI model service |

Vite reads `.env` only at start. **Restart `npm run dev` after any change.** Only variables starting with `VITE_` reach the browser, so never put secrets here.

**3. Add the image files** (if they are not in Git)

```
src/assets/logo.png
src/assets/hero-banner.png
public/favicon.png        # square image works best for the browser tab icon
```

**4. Run**

```bash
npm run dev
```

Open `http://localhost:5173`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Required configuration (check these if the page is blank or unstyled)

**`vite.config.js`** needs the Tailwind plugin:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**`src/index.css`** needs the Tailwind import and the brand colours (Tailwind v4 reads colours from CSS, not from `tailwind.config.js`):

```css
@import "tailwindcss";

@theme {
  --color-brand-green: #0B3D3A;
  --color-brand-coral: #FF6B54;
}

body {
  margin: 0;
}
```

**`src/main.jsx`** must wrap the app in a router:

```jsx
import { BrowserRouter } from "react-router-dom";
// ...
<BrowserRouter>
  <App />
</BrowserRouter>
```

## Pages

| Route | Access | Page |
|---|---|---|
| `/` | public | Home |
| `/login`, `/signup` | public | Authentication |
| `/report` | logged in | Camera / upload, AI check, precise location, submit |
| `/track` | logged in | Track Status: your complaints, progress bar and timeline |
| `/admin` | admin only | Admin panel: all complaints with photo, map and status update |
| `/under-development` | public | Placeholder for pages not built yet |

Logged-out users who open a protected page are sent to `/login` and come back after logging in.

## Folder structure

```
frontend/src/
├── components/     # Header, Footer, BottomNav (mobile), LocationGate, Search,
│                   # ProtectedRoute, AuthImage, Section
├── layouts/home/   # Home page sections (Carousel, ServiceGrid, Banners, ...)
├── pages/          # HomePageUI, AuthPage, ReportIssue, TrackStatus, AdminPanel
├── context/        # AuthContext (login state, token)
├── hooks/          # useCurrentLocation (GPS + address)
├── services/       # api.js (backend calls), classifyImage.js (ML calls)
├── constants/      # complaint labels and status colours
└── App.jsx         # routes
```

## How location works

- `LocationGate` asks for location when the site opens and only allows users who are within 30 km of a supported city (Nagpur, Mumbai, Pune, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad, Jaipur, Lucknow, Surat, Indore, Nashik). To add a city, edit the list in `components/LocationGate.jsx` **and** `components/Search.jsx` (keep both lists the same).
- The report page reads the precise GPS position again and looks up the address with OpenStreetMap Nominatim.
- Browsers allow **location and live camera only on HTTPS or `localhost`**.

### Testing on a phone

`http://192.168.x.x:5173` is not a secure origin, so GPS is blocked there. Test on the deployed Vercel site, or use an HTTPS tunnel (for example `cloudflared` or `ngrok`) to your dev server.

## Deployment (Vercel)

1. Import the repo. **Root Directory: `frontend`**. Framework preset: Vite (auto detected).
2. Add environment variables in Vercel: `VITE_API_URL` (your deployed backend, ending with `/api`) and `VITE_ML_API_URL` (your deployed model service, https).
3. Add `frontend/vercel.json` so that opening or refreshing a route like `/track` does not show a 404:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

4. Redeploy after changing environment variables, and add the Vercel URL to `CLIENT_URL` in the backend.

## Troubleshooting

| Problem | Fix |
|---|---|
| Blank white page | Open the browser console (F12). Fix the first red error |
| Page loads but looks unstyled | `tailwindcss()` missing in `vite.config.js`, or `@import "tailwindcss";` missing in `index.css`. Restart `npm run dev` |
| Brand colour classes do nothing | `@theme` block is missing in `index.css` |
| `Failed to resolve import ...` | File name case must match exactly on Linux (for example `Banners.jsx`, not `banners.jsx`) |
| `useRoutes() may be used only in the context of a <Router>` | Wrap `<App />` in `<BrowserRouter>` in `main.jsx` |
| "Failed to fetch" on login | Backend is not running, or `VITE_API_URL` is wrong. Restart the dev server after editing `.env` |
| CORS error | Add your frontend address to `CLIENT_URL` in the backend `.env` |
| "Could not reach the AI service" | FastAPI is not running, or `VITE_ML_API_URL` is wrong |
| Stuck on "Location access needed" | Allow location in the browser (lock icon in the address bar) and tap Allow Location |
| Camera does not open | Needs HTTPS or localhost, and camera permission. Upload still works |
| `/track` or `/login` gives 404 after deploy | Add the `vercel.json` rewrite shown above |
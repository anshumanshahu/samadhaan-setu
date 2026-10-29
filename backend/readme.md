# Samadhaan Setu - Backend

Node.js + Express API with MongoDB Atlas. It handles sign up / login, receives civic complaints (photo + precise location), re-checks every photo with the ML service, and powers the admin panel and the Track Status page.

## Requirements

- **Node.js 18 or newer** (Node 20 LTS recommended). Check with `node -v`.
- A free **MongoDB Atlas** account and cluster.
- The **ML service** (FastAPI) running, see the root `README.md`. The backend calls it to verify each complaint photo.

Install Node with [nvm](https://github.com/nvm-sh/nvm) if your package manager gives an old version:

```bash
nvm install 20
nvm use 20
```

## Setup on a new machine

**1. Clone and install**

```bash
git clone <your-repo-url>
cd samadhaan-setu/backend
npm install
```

`npm install` reads `package.json` and installs everything. If it complains about a missing package, install the full list manually:

```bash
npm install express cors dotenv mongoose bcryptjs jsonwebtoken express-rate-limit multer
```

**2. Create `.env`**

`.env` is never committed to Git, so create it on every new machine:

```bash
cp .env.example .env
```

Then open `.env` and fill in the values (see the table below).

**3. Set up MongoDB Atlas** (skip if you already have a cluster)

1. Create a free **M0** cluster on [mongodb.com/atlas](https://www.mongodb.com/atlas) (region: Mumbai).
2. **Database Access**: add a database user (username + password). Avoid special characters like `@ : /` in the password.
3. **Network Access**: add the IP address of the machine you are working on. **A new machine or a new wifi network means a new IP**, so add it again. For a deployed server use `0.0.0.0/0` together with a strong password.
4. **Connect > Drivers**: copy the connection string, replace `<password>`, and add the database name before the `?`:

```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/samadhaan-setu?retryWrites=true&w=majority
```

**4. Run**

```bash
node --watch server.js
```

You should see:

```
MongoDB Atlas connected
Server running on port 5000
```

Collections (`users`, `complaints`) are created automatically on first use.

## Environment variables

| Variable | Example | Purpose |
|---|---|---|
| `PORT` | `5000` | Port the API listens on |
| `MONGO_URI` | `mongodb+srv://...` | Atlas connection string (the name must be exactly `MONGO_URI`) |
| `JWT_SECRET` | long random string | Signs login tokens. Keep it secret |
| `CLIENT_URL` | `http://localhost:5173` | Allowed frontend origin(s), comma separated |
| `ML_API_URL` | `http://127.0.0.1:8000` | Address of the FastAPI model service |
| `NODE_ENV` | `development` / `production` | `production` enables proxy trust (needed behind Render/Railway) |

Generate a good `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

When you deploy the frontend, add its URL too: `CLIENT_URL=http://localhost:5173,https://your-app.vercel.app`

## Optional: npm scripts

Add these to `package.json` so you can run `npm run dev`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "node --watch server.js"
}
```

## Create the first admin

Sign up normally on the website first, then promote that account:

```bash
node scripts/makeAdmin.js you@example.com
```

Log out and log in again (or refresh the page). An **Admin** link appears in the header and `/admin` opens. Roles are always read from the database, never from the token or the browser.

## API reference

All routes except sign up / login need the header `Authorization: Bearer <token>`.

| Method | Route | Who | What |
|---|---|---|---|
| POST | `/api/auth/signup` | public | `{ name, email, password }` (min 8 chars) |
| POST | `/api/auth/login` | public | `{ email, password }` returns `{ token, user }` |
| GET | `/api/auth/me` | user | Current user |
| POST | `/api/complaints` | user | Multipart form: `image`, `latitude`, `longitude`, `accuracy`, `address`, `city`, `description`. The server checks the photo with the ML model and rejects `unknown` / uncertain photos |
| GET | `/api/complaints/mine` | user | The logged-in user's complaints (Track Status page) |
| GET | `/api/complaints/:id/image` | owner or admin | The complaint photo |
| GET | `/api/admin/stats` | admin | Counts by status |
| GET | `/api/admin/complaints` | admin | List. Query: `status`, `category`, `page`, `limit` |
| PATCH | `/api/admin/complaints/:id/status` | admin | `{ status, adminNote }` |

- **Statuses:** `submitted`, `in_progress`, `resolved`, `rejected`
- **Categories:** `garbage`, `pothole`, `manhole`, `water_leak`

Quick test:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test12345"}'
```

## Folder structure

```
backend/
├── config/db.js                    # MongoDB connection
├── models/
│   ├── User.js                     # name, email, hashed password, role
│   └── Complaint.js                # category, photo, GeoJSON location, status, history
├── controllers/
│   ├── authController.js           # signup, login, me
│   ├── complaintController.js      # create, my complaints, photo
│   └── adminController.js          # list, stats, update status
├── middleware/authMiddleware.js    # protect (login) + adminOnly
├── routes/                         # authRoutes, complaintRoutes, adminRoutes
├── services/mlService.js           # calls the FastAPI /predict endpoint
├── scripts/makeAdmin.js            # promote a user to admin
├── server.js                       # app entry point
├── .env.example                    # copy to .env
└── package.json
```

## Security notes

- Passwords are hashed with bcrypt (12 rounds) and never returned by the API.
- Login errors are generic, so nobody can discover which emails are registered.
- Inputs are type-checked and filters are whitelisted (protects against NoSQL injection).
- Uploads: 5 MB limit, and the real file bytes are checked (JPEG / PNG / WebP only), not just the file name.
- Rate limits: 20 login/signup attempts per 15 minutes, 15 complaints per hour, per IP.
- Photos are private: only the reporter and admins can open them.
- Never commit `.env`. Make sure `.gitignore` contains `.env` and `node_modules`.
- GPS coordinates come from the user's device, so they cannot be fully verified on the server.

## Deployment (Render, Railway, etc.)

1. Root directory: `backend`. Start command: `node server.js`.
2. Add all environment variables from the table above. Set `NODE_ENV=production`, `CLIENT_URL` to your Vercel URL, and `ML_API_URL` to your hosted FastAPI URL.
3. In Atlas **Network Access** allow the host (`0.0.0.0/0` is the simple option).

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find module 'dotenv'` (or any package) | Run `npm install` inside `backend/` |
| `Cannot find module '../controllers/authController'` | File names are case sensitive on Linux and macOS. The file must be exactly `authController.js` |
| `The uri parameter ... got "undefined"` | `.env` must be inside `backend/` and the variable must be named `MONGO_URI` (not `MONGODB_URI`) |
| `bad auth` / `Authentication failed` | Wrong Atlas username or password. Reset it in Database Access |
| `Server selection timed out` / `ETIMEDOUT` | Your current IP is not allowed. Add it in Atlas **Network Access** |
| `AI service is unavailable` (503) | The FastAPI service is not running, or `ML_API_URL` is wrong |
| Browser shows a CORS error | `CLIENT_URL` must contain the exact frontend address (no trailing slash) |
| `Session expired` (401) after restart | Log in again. Changing `JWT_SECRET` also logs everyone out |
| `Admin access only` (403) | Run `makeAdmin.js` for that email, then log in again |
| Photo rejected (422) | The model said the photo is `unknown` or not confident enough. Use a clearer, closer photo |
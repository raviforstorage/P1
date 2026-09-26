# CampusConnect

A production-structured full-stack doubt-resolution & resource-sharing portal, built for
the AI & ML Club website-building competition.

**Stack:** React (Vite) frontend · Node.js/Express REST API · MongoDB (Mongoose) ·
JWT auth with bcrypt password hashing · optional server-side Claude API call for the
AI bonus feature.

```
campusconnect/
├── client/     React (Vite) frontend
└── server/     Express REST API + MongoDB models
```

## 1. Prerequisites

- Node.js 18+ and npm
- A MongoDB connection string — either:
  - a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or
  - a local MongoDB instance (`mongodb://localhost:27017/campusconnect`)

## 2. Local setup

**Backend**
```bash
cd server
npm install
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm run seed               # creates demo admin: admin@campus.edu / admin123
npm run dev                 # starts the API on http://localhost:5000
```

**Frontend** (in a second terminal)
```bash
cd client
npm install
npm run dev                 # starts the app on http://localhost:5173
```

In dev, Vite proxies `/api/*` requests to `http://localhost:5000` (see
`client/vite.config.js`), so you don't need to set `VITE_API_URL` locally.

Open `http://localhost:5173`, sign up as a student, or log in as the seeded admin.

## 3. Environment variables

**server/.env**
| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `PORT` | API port (default 5000) |
| `CLIENT_ORIGIN` | Frontend URL, for CORS (e.g. your Vercel/Netlify URL in prod) |
| `ANTHROPIC_API_KEY` | Optional — enables the real AI assistant instead of the offline fallback |
| `AI_ENABLED` | Set to `true` to turn on the live Claude call (requires the key above) |

**client/.env**
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Full URL of the deployed backend, e.g. `https://campusconnect-api.onrender.com/api` |

## 4. AI bonus feature

The "AI Study Assistant" widget always works, even fully offline: `server/controllers/aiController.js`
falls back to a rule-based reply whenever `AI_ENABLED` isn't `true` or the Anthropic
API call fails for any reason (missing key, no internet, rate limit). The Anthropic key
lives only in `server/.env` and is never sent to the browser — the frontend just calls
your own `/api/ai/ask` endpoint.

To turn on the live model at the venue (if you have a key and internet):
```
ANTHROPIC_API_KEY=sk-ant-...
AI_ENABLED=true
```

## 5. Deploying it as a live site

**Database — MongoDB Atlas**
1. Create a free cluster at mongodb.com/atlas.
2. Add a database user and allow access from anywhere (`0.0.0.0/0`) for the demo.
3. Copy the connection string into `MONGO_URI`.

**Backend — Render (or Railway)**
1. Push this repo to GitHub.
2. New Web Service → connect the repo → set root directory to `server`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add the environment variables from the table above (`MONGO_URI`, `JWT_SECRET`,
   `CLIENT_ORIGIN` = your frontend's deployed URL, and the AI vars if using them).
5. After the first deploy, run the seed script once via Render's shell (`npm run seed`)
   to create the demo admin.

**Frontend — Vercel (or Netlify)**
1. New Project → import the repo → set root directory to `client`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Add environment variable `VITE_API_URL` = your Render backend URL + `/api`
   (e.g. `https://campusconnect-api.onrender.com/api`).
4. Deploy. Once live, copy that frontend URL back into the backend's `CLIENT_ORIGIN`
   env var on Render and redeploy the backend so CORS allows it.

That's it — you'll have a real, shareable HTTPS link for judges to open on their own
devices, backed by a persistent database and real authentication, instead of a single
local file.

## 6. What's real here (vs. a demo shortcut)

- Passwords are hashed with bcrypt before storage — never stored in plain text.
- Roles are taken from the signed JWT on every protected request, never trusted from
  the request body, so a student can't call themselves "admin" from the browser.
- All data (users, doubts, contact messages) persists in MongoDB, not localStorage.
- Every API route validates its input and returns proper HTTP status codes.

# Deployment Guide

| Service | URL |
|---------|-----|
| **Frontend** | https://grp-ashy.vercel.app |
| **Backend**  | https://back-2-13os.onrender.com |

---

## What was configured

### Frontend (`frontend/.env`)
```
VITE_API_URL=https://back-2-13os.onrender.com/api
```

### Backend (`back/src/index.ts`)
CORS allows:
- `https://grp-ashy.vercel.app` (deployed frontend)
- `http://localhost:8080`, `:3000`, `:5173` (local dev)

### Render (`render.yaml`)
- `FRONTEND_URL` defaults to `https://grp-ashy.vercel.app`
- `buildCommand` / `startCommand` correctly use the `back/` folder

---

## Redeploy both services

### 1. Push latest code to GitHub
```bash
git add .
git commit -m "fix: connect deployed frontend and backend"
git push origin main
```

### 2. Redeploy Backend (Render)
- In Render dashboard, the Blueprint should auto-deploy on push.
- Or trigger a manual deploy.

### 3. Redeploy Frontend (Vercel)
- In Vercel dashboard, add the environment variable:
  - `VITE_API_URL` = `https://back-2-13os.onrender.com/api`
- Trigger a redeploy so the env var is included in the build.

---

## Local Development

No env vars needed — the fallback defaults work out of the box:

```bash
# Terminal 1 — Backend
cd back
npm install
npm run dev        # http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev        # http://localhost:8080
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Frontend still calls `localhost:5000` | Ensure `VITE_API_URL` is set in Vercel dashboard **and** you redeployed |
| CORS errors in browser | Backend `FRONTEND_URL` env var must match your exact Vercel URL |
| Render build fails | Make sure `back/` folder exists at repo root and `render.yaml` is pushed |

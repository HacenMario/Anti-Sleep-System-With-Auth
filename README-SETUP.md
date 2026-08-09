# Anti Sleep System — MongoDB Authentication

## Architecture
- GitHub: source repository
- Vercel: frontend/PWA
- Render: Node.js/Express API
- MongoDB Atlas: users database

## Backend on Render
Set Root Directory to `backend` (or deploy `backend` as a separate repository).
Build Command: `npm install`
Start Command: `npm start`

Environment variables:
- MONGODB_URI
- JWT_SECRET
- FRONTEND_ORIGIN
- NODE_ENV=production
- COOKIE_SAMESITE=lax

## Vercel
Update `vercel.json` and replace `YOUR-RENDER-SERVICE.onrender.com` with the real Render hostname.

The frontend calls `/api/...`, so the browser stays on the Vercel origin while Vercel proxies API requests to Render.

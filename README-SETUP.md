# Anti Sleep System — V2

Privacy-first browser driver drowsiness monitoring by MADOUNINE HACENE.

## V2 features
- MediaPipe FaceMesh with left + right eye EAR.
- Automatic 8-second personal EAR calibration.
- PERCLOS rolling 60-second analysis.
- Approximate head pose (yaw/pitch).
- Drowsiness risk score from 0–100.
- Three alarm intensity levels.
- Driver Monitoring Mode + Screen Wake Lock.
- Local session history and JSON reports.
- Optional cloud sync of aggregated session summaries only.
- JWT authentication in HttpOnly cookies.
- PWA + Service Worker offline shell.

## Privacy
Camera frames, face images, landmarks, raw EAR samples and audio are processed locally and are not uploaded by the application. Cloud storage contains only account information and aggregated session statistics.

## Deployment
### Render backend
Root Directory: `backend`
Build Command: `npm install`
Start Command: `npm start`

Required environment variables:
- `MONGODB_URI`
- `JWT_SECRET` (32+ characters)
- `FRONTEND_ORIGIN`
- `NODE_ENV=production`
- `COOKIE_SAMESITE=lax`

### Vercel frontend
Deploy the frontend root. `vercel.json` proxies `/api/*` to the Render backend.

## Important
This application is a driver-assistance monitoring tool, not a substitute for safe driving, adequate rest, or professional safety equipment. Never use the interface while actively driving in a way that distracts you.

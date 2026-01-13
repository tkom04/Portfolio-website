# Deployment Guide

## Railway Deployment (Recommended)

Railway is recommended because this app uses file system writes for the lights log (`data/lights-log.json`), which requires persistent storage.

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Set Environment Variables**
   In Railway dashboard, add these variables:
   - `HA_ACCESS_TOKEN` - Your Home Assistant long-lived access token
   - `HA_BASE_URL` - Your Home Assistant URL (e.g., `http://homeassistant.local:8123`)

4. **Deploy**
   - Railway will automatically detect Next.js and deploy
   - The build will run `npm run build`
   - The app will start with `npm start`

5. **Custom Domain (Optional)**
   - In Railway dashboard, go to Settings → Networking
   - Generate a domain or add your custom domain

### Important Notes:
- The `data/` folder will persist on Railway's file system
- Large GLTF files (~40MB total) are included in the build
- Make sure `.env.local` is in `.gitignore` (it already is)

---

## Vercel Deployment (Requires Database Migration)

Vercel won't work with the current file-based logging because:
- Serverless functions have read-only file systems
- File writes don't persist between invocations

### To use Vercel, you'd need to:

1. **Migrate logs to a database** (Supabase, MongoDB, or Vercel Postgres)
2. **Update `app/api/lights/log/route.ts`** to use the database instead of file system
3. **Deploy to Vercel** - it's optimized for Next.js

Would you like me to help migrate to a database so you can use Vercel?

---

## Environment Variables Needed

Both platforms require:
- `HA_ACCESS_TOKEN` - Home Assistant access token
- `HA_BASE_URL` - Home Assistant base URL

Set these in your platform's environment variables section.


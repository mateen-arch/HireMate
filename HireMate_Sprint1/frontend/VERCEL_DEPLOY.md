# Vercel Deployment Guide

## Quick Setup

### Option 1: Deploy from Frontend Directory (Recommended)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Vercel CLI (if not installed):**
   ```bash
   npm i -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (for first deployment)
   - Project name? (Press Enter for default)
   - Directory? **./** (current directory)
   - Override settings? **No**

### Option 2: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Add New Project"**
3. **Import your Git repository** (if connected) or upload the `frontend` folder
4. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: **frontend** (if deploying from root) or **.** (if deploying from frontend folder)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Environment Variables** (if needed):
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.vercel.app/api` or your deployed backend URL)

6. **Click Deploy**

## Configuration Files

The project includes:
- `vercel.json` - Vercel configuration for SPA routing
- `.vercelignore` - Files to ignore during deployment

## Important Notes

### Backend API
- The frontend expects the backend API at `/api` endpoints
- For production, update `VITE_API_URL` in environment variables
- Or update `frontend/src/utils/api.js` to use your backend URL

### SPA Routing
- All routes are configured to redirect to `index.html` for React Router to work
- This is handled by the `vercel.json` rewrites configuration

### Build Output
- Build creates a `dist` folder with static files
- Vercel serves these files automatically

## Troubleshooting

### 404 Errors
- ✅ Make sure `vercel.json` is in the frontend directory
- ✅ Check that rewrites are configured correctly
- ✅ Verify build output directory is `dist`

### API Connection Issues
- ✅ Set `VITE_API_URL` environment variable in Vercel dashboard
- ✅ Make sure your backend is deployed and accessible
- ✅ Check CORS settings on backend

### Build Failures
- ✅ Check Node.js version (Vercel uses Node 18+ by default)
- ✅ Verify all dependencies are in `package.json`
- ✅ Check build logs in Vercel dashboard

## Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.com/api
```

## Testing After Deployment

1. Visit your Vercel URL
2. Test all routes:
   - `/` - Home page
   - `/register` - Registration page
   - `/login` - Login page
   - `/jobs` - Jobs listing
   - `/job/:id` - Job details
   - `/post-job` - Post job page

All routes should work without 404 errors!


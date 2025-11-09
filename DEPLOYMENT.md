# Deployment Guide for HireMate

## Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment

1. **Make sure you're in the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Test the build locally:**
   ```bash
   npm run build
   ```
   This should create a `dist` folder. Verify it contains `index.html` and assets.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

1. **Install Vercel CLI globally:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory:**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? → **Yes**
   - Which scope? → Select your account
   - Link to existing project? → **No** (first time) or **Yes** (if redeploying)
   - Project name? → Press Enter for default or enter custom name
   - Directory? → **./** (current directory)
   - Override settings? → **No**

5. **For production deployment:**
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Click "Add New Project"**

3. **Import your Git repository:**
   - Connect your GitHub/GitLab/Bitbucket account
   - Select the `HireMate_Sprint1` repository
   - **IMPORTANT:** Set Root Directory to `frontend`

4. **Configure Build Settings:**
   - Framework Preset: **Vite** (or Other)
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Environment Variables:**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - (You'll need to deploy backend first or use your backend URL)

6. **Click "Deploy"**

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add:
```
VITE_API_URL=https://your-backend-api-url.com/api
```

**Note:** Replace with your actual backend URL once deployed.

## Backend Deployment

### Option 1: Deploy Backend to Vercel (Serverless Functions)

1. **Create `api` folder in root:**
   ```bash
   mkdir api
   ```

2. **Create serverless function wrapper** (if needed)

3. **Or deploy backend separately** to:
   - Railway
   - Render
   - Heroku
   - DigitalOcean
   - AWS/Google Cloud

### Option 2: Deploy Backend to Railway/Render (Recommended)

#### Railway:
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select backend folder
4. Set start command: `npm start`
5. Add environment variables from `backend/env.example`

#### Render:
1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables

## Important Configuration Files

### Frontend (`frontend/vercel.json`)
- Handles SPA routing (all routes → index.html)
- Configures caching for assets

### Frontend (`frontend/.vercelignore`)
- Excludes unnecessary files from deployment

## Troubleshooting

### 404 Errors on Routes

**Problem:** Routes like `/jobs`, `/register` show 404

**Solution:**
- ✅ Verify `vercel.json` exists in `frontend` directory
- ✅ Check that rewrites are configured: `"source": "/(.*)", "destination": "/index.html"`
- ✅ Make sure you're deploying from `frontend` directory or set Root Directory correctly

### API Connection Issues

**Problem:** Frontend can't connect to backend

**Solution:**
- ✅ Set `VITE_API_URL` environment variable in Vercel
- ✅ Update CORS settings in backend to allow your Vercel domain
- ✅ Check backend is deployed and accessible

### Build Failures

**Problem:** Build fails on Vercel

**Solution:**
- ✅ Check Node.js version (Vercel uses 18.x by default)
- ✅ Verify all dependencies are in `package.json`
- ✅ Check build logs in Vercel dashboard
- ✅ Test build locally: `npm run build`

### Assets Not Loading

**Problem:** CSS/JS files return 404

**Solution:**
- ✅ Check `vite.config.js` build output directory is `dist`
- ✅ Verify assets are in `dist/assets` after build
- ✅ Check base path in Vite config (should be `/` for root deployment)

## Quick Checklist

Before deploying:
- [ ] Test build locally: `npm run build`
- [ ] Verify `dist` folder is created
- [ ] Check `vercel.json` exists in frontend
- [ ] Set environment variables in Vercel
- [ ] Deploy backend and get URL
- [ ] Update `VITE_API_URL` with backend URL
- [ ] Test all routes after deployment

## Post-Deployment Testing

After deployment, test:
1. ✅ Home page loads (`/`)
2. ✅ Registration page (`/register`)
3. ✅ Login page (`/login`)
4. ✅ Jobs listing (`/jobs`)
5. ✅ Job details (`/job/:id`)
6. ✅ Post job page (`/post-job`)
7. ✅ All routes work without 404 errors

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set
4. Test API endpoints directly
5. Check CORS configuration on backend


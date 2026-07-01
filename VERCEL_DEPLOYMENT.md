# 🚀 Vercel Deployment Guide

This guide will help you deploy the AEM Visual Portal to Vercel in minutes.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com (free tier works!)
2. **GitHub Account**: Your code should be pushed to GitHub
3. **Vercel CLI** (optional): `npm install -g vercel`

---

## 🎯 Deployment Strategy

We'll deploy **Frontend ONLY** to Vercel for the prototype:
- ✅ Frontend (Next.js) → Vercel
- ⚠️ Backend → We'll use a simple API proxy or deploy separately

For the prototype with mock data, we have two options:

### Option A: Frontend Only (Recommended for Quick Demo)
Deploy just the frontend and move mock data to Next.js API routes.

### Option B: Full Stack on Vercel
Deploy both frontend and backend as separate Vercel projects.

---

## 🚀 Quick Deploy - Option A (Frontend Only)

### Step 1: Push Your Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin claude/plan-aem-library-01NwUfar18HqXNwKgK6wfgmD
```

### Step 2: Deploy to Vercel

#### Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select `AEM-Visual-Library`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install --legacy-peer-deps`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   NEXT_PUBLIC_ENV=production
   ```

6. Click "Deploy"

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? aem-visual-portal
# - Which directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## 🔧 Option B: Full Stack Deployment

### Deploy Backend

1. Create a new Vercel project for backend
2. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. Environment Variables:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend.vercel.app
   LOG_LEVEL=info
   USE_MOCK_DATA=true
   ```

### Deploy Frontend

1. Deploy frontend as in Option A
2. Set `NEXT_PUBLIC_API_URL` to your backend Vercel URL

---

## ⚙️ Environment Variables Reference

### Frontend (.env.production)
```bash
NEXT_PUBLIC_API_URL=https://your-api.vercel.app
NEXT_PUBLIC_ENV=production
```

### Backend (.env.production)
```bash
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend.vercel.app
LOG_LEVEL=info
USE_MOCK_DATA=true
```

---

## ✅ Post-Deployment Checklist

After deployment:

- [ ] Frontend URL is accessible
- [ ] Homepage loads without errors
- [ ] Navigate to /components
- [ ] Components list displays
- [ ] Search functionality works
- [ ] Component detail pages load

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: TypeScript errors during build
**Solution**: 
```bash
cd frontend
npm run build  # Test locally first
```

**Issue**: Missing dependencies
**Solution**: Ensure `package.json` has all dependencies listed

### Runtime Errors

**Issue**: API calls fail
**Solution**: Check CORS settings and API URL in environment variables

**Issue**: Components not loading
**Solution**: Verify mock data is accessible and API routes are working

---

## 📊 What Gets Deployed

### Frontend
- Next.js application
- Static assets
- Environment variables
- Mock data (if using API routes)

### Backend (if deployed)
- Express server
- Mock component data
- Mock services
- Health check endpoint

---

## 💡 Next Steps After Deployment

1. **Custom Domain**: Add a custom domain in Vercel dashboard
2. **Analytics**: Enable Vercel Analytics for usage insights
3. **Monitoring**: Set up error tracking (Sentry, etc.)
4. **Real Database**: When ready, migrate from mock data to real database

---

## 🔗 Useful Links

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel CLI Docs: https://vercel.com/docs/cli

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Review build output
3. Verify environment variables
4. Test locally with `npm run build && npm start`

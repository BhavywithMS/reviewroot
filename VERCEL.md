# Vercel Deployment Guide

Step-by-step instructions to deploy **ReviewRoot** on Vercel.

---

## Option A: Frontend on Vercel + Backend on Render (Recommended)

This is the easiest approach - deploy frontend on Vercel and backend on Render.

### Step A1: Deploy Backend on Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New+" → "Web Service"
   - Select your repository
   - Configure:
     - Name: `reviewroot-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `node server.js`
   - Click "Deploy"

3. **Add Environment Variables**
   | Key | Value |
   |-----|--------|
   | MONGO_URI | Your MongoDB Atlas connection string |
   | PORT | 3000 |
   | NODE_ENV | production |
   | BASE_URL | https://reviewroot-api.onrender.com |
   | ALLOWED_ORIGINS | * |
   | JWT_SECRET | random_string |

4. **Note Your Backend URL**
   - Example: `https://reviewroot-api.onrender.com`

---

### Step A2: Deploy Frontend on Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Update Code for Vercel**
   
   Create `vercel.json` in project root:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

3. **Push Changes to GitHub**
   ```bash
   git add .
   git commit -m "Add vercel config"
   git push
   ```

4. **Deploy on Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your repository
   - Configure:
     - Framework Preset: `Other`
     - Build Command: (leave empty)
     - Output Directory: `public`
   - Click "Deploy"

5. **Add Environment Variables (Optional)**
   If you want frontend to work with different backend:
   | Key | Value |
   |-----|--------|
   | VITE_API_URL | https://reviewroot-api.onrender.com |

---

### Step A3: Update Backend BASE_URL

After Vercel deployment, note your frontend URL (e.g., `https://reviewroot.vercel.app`)

1. Go to Render dashboard
2. Update `BASE_URL` to your Vercel URL
3. Redeploy

---

## Option B: Full Deployment on Vercel (Serverless)

This deploys everything on Vercel using API routes. Requires code adaptation.

### Step B1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step B2: Convert to Vercel API Routes

Create `api/` directory and convert routes:

1. **Create api/server.js**
   ```javascript
   const { createServer } = require('http');
   const { parse } = require('url');
   const next = require('next');
   const mongoose = require('mongoose');
   
   const dev = process.env.NODE_ENV !== 'production';
   const app = next({ dev, dir: '.' });
   const handle = app.getRequestHandler();
   
   app.prepare().then(() => {
     createServer((req, res) => {
       const parsedUrl = parse(req.url, true);
       handle(req, res, parsedUrl);
     }).listen(3000, (err) => {
       if (err) throw err;
       console.log('> Ready on http://localhost:3000');
     });
   });
   ```

2. **Create individual API route files:**
   - `api/auth/register.js`
   - `api/auth/login.js`
   - `api/products/index.js`
   - `api/reviews/index.js`

### Step B3: Update package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "vercel-deploy": "node server.js"
  }
}
```

### Step B4: Deploy to Vercel

```bash
vercel
```

Or push to GitHub and import in Vercel dashboard.

---

## Testing Your Vercel Deployment

### Test Commands
```bash
# Test health
curl https://your-vercel-app.vercel.app/api/health

# Test reviews
curl https://your-vercel-app.vercel.app/api/reviews
```

### Complete Test Flow
1. Visit `https://your-app.vercel.app`
2. Register a business account
3. Login to dashboard
4. Add a product
5. Copy feedback link
6. Open in incognito window
7. Register as customer
8. Submit review
9. Check dashboard for new review

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB connection | Check MONGO_URI in Vercel dashboard |
| API 404 errors | Ensure `/api/` prefix in routes |
| Session lost | Vercel serverless = stateless, use JWT |
| Cold starts | First request may be slow on free tier |
| CORS errors | Set ALLOWED_ORIGINS to your Vercel domain |

---

## URLs After Deployment

| Service | URL Format |
|---------|------------|
| Frontend | https://reviewroot.vercel.app |
| Backend API | https://reviewroot-api.onrender.com/api |
| Health Check | https://reviewroot-api.onrender.com/api/health |

---

## Quick Summary

### For Vercel Only (Frontend)
1. Push code to GitHub
2. Import to Vercel
3. Set Output Directory: `public`
4. Deploy!

### For Full Stack
1. Frontend → Vercel
2. Backend → Render.com
3. Update BASE_URL on Render

---

## Success!

Your ReviewRoot app on Vercel:
- **Frontend**: https://your-app.vercel.app

Start collecting reviews!

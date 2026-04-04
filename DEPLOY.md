# Deployment Guide

Complete step-by-step instructions to deploy **ReviewRoot** for free.

---

## Prerequisites

Before deploying, you need:

1. **GitHub Account** - https://github.com (free)
2. **MongoDB Atlas Account** - https://cloud.mongodb.com (free)
3. **Node.js** installed locally

---

## Step 1: Prepare MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to https://cloud.mongodb.com
2. Click "Try Free" 
3. Sign up with Google or Email

### 1.2 Create Free Cluster
1. Click "Create" → "Deploy Free Cluster"
2. Select nearest region (e.g., AWS, closest to you)
3. Click "Create Cluster"

### 1.3 Create Database User
1. Click "Database Access" → "Add New Database User"
2. Username: `reviewroot`
3. Password: `yourpassword123` (remember this!)
4. Click "Add User"

### 1.4 Network Access
1. Click "Network Access" → "Add IP Address"
2. Select "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### 1.5 Get Connection String
1. Click "Database" → "Connect" → "Drivers"
2. Copy the connection string
3. Replace `<password>` with your password

Example:
```
mongodb+srv://reviewroot:yourpassword123@cluster0.abc123.mongodb.net/reviewroot?retryWrites=true&w=majority
```

---

## Step 2: Push Code to GitHub

### 2.1 Create GitHub Repository
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `reviewroot`
4. Make it Public
5. Click "Create repository"

### 2.2 Push Code
In your project folder:
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/reviewroot.git
git push -u origin main
```

---

## Step 3: Deploy on Render.com

### 3.1 Create Render Account
1. Go to https://render.com
2. Click "Sign Up" → "GitHub"
3. Authorize GitHub

### 3.2 Deploy Web Service
1. Click "New+" → "Web Service"
2. Select your repository: `reviewroot`
3. Configure:
   - **Name**: `reviewroot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Click "Deploy Web Service"

### 3.3 Add Environment Variables
In Render dashboard, go to "Environment":

| Key | Value |
|-----|--------|
| MONGO_URI | Your MongoDB Atlas connection string |
| PORT | 3000 |
| NODE_ENV | production |
| BASE_URL | https://reviewroot.onrender.com |
| ALLOWED_ORIGINS | * |
| JWT_SECRET | A random string (generate one) |

Wait 2-3 minutes for deployment!

### 3.4 Get Your Live URL
After deploy, you'll get a URL like:
```
https://reviewroot.onrender.com
```

---

## Step 4: Test Your Deployed App

### Test Flow:
1. Visit your Render URL (e.g., `https://reviewroot.onrender.com`)
2. Click "Get Started" to register a business account
3. Login to dashboard
4. Add a product
5. Copy the feedback link
6. Open in new incognito window
7. As customer, register/login and give review
8. See review appear on business dashboard

### Test Commands
```bash
# Test health endpoint
curl https://reviewroot.onrender.com/api/health

# Test reviews
curl https://reviewroot.onrender.com/api/reviews

# Test products
curl https://reviewroot.onrender.com/api/products
```

---

## Important Notes

### URLs Format
- Your app: `https://reviewroot.onrender.com`
- Feedback links: `https://reviewroot.onrender.com/feedback.html?product=ProductName`
- API: `https://reviewroot.onrender.com/api/...`

### Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check username/password in MONGO_URI |
| CORS error | Update ALLOWED_ORIGINS in .env |
| 404 on routes | Add '/api' prefix to routes if needed |
| Module not found | Ensure npm install runs before deploy |

### Keeping Backend Running 24/7

Render's free tier sleeps after 15 min of inactivity. To keep it awake 24/7:

#### Option A: Use Cron-Job.org (Recommended - Free)

1. Go to https://cron-job.org
2. Register for free account
3. Click "Create cronjob"
4. Configure:
   - **Title**: `Ping ReviewRoot`
   - **URL**: `https://reviewroot.onrender.com/api/health`
   - **Schedule**: Every 15 minutes
   - **HTTP Method**: GET
5. Click "Create"

#### Option B: Use GitHub Actions

Create `.github/workflows/ping.yml`:

```yaml
name: Ping Render
on:
  schedule:
    - cron: '*/15 * * * *'
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Render
        run: curl -s https://reviewroot.onrender.com/api/health
```

Push this file to GitHub - it will run every 15 minutes.

---

## Success!

Your ReviewRoot app is now live!

- **App URL**: https://reviewroot.onrender.com

Share your feedback links and start collecting reviews!

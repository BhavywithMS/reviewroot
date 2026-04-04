# Deploy Feedback Portal - Free Hosting Guide

This guide provides step-by-step instructions to deploy your Feedback Portal project for free.

---

## Prerequisites

Before deploying, ensure you have:
- A GitHub account (free)
- A MongoDB Atlas account (free)
- Node.js installed on your computer

---

## Step 1: Prepare Your Project

### 1.1 Update MongoDB Connection
Update your `.env` file to work with MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/feedbackdb?retryWrites=true&w=majority
PORT=3000
```

### 1.2 Update Server.js for Production
Update `server.js` to handle dynamic port:

```javascript
const PORT = process.env.PORT || 3000;
```

### 1.3 Test Locally
```bash
cd "D:\SaaS Product\Feedback and Review Colletor"
node server.js
```

---

## Step 2: Create GitHub Repository

### 2.1 Go to GitHub
Visit: https://github.com

### 2.2 Create New Repository
- Click "New" button
- Repository name: `feedback-portal`
- Choose "Public" (free)
- Click "Create repository"

### 2.3 Push Your Code
Run these commands in your project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/feedback-portal.git
git push -u origin main
```

---

## Step 3: Deploy Backend (Render.com - FREE)

### 3.1 Create Render Account
1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New+" → "Web Service"

### 3.2 Connect GitHub
- Select your repository: `feedback-portal`
- Branch: `main`

### 3.3 Configure Service
- **Name**: feedback-portal-api
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### 3.4 Add Environment Variables
Click "Advanced" → "Add Environment Variables":

| Key | Value |
|-----|-------|
| MONGO_URI | Your MongoDB Atlas connection string |
| PORT | 3000 |

### 3.5 Deploy
- Click "Deploy Web Service"
- Wait 2-3 minutes for deployment
- Your API will be at: `https://feedback-portal-api.onrender.com`

---

## Step 4: Update Code for Production URL

### 4.1 Update Feedback Links
In `routes/productRoutes.js`, change:
```javascript
const shareLink = `http://localhost:3000/feedback.html?product=${encodeURIComponent(name)}`;
```
To:
```javascript
const shareLink = `https://feedback-portal-api.onrender.com/feedback.html?product=${encodeURIComponent(name)}`;
```

### 4.2 Update Frontend API Calls
In `public/feedback.html`, update API calls:
```javascript
// Change from localhost to your render URL
fetch('https://feedback-portal-api.onrender.com/api/reviews', ...)
```

### 4.3 Commit Changes
```bash
git add .
git commit -m "Update for production"
git push origin main
```

---

## Step 5: Alternative - Deploy Frontend Separately

### Option A: Deploy Frontend on Vercel (FREE)

1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Set output directory: `public`
6. Deploy

### Option B: Deploy Everything on Render

1. Keep everything on Render
2. Create a "Static Site" service
3. Point to your `public` folder

---

## Complete Deployment Checklist

### MongoDB Atlas Setup
- [ ] Create free MongoDB Atlas account
- [ ] Create free cluster (M0)
- [ ] Create database user
- [ ] Get connection string
- [ ] Add IP to whitelist (0.0.0.0 for all)

### GitHub Setup
- [ ] Create GitHub repository
- [ ] Push all code
- [ ] Make repository public

### Backend Deployment
- [ ] Deploy to Render.com
- [ ] Add environment variables
- [ ] Test API endpoints

### Frontend Deployment
- [ ] Update all localhost URLs to production URL
- [ ] Deploy frontend (Vercel or Render)
- [ ] Test complete flow

---

## Testing Your Deployed App

### Test Flow:
1. Visit your frontend URL
2. Register a business account
3. Login to dashboard
4. Add a product
5. Copy the feedback link
6. Open incognito window
7. Visit feedback link as customer
8. Register/Login as customer
9. Submit a review
10. See review on business dashboard

---

## Common Issues & Fixes

### Issue: "Application Error"
- Check logs in Render dashboard
- Ensure MONGO_URI is correct
- Verify port is set to 3000

### Issue: "CORS Error"
- Update CORS in server.js:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app']
}));
```

### Issue: "Module Not Found"
- Ensure package.json has all dependencies
- Check that node_modules is not in .gitignore

---

## Free Hosting Options Summary

| Service | What to Deploy | Free Tier |
|---------|---------------|-----------|
| Render.com | Backend API | 750 hours/month |
| Vercel | Frontend | Unlimited |
| MongoDB Atlas | Database | 512MB storage |

---

## Support

If you need help:
1. Check Render.com logs
2. Test API with Postman
3. Verify MongoDB connection
4. Check GitHub issues

---

**Happy Deployment! 🚀**

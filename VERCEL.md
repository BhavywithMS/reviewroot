# Deploying ReviewRoot to Vercel

Vercel is primarily designed for static sites and serverless functions (like Next.js), but it can perfectly host an Express backend and static frontend in a single repository.

Follow these steps to deploy your **Express + Static Frontend** project to Vercel.

---

## Step 1: Update `server.js` for Vercel

Vercel runs backend code as a **Serverless Function**. Instead of telling the server to `listen` on a port, you need to **export** the Express application so Vercel can handle the HTTP requests.

At the very bottom of your `server.js` file, modify the "Start Server" block. 

Change this:
```javascript
// Start Server
app.listen(PORT, () => {
  console.log('');
  console.log('Server running');
  console.log('Local:   http://localhost:' + PORT);
  console.log('Health:  http://localhost:' + PORT + '/api/health');
  console.log('Env:     ' + NODE_ENV);
  console.log('');
});
```

To this:
```javascript
// Start Server (Only listen locally, don't listen on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('');
    console.log('Server running');
    console.log('Local:   http://localhost:' + PORT);
    console.log('Health:  http://localhost:' + PORT + '/api/health');
    console.log('Env:     ' + NODE_ENV);
    console.log('');
  });
}

// Export the app for Vercel Serverless Function
module.exports = app;
```

---

## Step 2: Update `vercel.json`

Currently, your `vercel.json` routes everything to `/index.html`. We need to tell Vercel to:
1. Treat `server.js` as a Node.js serverless function.
2. Route any `/api/*` traffic to `server.js`.
3. Route everything else (your frontend) to the `public` folder.

Replace the contents of your `vercel.json` with the following:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/index.html"
    }
  ]
}
```

---

## Step 3: Deployment Options

You can deploy using either the **Vercel CLI** or via **GitHub**.

### Option A: Deploy via GitHub (Recommended)
1. Push your project to a GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
3. Import your GitHub repository.
4. **Important**: Before clicking "Deploy", expand the **Environment Variables** section and add the variables from your `.env` file (e.g., `MONGO_URI`, `JWT_SECRET`, etc.).
5. Click **Deploy**.

### Option B: Deploy via Vercel CLI
1. Install the Vercel CLI globally if you haven't already:
   ```bash
   npm install -g vercel
   ```
2. Run the deployment command from your project root:
   ```bash
   vercel
   ```
3. Follow the prompts. When it asks if you want to link to an existing project, say **No**, and follow the setup instructions.
4. Go to your project settings in the Vercel Dashboard and add your **Environment Variables** (`MONGO_URI`, `JWT_SECRET`, etc.).
5. Run a production deployment:
   ```bash
   vercel --prod
   ```

---

## Troubleshooting

- **500 Internal Server Error on `/api` routes**: Ensure your `MONGO_URI` is correctly set in your Vercel Environment Variables. The database connection might be failing.
- **Frontend not loading**: Check the "routes" setup in `vercel.json`. It guarantees anything not starting with `/api` attempts to load `index.html` from `public`.

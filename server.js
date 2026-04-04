require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── MongoDB Connection ────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI || MONGO_URI.includes('<username>')) {
  console.error('');
  console.error('❌  MONGO_URI is not set in your .env file.');
  console.error('   Open .env and paste your MongoDB Atlas connection string.');
  console.error('   See the comments inside .env for instructions.');
  console.error('');
  process.exit(1);   // stop the server — no point running without a DB
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅  MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── API Routes ────────────────────────────────────────────────────────────
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewerRoutes = require('./routes/reviewerRoutes');

app.use('/', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviewers', reviewerRoutes);

// ── Start Server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running at http://localhost:${PORT}`);
});

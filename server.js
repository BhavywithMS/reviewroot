require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  if (!MONGO_URI || MONGO_URI.includes('<username>')) {
    throw new Error('MONGO_URI is not set');
  }
  
  await mongoose.connect(MONGO_URI, {
    maxPoolSize: 10,
  });
  isConnected = true;
  console.log('MongoDB connected successfully');
}

// Ensure database is connected before handling any requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(500).json({ message: 'Internal Server Error: Database Connection Failed' });
  }
});

// API Routes
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewerRoutes = require('./routes/reviewerRoutes');

app.use('/api', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviewers', reviewerRoutes);

app.locals.BASE_URL = BASE_URL;

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    message: NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server (Only listen locally, don't listen on Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
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

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Reviewer = require('../models/reviewerModel');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const reviewerExists = await Reviewer.findOne({ email });
    if (reviewerExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const reviewer = new Reviewer({ name, email, password });
    await reviewer.save();

    const token = jwt.sign(
      { id: reviewer._id },
      process.env.JWT_SECRET || 'mysecret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      reviewer: {
        id: reviewer._id,
        name: reviewer.name,
        email: reviewer.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const reviewer = await Reviewer.findOne({ email });
    if (!reviewer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await reviewer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: reviewer._id },
      process.env.JWT_SECRET || 'mysecret',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      reviewer: {
        id: reviewer._id,
        name: reviewer.name,
        email: reviewer.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reviewer profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    const reviewer = await Reviewer.findById(decoded.id).select('-password');
    
    if (!reviewer) {
      return res.status(404).json({ message: 'Reviewer not found' });
    }
    
    res.json(reviewer);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update reviewer profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    const { name, email } = req.body;
    
    const reviewer = await Reviewer.findById(decoded.id);
    if (!reviewer) {
      return res.status(404).json({ message: 'Reviewer not found' });
    }
    
    if (email && email !== reviewer.email) {
      const emailExists = await Reviewer.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    reviewer.name = name || reviewer.name;
    reviewer.email = email || reviewer.email;
    
    await reviewer.save();
    
    res.json({
      id: reviewer._id,
      name: reviewer.name,
      email: reviewer.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/password', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    const { currentPassword, newPassword } = req.body;
    
    const reviewer = await Reviewer.findById(decoded.id);
    if (!reviewer) {
      return res.status(404).json({ message: 'Reviewer not found' });
    }
    
    const isMatch = await reviewer.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    reviewer.password = newPassword;
    await reviewer.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reviewer's own reviews
router.get('/my-reviews', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    const Review = require('../models/reviewModel');
    
    const reviews = await Review.find({ reviewer: decoded.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

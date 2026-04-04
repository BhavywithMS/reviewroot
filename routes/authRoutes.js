const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Business = require('../models/businessModel');

// POST /api/auth/register - Business registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, businessName } = req.body;

    const businessExists = await Business.findOne({ email });
    if (businessExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const business = new Business({ name, email, password, businessName });
    await business.save();

    res.status(201).json({ message: 'Business account created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/login - Business login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await business.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: business._id },
      process.env.JWT_SECRET || 'mysecret',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: business._id,
        name: business.name,
        email: business.email,
        businessName: business.businessName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/auth/profile - Get business profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    const business = await Business.findById(decoded.id).select('-password');
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    res.json(business);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// PUT /api/auth/profile - Update business profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    const { name, email, businessName } = req.body;
    
    const business = await Business.findById(decoded.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    if (email && email !== business.email) {
      const emailExists = await Business.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    business.name = name || business.name;
    business.email = email || business.email;
    business.businessName = businessName || business.businessName;
    
    await business.save();
    
    res.json({
      id: business._id,
      name: business.name,
      email: business.email,
      businessName: business.businessName
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/auth/password - Change password
router.put('/password', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    const { currentPassword, newPassword } = req.body;
    
    const business = await Business.findById(decoded.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    const isMatch = await business.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    business.password = newPassword;
    await business.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

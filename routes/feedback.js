const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// GET all feedback entries
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET a single feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create new feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, category, message } = req.body;
    const feedback = await Feedback.create({ name, email, category, message });
    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH update feedback status
router.patch('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.json({ success: true, data: feedback });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE a feedback entry
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

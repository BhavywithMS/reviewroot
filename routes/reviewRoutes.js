const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');

router.post('/reviews', async (req, res) => {
  try {
    const { productName, reviewer, reviewerName, reviewerEmail, rating, comment } = req.body;
    
    const review = new Review({
      productName,
      reviewer,
      reviewerName,
      reviewerEmail,
      rating,
      comment
    });
    
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).populate('reviewer', 'name email');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

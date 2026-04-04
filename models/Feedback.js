const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ['Bug', 'Feature Request', 'General', 'Other'],
      default: 'General',
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Resolved'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);

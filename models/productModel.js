const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  shareLink: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Product', productSchema);

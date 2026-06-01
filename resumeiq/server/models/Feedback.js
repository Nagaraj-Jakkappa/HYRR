const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: null
  },
  type: {
    type: String,
    enum: ['bug', 'feature', 'payment', 'ai_result', 'general'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 120
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'reviewed', 'resolved'],
    default: 'open'
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

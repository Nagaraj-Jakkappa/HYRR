const mongoose = require('mongoose');

/**
 * Suggestion Schema
 * Represents actionable advice from the AI.
 * Normalizes 'text' and 'type' for the frontend UI.
 */
const suggestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['warning', 'tip', 'success', 'info'],
    default: 'info'
  },
  text: {
    type: String,
    required: true
  },
}, { _id: false });

/**
 * Scan Schema
 * Stores the full analysis of a resume against a job description.
 * Optimized with indexes for Admin Dashboard aggregation pipelines.
 */
const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  keywordMatchPct: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  formattingScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  matchedKeywords: [{
    type: String
  }],
  missingKeywords: [{
    type: String // Essential for "Top 10 Most Missed Keywords" aggregation
  }],
  suggestions: [suggestionSchema],
  status: {
    type: String,
    enum: ['pending', 'processing', 'done', 'failed'],
    default: 'pending'
  },
  aiModel: {
    type: String,
    default: 'llama-3.3-70b-versatile'
  },
  tokensUsed: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

// --- INDEXES FOR PRODUCTION PERFORMANCE ---

// 1. For Daily Volume & Distribution Aggregations (Admin Dashboard)
scanSchema.index({ createdAt: -1 });

// 2. For User Dashboard & Historical Lookups
scanSchema.index({ userId: 1, createdAt: -1 });

// 3. Compound index for fast duplicate checks
scanSchema.index({ resumeId: 1, jobId: 1 });

module.exports = mongoose.model('Scan', scanSchema);
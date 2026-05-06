const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  companyName: { type: String, required: true, trim: true },
  jobTitle: { type: String, required: true, trim: true },
  jobDescription: { type: String, required: true },
  extractedKeywords: [{ type: String }],
  jobDescHash: { type: String, index: true }, // for Redis cache key
  status: { type: String, enum: ['active', 'applied', 'rejected', 'offer'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);

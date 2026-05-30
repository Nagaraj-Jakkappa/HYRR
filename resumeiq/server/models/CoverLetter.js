const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  companyName: { 
    type: String, 
    required: true 
  },
  jobTitle: { 
    type: String, 
    required: true 
  },
  jobDescription: { 
    type: String 
  },
  template: { 
    type: String, 
    enum: ['Modern Professional', 'Startup Friendly', 'ATS Formal', 'Fresher / Internship'], 
    default: 'Modern Professional' 
  },
  content: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
}, { timestamps: true });

// Index for fetching user's latest cover letters
coverLetterSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CoverLetter', coverLetterSchema);

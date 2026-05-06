const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'docx'], required: true },
  rawText: { type: String, required: true },
  fileSize: { type: Number },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);

const Resume = require('../models/Resume');
const { cloudinary } = require('../config/cloudinary');
const { extractTextFromBuffer } = require('../utils/textExtractor');
const axios = require('axios');

// NEW: Import the AI rewrite service
const { rewriteTextWithAI } = require('../utils/aiService');

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // The file URL provided by Cloudinary
    const fileUrl = req.file.path;

    // Download file from Cloudinary to extract text
    let rawText = '';
    try {
      const fileResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(fileResponse.data);
      rawText = await extractTextFromBuffer(buffer, req.file.mimetype);
    } catch (e) {
      console.error('Text extraction error:', e.message);
      rawText = 'Text extraction failed - manual review needed';
    }

    // Determine file type
    const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'docx';

    // IMPORTANT: Cloudinary uses 'filename' as the public_id in the multer object
    const cloudId = req.file.filename;

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: cloudId,
      originalName: req.file.originalname,
      fileUrl: fileUrl,
      cloudinaryId: cloudId,
      fileType: fileType,
      rawText: rawText,
      fileSize: req.file.size,
    });

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(req.user._id.toString()).emit('resume:uploaded', {
        resumeId: resume._id,
        name: resume.originalName
      });
    }

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: { resume }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: { resumes, count: resumes.length } });
  } catch (err) {
    next(err);
  }
};

exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, data: { resume } });
  } catch (err) {
    next(err);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    // Delete from Cloudinary - Must specify resource_type: 'raw' for PDFs/Docs
    if (resume.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(resume.cloudinaryId, { resource_type: 'raw' });
      } catch (e) {
        console.warn('Cloudinary delete failed:', e.message);
      }
    }

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resume deleted' });
  } catch (err) {
    next(err);
  }
};

// --- NEW: Magic Rewrite Controller Method ---
exports.magicRewrite = async (req, res) => {
  try {
    const { text, jobTitle } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required for rewriting' });
    }

    const improvedText = await rewriteTextWithAI(text, jobTitle);

    res.status(200).json({
      success: true,
      original: text,
      improved: improvedText
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating magic rewrite', error: error.message });
  }
};
const Resume = require('../models/Resume');
const { cloudinary } = require('../config/cloudinary');
const { extractTextFromBuffer } = require('../utils/textExtractor');
const axios = require('axios');

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    // Download file from Cloudinary to extract text
    const fileUrl = req.file.path;
    const fileResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(fileResponse.data);
    
    let rawText = '';
    try {
      rawText = await extractTextFromBuffer(buffer, req.file.mimetype);
    } catch (e) {
      rawText = 'Text extraction failed - manual review needed';
    }

    const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'docx';

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.filename || req.file.public_id,
      originalName: req.file.originalname,
      fileUrl,
      cloudinaryId: req.file.public_id || req.file.filename,
      fileType,
      rawText,
      fileSize: req.file.size,
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) io.to(req.user._id.toString()).emit('resume:uploaded', { resumeId: resume._id, name: resume.originalName });

    res.status(201).json({ success: true, message: 'Resume uploaded successfully', data: { resume } });
  } catch (err) { next(err); }
};

exports.getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: { resumes, count: resumes.length } });
  } catch (err) { next(err); }
};

exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, data: { resume } });
  } catch (err) { next(err); }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(resume.cloudinaryId, { resource_type: 'raw' });
    } catch (e) { console.warn('Cloudinary delete failed:', e.message); }

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resume deleted' });
  } catch (err) { next(err); }
};

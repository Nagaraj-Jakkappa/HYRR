const Resume = require('../models/Resume');
const resumeService = require('../services/resumeService');
const pdfParse = require('pdf-parse');
const { rewriteTextWithAI, generateCoverLetterWithAI, parseLinkedInResumeWithAI } = require('../utils/aiService');


exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'No file uploaded or missing buffer' });
    }

    // Process extraction and upload via the service (eliminates double-download)
    const { rawText, fileUrl, cloudinaryId } = await resumeService.processAndUploadResume(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'docx';

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: cloudinaryId,
      originalName: req.file.originalname,
      fileUrl: fileUrl,
      cloudinaryId: cloudinaryId,
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
    const signedResumes = resumes.map(r => {
      const signedUrl = resumeService.getSignedUrl(r.cloudinaryId);
      return { ...r.toObject(), fileUrl: signedUrl };
    });
    res.json({ success: true, data: { resumes: signedResumes, count: signedResumes.length } });
  } catch (err) {
    next(err);
  }
};

exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    
    const signedUrl = resumeService.getSignedUrl(resume.cloudinaryId);
    const resumeObj = { ...resume.toObject(), fileUrl: signedUrl };
    res.json({ success: true, data: { resume: resumeObj } });
  } catch (err) {
    next(err);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    await resumeService.deleteFromCloudinary(resume.cloudinaryId);

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resume deleted' });
  } catch (err) {
    next(err);
  }
};

exports.viewResumeFile = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const contentType = resume.fileType === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // Stream the file directly from Cloudinary via the optimized service
    const fileResponse = await resumeService.fetchResumeStream(resume.cloudinaryId, resume.originalName);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${resume.originalName}"`);
    fileResponse.data.pipe(res);
  } catch (err) {
    console.error('[ViewFile] Error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to retrieve file.'
    });
  }
};

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

exports.importLinkedInPDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file transaction payload delivered.' });
    }

    const parsedPdf = await pdfParse(req.file.buffer);
    const rawText = parsedPdf.text;

    if (!rawText || rawText.trim().length < 100) {
      return res.status(400).json({ success: false, message: 'Extracted PDF text data properties are too sparse.' });
    }

    const parsedJson = await parseLinkedInResumeWithAI(rawText);

    return res.status(200).json({
      success: true,
      message: 'LinkedIn extraction parsed successfully.',
      data: parsedJson
    });
  } catch (error) {
    console.error('LinkedIn Parsing Error:', error);
    return res.status(500).json({ success: false, message: 'Extraction engine encountered a parsing layout failure.', error: error.message });
  }
};

exports.generateCoverLetter = async (req, res, next) => {
  try {
    const { resumeData, companyName, jobTitle } = req.body;

    if (!resumeData || !companyName || !jobTitle) {
      return res.status(400).json({ success: false, message: 'Missing generation context arguments.' });
    }

    const coverLetterText = await generateCoverLetterWithAI(resumeData, companyName, jobTitle);

    return res.status(200).json({
      success: true,
      message: 'Cover letter compiled successfully.',
      data: { content: coverLetterText }
    });
  } catch (error) {
    console.error('Cover Letter Generation Error:', error);
    return res.status(500).json({ success: false, message: 'AI generation engine encountered a critical compilation error.', error: error.message });
  }
};
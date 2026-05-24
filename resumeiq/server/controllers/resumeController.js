const Resume = require('../models/Resume');
const { cloudinary } = require('../config/cloudinary');
const { extractTextFromBuffer } = require('../utils/textExtractor');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const { Groq } = require('groq-sdk');

// AI utility services imports
const { rewriteTextWithAI, generateCoverLetterWithAI } = require('../utils/aiService');

// Initialize the Groq SDK client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

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
    // Generate signed URLs for each resume (raw resources require authentication)
    const signedResumes = resumes.map(r => {
      // cloudinaryId stores the public_id; generate a signed URL for raw resource
      const signedUrl = cloudinary.url(r.cloudinaryId, {
        resource_type: 'raw',
        type: 'upload',
        sign_url: true,
        // optional: set short expiration (e.g., 1 hour)
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      });
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
    // Generate signed URL for the specific resume
    const signedUrl = cloudinary.url(resume.cloudinaryId, {
      resource_type: 'raw',
      type: 'upload',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    });
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

// --- Proxy File Viewer (bypasses Cloudinary ACL restrictions) ---
exports.viewResumeFile = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const contentType = resume.fileType === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const rawId = resume.cloudinaryId; // "resumeiq/resumes/...pdf"
    const strippedId = rawId.replace(/\.(pdf|docx|doc)$/i, '');

    const candidates = [
      { id: rawId, rType: 'raw' },
      { id: strippedId, rType: 'raw' },
      { id: rawId, rType: 'image' },
      { id: strippedId, rType: 'image' }
    ];

    let foundAsset = null;

    // 1. Find the exact asset using the Admin API
    for (const candidate of candidates) {
      try {
        console.log(`[ViewFile] Probing asset ${candidate.id} (${candidate.rType})...`);
        const asset = await cloudinary.api.resource(candidate.id, { resource_type: candidate.rType });
        foundAsset = asset;
        console.log(`[ViewFile] Found asset! resource_type: ${asset.resource_type}, access_mode: ${asset.access_mode || 'default'}`);
        break; // Stop once we find it
      } catch (err) {
        // Not found, continue
      }
    }

    if (!foundAsset) {
      return res.status(404).json({
        success: false,
        message: 'Unable to locate file in cloud storage. Please re-upload.',
        debug: { cloudinaryId: rawId, strippedId }
      });
    }

    // 2. Ensure it is publicly accessible
    if (foundAsset.access_mode !== 'public') {
      try {
        console.log(`[ViewFile] Making asset public via explicit()...`);
        const updatedAsset = await cloudinary.uploader.explicit(foundAsset.public_id, {
          type: foundAsset.type,
          resource_type: foundAsset.resource_type,
          access_mode: 'public'
        });
        foundAsset.secure_url = updatedAsset.secure_url;
      } catch (err) {
        console.warn(`[ViewFile] explicit() failed:`, err.message);
      }
    }

    // 3. Fetch the public URL and stream to client
    try {
      console.log(`[ViewFile] Fetching secure_url:`, foundAsset.secure_url);
      const fileResponse = await axios.get(foundAsset.secure_url, { responseType: 'stream' });

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${resume.originalName}"`);
      fileResponse.data.pipe(res);
    } catch (streamErr) {
      // If fetching fails, maybe it requires signed URLs or auth
      console.warn(`[ViewFile] Axios GET failed for secure_url:`, streamErr.message);
      
      // Fallback: Generate a signed URL and try again
      const signedUrl = cloudinary.url(foundAsset.public_id, {
        resource_type: foundAsset.resource_type,
        type: foundAsset.type,
        sign_url: true,
        secure: true
      });
      
      console.log(`[ViewFile] Fetching signed_url:`, signedUrl);
      const signedResponse = await axios.get(signedUrl, { responseType: 'stream' });
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${resume.originalName}"`);
      signedResponse.data.pipe(res);
    }
  } catch (err) {
    console.error('[ViewFile] Fatal error:', err.message);
    res.status(500).json({ success: false, message: 'Unable to retrieve file.' });
  }
};

// --- Magic Rewrite Controller Method ---
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

// --- LinkedIn Document Ingestion Processing Engine ---
exports.importLinkedInPDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file transaction payload delivered.' });
    }

    // Extract raw text layout maps directly out of the memory buffer payload
    const parsedPdf = await pdfParse(req.file.buffer);
    const rawText = parsedPdf.text;

    if (!rawText || rawText.trim().length < 100) {
      return res.status(400).json({ success: false, message: 'Extracted PDF text data properties are too sparse.' });
    }

    // Structural LLM Prompting specifying exact JSON format matching your frontend ResumeData schema
    const prompt = `
      You are an expert resume parsing engine. Analyze the following raw text extracted from a LinkedIn "Save to PDF" profile document.
      Extract the personal metrics, professional summaries, work timelines, and academic instances.
      
      CRITICAL: You must return ONLY a clean JSON object conforming EXACTLY to the structure specified below. Do not add markdown blocks like \`\`\`json, do not write header descriptions or introductory texts.
      
      Target Structure Blueprint:
      {
        "personalInfo": {
          "fullName": "Extract string or fallback to empty string",
          "email": "Extract valid email or empty string",
          "phone": "Extract number or empty string",
          "location": "Extract city/state or empty string",
          "linkedin": "Extract profile url handle or empty string"
        },
        "summary": "Synthesize a professional overview text block based on their headline and summary section",
        "experience": [
          {
            "company": "Company Name",
            "position": "Job Title",
            "startDate": "YYYY-MM or string format",
            "endDate": "YYYY-MM or string format",
            "current": true/false based on timeline details,
            "description": "Construct comprehensive structural summary lines of achievements or metadata"
          }
        ],
        "education": [
          {
            "institution": "School or University Name",
            "degree": "BCA, B.E., etc.",
            "fieldOfStudy": "Computer Applications, etc.",
            "startDate": "Year string",
            "endDate": "Year string"
          }
        ],
        "skills": ["Array", "of", "skill", "strings"]
      }

      Raw LinkedIn Profile Content Stream:
      ${rawText}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1, // Forces structural certainty alignment
      response_format: { type: "json_object" }
    });

    const parsedJson = JSON.parse(chatCompletion.choices[0].message.content);

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

// --- NEW: AI Cover Letter Ingestion Generator Suite ---
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
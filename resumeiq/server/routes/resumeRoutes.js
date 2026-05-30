const express = require('express');
const router = express.Router();
const multer = require('multer');
const validate = require('../middleware/validate');
const { magicRewriteSchema, generateCoverLetterSchema } = require('../validators/zodSchemas');

// Destructure all controllers safely from your controller profile definitions
const {
    uploadResume,
    getMyResumes,
    getResume,
    deleteResume,
    viewResumeFile,
    magicRewrite,
    importLinkedInPDF,
    generateCoverLetter // --- NEW: Connected Feature 5 Entrypoint ---
} = require('../controllers/resumeController');

const { protect } = require('../middleware/auth');
const { requirePlan, checkTokenBudget } = require('../middleware/planGate');
const { upload } = require('../config/cloudinary');

// Dedicated in-memory storage handler for processing LinkedIn PDFs securely
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit prevents RAM exhaustion DoS
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF files are allowed.'), false);
    }
  }
});

// Centralized Multer error handler to prevent HTML crash responses
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File is too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ success: false, message: err.field || 'Invalid file type. Only PDF files are allowed.' });
    }
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(500).json({ success: false, message: 'An unknown error occurred during upload.' });
  }
  next();
};

// Protect all downstream endpoints globally with your authentication middleware
router.use(protect);

// --- Core Media & Document Upload Endpoints ---
router.post('/', upload.single('resume'), uploadResume);
router.get('/', getMyResumes);

// --- LinkedIn Automation Data Parser Ingestion (Pro+ only) ---
router.post(
  '/import-linkedin',
  requirePlan('pro', 'career+'),
  (req, res, next) => {
    memoryUpload.single('file')(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  importLinkedInPDF
);

// --- AI Magic Rewrite Sandbox Pipeline ---
router.post('/rewrite', checkTokenBudget, validate(magicRewriteSchema), magicRewrite);

// --- AI Cover Letter Generator (Pro+ only) ---
router.post('/cover-letter', requirePlan('pro', 'career+'), checkTokenBudget, validate(generateCoverLetterSchema), generateCoverLetter);

// --- Proxy File Viewer (streams from Cloudinary through server) ---
router.get('/:id/view', viewResumeFile);

// --- Dynamic Database ID Resource Controllers ---
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

module.exports = router;
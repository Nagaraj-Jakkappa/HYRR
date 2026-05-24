const express = require('express');
const router = express.Router();
const multer = require('multer');

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
const { requirePlan } = require('../middleware/planGate');
const { upload } = require('../config/cloudinary');

// Dedicated in-memory storage handler for processing LinkedIn PDFs without clogging temp disks
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ storage: memoryStorage });

// Protect all downstream endpoints globally with your authentication middleware
router.use(protect);

// --- Core Media & Document Upload Endpoints ---
router.post('/', upload.single('resume'), uploadResume);
router.get('/', getMyResumes);

// --- LinkedIn Automation Data Parser Ingestion (Pro+ only) ---
router.post('/import-linkedin', requirePlan('pro', 'career+'), memoryUpload.single('file'), importLinkedInPDF);

// --- AI Magic Rewrite Sandbox Pipeline ---
router.post('/rewrite', magicRewrite);

// --- AI Cover Letter Generator (Pro+ only) ---
router.post('/cover-letter', requirePlan('pro', 'career+'), generateCoverLetter);

// --- Proxy File Viewer (streams from Cloudinary through server) ---
router.get('/:id/view', viewResumeFile);

// --- Dynamic Database ID Resource Controllers ---
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

module.exports = router;
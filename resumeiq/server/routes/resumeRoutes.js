const express = require('express');
const router = express.Router();
const multer = require('multer');

// Destructure all controllers safely from your controller profile definitions
const {
    uploadResume,
    getMyResumes,
    getResume,
    deleteResume,
    magicRewrite,
    importLinkedInPDF,
    generateCoverLetter // --- NEW: Connected Feature 5 Entrypoint ---
} = require('../controllers/resumeController');

const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Dedicated in-memory storage handler for processing LinkedIn PDFs without clogging temp disks
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ storage: memoryStorage });

// Protect all downstream endpoints globally with your authentication middleware
router.use(protect);

// --- Core Media & Document Upload Endpoints ---
router.post('/', upload.single('resume'), uploadResume);
router.get('/', getMyResumes);

// --- LinkedIn Automation Data Parser Ingestion ---
router.post('/import-linkedin', memoryUpload.single('file'), importLinkedInPDF);

// --- AI Magic Rewrite Sandbox Pipeline ---
router.post('/rewrite', magicRewrite);

// --- NEW: AI Cover Letter Ingestion Generator Route ---
router.post('/cover-letter', generateCoverLetter);

// --- Dynamic Database ID Resource Controllers ---
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

module.exports = router;
const express = require('express');
const router = express.Router();

// NEW: Added magicRewrite to the destructured imports
const {
    uploadResume,
    getMyResumes,
    getResume,
    deleteResume,
    magicRewrite
} = require('../controllers/resumeController');

const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Protect all resume routes with your auth middleware
router.use(protect);

// Existing routes
router.post('/', upload.single('resume'), uploadResume);
router.get('/', getMyResumes);

// --- NEW: Magic Rewrite Route ---
// (Placed before /:id to prevent routing conflicts)
router.post('/rewrite', magicRewrite);

// Existing dynamic ID routes
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

module.exports = router;
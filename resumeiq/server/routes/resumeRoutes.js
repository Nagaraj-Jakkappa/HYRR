const express = require('express');
const router = express.Router();
const { uploadResume, getMyResumes, getResume, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.use(protect);
router.post('/', upload.single('resume'), uploadResume);
router.get('/', getMyResumes);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

module.exports = router;

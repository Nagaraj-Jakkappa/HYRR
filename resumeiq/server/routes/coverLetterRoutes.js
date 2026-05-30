const express = require('express');
const router = express.Router();
const coverLetterController = require('../controllers/coverLetterController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { requirePlan, checkTokenBudget } = require('../middleware/planGate');
const { generateCoverLetterSchema, saveCoverLetterSchema, updateCoverLetterSchema } = require('../validators/zodSchemas');

// Require authentication for all cover letter routes
router.use(protect);

// Generate stream (uses AI) - Apply token budget checking here
router.post('/generate', checkTokenBudget, validate(generateCoverLetterSchema), coverLetterController.generate);

// Save generated letter
router.post('/', validate(saveCoverLetterSchema), coverLetterController.save);

// CRUD operations
router.get('/', coverLetterController.getAll);
router.get('/:id', coverLetterController.getOne);
router.patch('/:id', validate(updateCoverLetterSchema), coverLetterController.update);
router.delete('/:id', coverLetterController.remove);

module.exports = router;

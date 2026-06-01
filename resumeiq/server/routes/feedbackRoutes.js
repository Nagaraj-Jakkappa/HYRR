const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect, admin, optionalAuth } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { createFeedbackSchema, updateFeedbackStatusSchema } = require('../validators/zodSchemas');
const { feedbackLimiter } = require('../middleware/rateLimiter');

// Public route (with optional auth for attaching user context)
router.post('/', optionalAuth, feedbackLimiter, validateRequest(createFeedbackSchema), feedbackController.createFeedback);

// Protected routes for normal users
router.get('/my', protect, feedbackController.getMyFeedback);

// Admin-only routes
router.use('/admin', protect, admin);
router.get('/admin', feedbackController.getAllFeedback);
router.patch('/admin/:id/status', validateRequest(updateFeedbackStatusSchema), feedbackController.updateFeedbackStatus);

module.exports = router;

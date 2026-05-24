const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { protect } = require('../middleware/auth');
const { requirePlan } = require('../middleware/planGate');
const { scanLimiter } = require('../middleware/rateLimiter');

/**
 * PUBLIC ROUTES
 * Must be defined before the auth middleware
 */
// @route   GET /api/scans/report/:id
// @desc    Get a public read-only scan report
// @access  Public
router.get('/report/:id', scanController.getPublicReport);

/**
 * PROTECTED ROUTES
 * All routes below this line require authentication
 */
router.use(protect);

/**
 * @route   POST /api/scans
 * @desc    Start a new AI resume scan
 * @access  Private
 */
router.post('/', scanLimiter, scanController.createScan);

/**
 * @route   GET /api/scans
 * @desc    Get all scans for the logged-in user (paginated)
 * @access  Private
 */
router.get('/', scanController.getMyScans);

/**
 * @route   GET /api/scans/stats/dashboard
 * @desc    Get aggregated ATS stats and recent scan history
 * @access  Private
 */
router.get('/stats/dashboard', scanController.getDashboardStats);

/**
 * @route   GET /api/scans/:id
 * @desc    Get detailed results for a specific scan
 * @access  Private
 */
router.get('/:id', scanController.getScan);

/**
 * @route   POST /api/scans/:id/download
 * @desc    Generate and download an AI-optimized PDF or DOCX resume
 * @access  Private
 */
router.post('/:id/download', requirePlan('pro', 'career+'), scanController.downloadResume);

module.exports = router;
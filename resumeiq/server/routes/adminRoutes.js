const express = require('express');
const router = express.Router();

// Import all functions from the admin controller
const {
    getAdminStats,
    getAllUsers,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getAllScans,
    getSettings,
    updateSettings,
    updateUserPlan
} = require('../controllers/adminController');

// Import authentication middleware
const { protect, admin } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

/**
 * Admin Access Control
 * The following middleware ensures:
 * 1. The user is logged in (protect)
 * 2. The user has the 'admin' role (admin)
 */
router.use(protect, admin, adminLimiter);

/**
 * Dashboard Routes
 */
// Fetch aggregated stats for charts and cards
router.get('/stats', getAdminStats);

/**
 * User Management Routes
 */
// List users with search and pagination
router.get('/users', getAllUsers);

// Update specific user details (Role/Plan)
router.patch('/users/:id/role', updateUserRole);

// @route   PATCH /api/admin/users/:id/plan
// @desc    Update user plan and limits
router.patch('/users/:id/plan', updateUserPlan);

// Ban or Unban a user (Toggles isActive status)
router.put('/users/:id/status', toggleUserStatus);

// Delete a user permanently
router.delete('/users/:id', deleteUser);

/**
 * Scans Management Routes
 */
// Get all scans globally
router.get('/scans', getAllScans);

/**
 * Settings Routes
 */
router.get('/platform-config', getSettings);
router.put('/platform-config', updateSettings);

module.exports = router;
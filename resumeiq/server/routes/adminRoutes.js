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
    updateSettings
} = require('../controllers/adminController');

// Import authentication middleware
// Using 'auth' to match your actual filename: server/middleware/auth.js
const { protect, admin } = require('../middleware/auth');

/**
 * Admin Access Control
 * The following middleware ensures:
 * 1. The user is logged in (protect)
 * 2. The user has the 'admin' role (admin)
 */
router.use(protect, admin);

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
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
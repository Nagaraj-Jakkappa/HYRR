const express = require('express');
const router = express.Router();
const {
    register,
    login,
    refreshToken,
    logout,
    getMe,
    changePassword,
    updateProfile,
    deleteAccount,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');

/**
 * Public Routes
 * authLimiter is applied to prevent brute-force attacks on sensitive entry points.
 */
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', authLimiter, resetPassword);

/**
 * Token Management
 * apiLimiter prevents spamming refresh calls if the frontend enters a loop.
 */
router.post('/refresh', apiLimiter, refreshToken);

/**
 * Protected Routes
 * All routes below require a valid Access Token via the 'protect' middleware.
 */
router.post('/logout', protect, logout);

// User profile route
router.get('/me', protect, getMe);

// New Feature 1: Change Password endpoint
router.post('/change-password', protect, changePassword);

// New Feature 2: Update Profile
router.put('/profile', protect, updateProfile);

// New Feature 3: Delete Account
router.delete('/account', protect, deleteAccount);

module.exports = router;
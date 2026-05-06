const rateLimit = require('express-rate-limit');

// Increased limits for development on Hyrr
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Increased from 10 to 100
  message: { success: false, message: 'Too many login attempts, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Reduced window to 15 mins for easier testing
  max: 100, // Increased from 20 to 100 scans
  message: { success: false, message: 'Scan limit reached. Please wait a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Increased from 200 to 500
  message: { success: false, message: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});
const rateLimit = require('express-rate-limit');

// Strict limits for production security
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // Max 10 failed login/auth attempts
  message: { success: false, message: 'Too many login attempts, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // Max 10 scans per 15 minutes to prevent AI abuse
  message: { success: false, message: 'Scan limit reached. Please wait a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // General API endpoints
  message: { success: false, message: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});
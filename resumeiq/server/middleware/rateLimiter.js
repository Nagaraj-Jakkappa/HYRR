const rateLimit = require('express-rate-limit');

// Strict limits for production security
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: "Too many authentication attempts. Please try again later.",
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

exports.adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 50, // Strict limit for admin dashboard to prevent brute force scraping
  message: { success: false, message: 'Too many admin requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'You have submitted too much feedback. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
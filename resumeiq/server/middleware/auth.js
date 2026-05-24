const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * PROTECT: Verifies JWT token and attaches user to request
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check for token in headers
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 1b. Fallback: check query string (used for new-tab file viewing)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user and exclude sensitive fields
    // Updated to match your model: -passwordHash -refreshToken
    const user = await User.findById(decoded.id).select('-passwordHash -refreshToken');

    // 4. Security check: Ensure user exists and is ACTIVE
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * ADMIN: Standalone check for admin role
 * Required by adminRoutes.js: router.use(protect, admin);
 */
exports.admin = (req, res, next) => {
  // We check req.user because 'protect' middleware runs first and attaches it
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator permissions required'
    });
  }
};

/**
 * RESTRICT TO: Flexible role-based access for multiple roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions'
      });
    }
    next();
  };
};
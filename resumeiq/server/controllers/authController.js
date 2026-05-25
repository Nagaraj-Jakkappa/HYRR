const crypto = require('crypto');
const User = require('../models/User');
const Scan = require('../models/Scan');
const Resume = require('../models/Resume');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/tokenUtils');
const { getScansLimitForPlan } = require('../middleware/planGate');

/**
 * Account Registration
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Creating user instance initializes the schema pre-save hook perfectly exactly once
    const plan = 'free';
    const scansLimit = getScansLimitForPlan(plan);
    const user = await User.create({ name, email: email.trim().toLowerCase(), passwordHash: password, plan, scansLimit });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const lastLogin = new Date();

    // Save telemetry modifications securely via atomic operators instead of document instance loops
    await User.updateOne(
      { _id: user._id },
      { $set: { refreshToken, lastLogin } }
    );

    // Hydrate the instantiated document properties for client response payload
    user.refreshToken = refreshToken;
    user.lastLogin = lastLogin;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * User Login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Explicitly query case-insensitive email parameters matching database schema rules
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const lastLogin = new Date();

    // Use atomic operation updates to preserve string hash formatting inside database documents
    await User.updateOne(
      { _id: user._id },
      { $set: { refreshToken, lastLogin } }
    );

    user.refreshToken = refreshToken;
    user.lastLogin = lastLogin;

    res.json({
      success: true,
      data: { user, accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Token Refresh Logic
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    await User.updateOne(
      { _id: user._id },
      { $set: { refreshToken: newRefreshToken } }
    );

    res.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken }
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ success: false, message: 'Refresh token expired, please login again' });
    }
    next(err);
  }
};

/**
 * Change Password
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    // Assigning raw text to passwordHash targets the pre-save hook exactly once
    user.passwordHash = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Current User Profile
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -refreshToken');
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * User Logout
 */
exports.logout = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      { $set: { refreshToken: null } }
    );
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Update User Profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) {
      user.name = name;
    }

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', data: { user } });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete User Account (Self-Service)
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete associated data
    await Scan.deleteMany({ userId: user._id });
    await Resume.deleteMany({ userId: user._id });
    
    // Delete the user
    await User.findByIdAndDelete(user._id);

    res.json({ success: true, message: 'Account deleted permanently' });
  } catch (err) {
    next(err);
  }
};

/**
 * Forgot Password (Request Reset Link)
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      // Return 200 even if user not found to prevent email enumeration attacks
      return res.status(200).json({ success: true, message: 'If an account exists, an email was sent' });
    }

    // Generate token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Mock sending email
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    // In production, use SendGrid/Nodemailer here instead of console.log
    console.log(`\n\n=== MOCK EMAIL ===\nTo: ${user.email}\nSubject: Password Reset Request\nReset Link: ${resetUrl}\n==================\n\n`);

    res.status(200).json({ success: true, message: 'If an account exists, an email was sent' });
  } catch (err) {
    next(err);
  }
};

/**
 * Reset Password (Validate Token & Set New Password)
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Hash the incoming token to match it in DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Set new password (triggers pre-save hook)
    user.passwordHash = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (err) {
    next(err);
  }
};
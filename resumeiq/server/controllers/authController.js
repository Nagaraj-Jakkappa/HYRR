const User = require('../models/User');
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
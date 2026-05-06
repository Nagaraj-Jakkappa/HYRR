const User = require('../models/User');
const Scan = require('../models/Scan');
const Resume = require('../models/Resume');

/**
 * 1. GET ADMIN STATS
 * Focused on 7-day Scan Activity and Score Distribution
 */
exports.getAdminStats = async (req, res, next) => {
  try {
    const last7Days = new Date(Date.now() - 7 * 86400000);
    const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      scanActivity,
      topKeywords,
      scoreDistribution,
      userPerformance,
      totalUsers,
      totalScans
    ] = await Promise.all([

      // A. Scan Volume & Avg Score (Last 7 days)
      Scan.aggregate([
        {
          $match: {
            createdAt: { $gte: last7Days },
            status: 'done'
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            scans: { $sum: 1 },
            avgScore: { $avg: "$atsScore" }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // B. Top 10 most-missed keywords (Last 30 days)
      Scan.aggregate([
        { $match: { status: 'done', createdAt: { $gte: last30 } } },
        { $unwind: '$missingKeywords' },
        { $group: { _id: '$missingKeywords', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // C. ATS Score Distribution
      Scan.aggregate([
        { $match: { status: 'done' } },
        {
          $bucket: {
            groupBy: '$atsScore',
            boundaries: [0, 20, 40, 60, 80, 100],
            default: 100,
            output: { count: { $sum: 1 } }
          }
        }
      ]),

      // D. User Scan Stats (Top 5 active users)
      Scan.aggregate([
        { $match: { status: 'done' } },
        {
          $group: {
            _id: '$userId',
            totalScans: { $sum: 1 },
            bestScore: { $max: '$atsScore' },
            avgScore: { $avg: '$atsScore' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        { $unwind: '$userInfo' },
        {
          $project: {
            _id: 1,
            totalScans: 1,
            bestScore: 1,
            avgScore: { $round: ["$avgScore", 1] },
            userName: '$userInfo.name',
            userEmail: '$userInfo.email'
          }
        },
        { $sort: { totalScans: -1 } },
        { $limit: 5 }
      ]),

      User.countDocuments(),
      Scan.countDocuments({ status: 'done' }),
    ]);

    res.json({
      success: true,
      data: {
        chartData: scanActivity,
        topKeywords,
        scoreDistribution,
        userPerformance,
        totalUsers,
        totalScans
      }
    });
  } catch (err) { next(err); }
};

/**
 * 2. GET ALL USERS (Pagination & Search)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search ? {
      $or: [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]
    } : {};

    const users = await User.find(query)
      .select('-passwordHash -refreshToken') // Corrected to match your User model's passwordHash
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        total,
        page: +page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) { next(err); }
};

/**
 * 3. UPDATE USER ROLE
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role, plan } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, plan },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: { user } });
  } catch (err) { next(err); }
};

/**
 * 4. TOGGLE USER STATUS (Ban/Unban)
 * This was missing and likely causing your server crash.
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Toggle the active status
    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: user.isActive }
    });
  } catch (err) { next(err); }
};
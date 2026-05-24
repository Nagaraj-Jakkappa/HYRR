const cron = require('node-cron');
const User = require('../models/User');
const Scan = require('../models/Scan');
const { sendWeeklyReport } = require('./emailService');

const startCronJobs = () => {
  // Every Monday 9AM - weekly report
  cron.schedule('0 9 * * 1', async () => {
    console.log('📧 Sending weekly reports...');
    try {
      const users = await User.find({ isActive: true });
      for (const user of users) {
        const stats = await Scan.aggregate([
          { $match: { userId: user._id, status: 'done', createdAt: { $gte: new Date(Date.now() - 7 * 86400000) } } },
          { $group: { _id: null, bestScore: { $max: '$atsScore' }, totalScans: { $sum: 1 }, allMissing: { $push: '$missingKeywords' } } }
        ]);
        if (stats[0]?.totalScans > 0) {
          const flat = (stats[0].allMissing || []).flat();
          const freq = {};
          flat.forEach(k => { freq[k] = (freq[k] || 0) + 1; });
          const topMissingKeyword = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
          await sendWeeklyReport(user.email, user.name, { bestScore: stats[0].bestScore, totalScans: stats[0].totalScans, topMissingKeyword });
        }
      }
    } catch (err) { console.error('Cron error:', err.message); }
  });

  // Daily cleanup of failed scans older than 7 days
  cron.schedule('0 2 * * *', async () => {
    const cutoff = new Date(Date.now() - 7 * 86400000);
    await Scan.deleteMany({ status: 'failed', createdAt: { $lt: cutoff } });
    console.log('🧹 Cleaned up old failed scans');
  });

  // Monthly scan quota reset — 1st of every month at midnight
  cron.schedule('0 0 1 * *', async () => {
    console.log('🔄 Resetting monthly scan quotas for all users...');
    try {
      const result = await User.updateMany({}, { $set: { scansUsed: 0 } });
      console.log(`✅ Monthly scan reset complete: ${result.modifiedCount} users updated`);
    } catch (err) {
      console.error('❌ Monthly scan reset failed:', err.message);
    }
  });

  console.log('⏰ Cron jobs started');
};

module.exports = startCronJobs;

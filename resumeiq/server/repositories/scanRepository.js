const Scan = require('../models/Scan');

class ScanRepository {
  async createScan(data) {
    return await Scan.create(data);
  }

  async findScanByResumeAndJob(resumeId, jobId) {
    return await Scan.findOne({ resumeId, jobId });
  }

  async findScansByUserIdWithPagination(userId, skip, limit) {
    return await Scan.find({ userId })
      .populate('resumeId', 'fileName originalName fileType')
      .populate('jobId', 'companyName jobTitle')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countScansByUserId(userId) {
    return await Scan.countDocuments({ userId });
  }

  async findScanByIdAndUserId(id, userId) {
    return await Scan.findOne({ _id: id, userId })
      .populate('resumeId')
      .populate('jobId');
  }

  async findPublicScanById(id) {
    return await Scan.findById(id)
      .populate('jobId', 'companyName jobTitle')
      .populate('resumeId', 'originalName');
  }

  async findDetailedScanByIdAndUserId(id, userId) {
    return await Scan.findOne({ _id: id, userId })
      .populate('resumeId', 'originalName fileType fileUrl')
      .populate('jobId', 'companyName jobTitle jobDescription extractedKeywords');
  }

  async getRecentScansWithScores(userId, limit = 5) {
    return await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('atsScore createdAt');
  }

  async findRecentScans(userId, limit = 5) {
    return await Scan.find({ userId, status: 'done' })
      .populate('resumeId', 'originalName')
      .populate('jobId', 'companyName jobTitle')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async aggregateUserStats(userId) {
    return await Scan.aggregate([
      { $match: { userId, status: 'done' } },
      {
        $group: {
          _id: null,
          avgATS: { $avg: '$atsScore' },
          bestScore: { $max: '$atsScore' },
          totalScans: { $sum: 1 },
          allMissingKeywords: { $push: '$missingKeywords' },
        }
      }
    ]);
  }

  async aggregateGlobalStats() {
    return await Scan.aggregate([
      { $match: { status: 'done' } },
      {
        $group: {
          _id: null,
          avgATS: { $avg: '$atsScore' }
        }
      }
    ]);
  }

  async updateScanStatus(id, updateData) {
    return await Scan.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = new ScanRepository();

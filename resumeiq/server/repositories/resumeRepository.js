const Resume = require('../models/Resume');

class ResumeRepository {
  async createResume(data) {
    return await Resume.create(data);
  }

  async findResumesByUserId(userId, sort = { createdAt: -1 }) {
    return await Resume.find({ userId, isActive: true }).sort(sort);
  }

  async findRecentResumes(userId, limit = 4) {
    return await Resume.find({ userId })
      .select('originalName fileType createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findResumeByIdAndUserId(id, userId) {
    return await Resume.findOne({ _id: id, userId });
  }

  async findResumeById(id) {
    return await Resume.findById(id);
  }

  async softDeleteResume(id, userId) {
    return await Resume.findOneAndUpdate(
      { _id: id, userId },
      { isActive: false },
      { new: true }
    );
  }
}

module.exports = new ResumeRepository();

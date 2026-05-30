const CoverLetter = require('../models/CoverLetter');

class CoverLetterRepository {
  async create(data) {
    const coverLetter = new CoverLetter(data);
    return await coverLetter.save();
  }

  async findByUserId(userId) {
    return await CoverLetter.find({ userId, isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');
  }

  async findByIdAndUser(id, userId) {
    return await CoverLetter.findOne({ _id: id, userId, isActive: true }).select('-__v');
  }

  async updateByIdAndUser(id, userId, updateData) {
    return await CoverLetter.findOneAndUpdate(
      { _id: id, userId, isActive: true },
      { $set: updateData },
      { new: true }
    ).select('-__v');
  }

  async deleteByIdAndUser(id, userId) {
    return await CoverLetter.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isActive: false } },
      { new: true }
    );
  }
}

module.exports = new CoverLetterRepository();

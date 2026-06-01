const Feedback = require('../models/Feedback');

class FeedbackRepository {
  async create(data) {
    return await Feedback.create(data);
  }

  async findAll({ page = 1, limit = 20, status } = {}) {
    const query = status ? { status } : {};
    
    const feedbackList = await Feedback.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Feedback.countDocuments(query);
    
    return {
      feedback: feedbackList,
      total,
      page: +page,
      pages: Math.ceil(total / limit)
    };
  }

  async findByUserId(userId) {
    return await Feedback.find({ userId })
      .sort({ createdAt: -1 });
  }

  async updateStatus(id, status) {
    return await Feedback.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');
  }
}

module.exports = new FeedbackRepository();

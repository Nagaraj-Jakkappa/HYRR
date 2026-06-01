const feedbackRepository = require('../repositories/feedbackRepository');

exports.createFeedback = async (req, res, next) => {
  try {
    const data = { ...req.body };
    
    // Attach user data if logged in
    if (req.user) {
      data.userId = req.user._id;
      if (!data.email) data.email = req.user.email;
    }
    
    const feedback = await feedbackRepository.create(data);
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyFeedback = async (req, res, next) => {
  try {
    const feedbackList = await feedbackRepository.findByUserId(req.user._id);
    
    res.status(200).json({
      success: true,
      data: feedbackList
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllFeedback = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const result = await feedbackRepository.findAll({ page, limit, status });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

exports.updateFeedbackStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const feedback = await feedbackRepository.updateStatus(id, status);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Feedback status updated',
      data: feedback
    });
  } catch (err) {
    next(err);
  }
};

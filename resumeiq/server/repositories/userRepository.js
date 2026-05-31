const User = require('../models/User');

class UserRepository {
  async incrementScansUsed(userId) {
    return await User.findByIdAndUpdate(userId, { $inc: { scansUsed: 1 } });
  }

  async incrementTokensUsed(userId, tokensCount) {
    return await User.findByIdAndUpdate(userId, { $inc: { tokensUsed: tokensCount } });
  }

  async findById(userId) {
    return await User.findById(userId);
  }
}

module.exports = new UserRepository();

const User = require('../models/User');

class UserRepository {
  async incrementScansUsed(userId) {
    return await User.findByIdAndUpdate(userId, { $inc: { scansUsed: 1 } });
  }
}

module.exports = new UserRepository();

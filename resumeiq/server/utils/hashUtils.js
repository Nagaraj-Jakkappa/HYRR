const crypto = require('crypto');

exports.hashString = (str) =>
  crypto.createHash('sha256').update(str.trim().toLowerCase()).digest('hex').slice(0, 16);

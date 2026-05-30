const Job = require('../models/Job');

class JobRepository {
  async createJob(data) {
    return await Job.create(data);
  }

  async findJobByHashAndUser(hash, userId) {
    return await Job.findOne({ jobDescHash: hash, userId });
  }

  async findJobById(id) {
    return await Job.findById(id);
  }

  async updateJobKeywords(id, keywords) {
    return await Job.findByIdAndUpdate(id, { extractedKeywords: keywords });
  }
}

module.exports = new JobRepository();

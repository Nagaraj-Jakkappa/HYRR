const coverLetterRepository = require('../repositories/coverLetterRepository');
const { generateCoverLetterWithAI } = require('../utils/aiService');

class CoverLetterService {
  /**
   * Generates a new cover letter stream
   * Returns a readable stream to be piped to the response
   */
  async generateStream(payload) {
    const { resumeData, companyName, jobTitle, template, jobDescription } = payload;
    return await generateCoverLetterWithAI(resumeData, companyName, jobTitle, template, jobDescription);
  }

  /**
   * Saves a finalized cover letter to the database
   */
  async saveCoverLetter(userId, payload) {
    const { companyName, jobTitle, jobDescription, template, content } = payload;
    return await coverLetterRepository.create({
      userId,
      companyName,
      jobTitle,
      jobDescription,
      template: template || 'Modern Professional',
      content
    });
  }

  async getUserCoverLetters(userId) {
    return await coverLetterRepository.findByUserId(userId);
  }

  async getCoverLetter(id, userId) {
    const coverLetter = await coverLetterRepository.findByIdAndUser(id, userId);
    if (!coverLetter) {
      const error = new Error('Cover letter not found.');
      error.statusCode = 404;
      throw error;
    }
    return coverLetter;
  }

  async updateCoverLetter(id, userId, updateData) {
    const coverLetter = await coverLetterRepository.updateByIdAndUser(id, userId, updateData);
    if (!coverLetter) {
      const error = new Error('Cover letter not found.');
      error.statusCode = 404;
      throw error;
    }
    return coverLetter;
  }

  async deleteCoverLetter(id, userId) {
    const coverLetter = await coverLetterRepository.deleteByIdAndUser(id, userId);
    if (!coverLetter) {
      const error = new Error('Cover letter not found.');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Cover letter deleted successfully.' };
  }
}

module.exports = new CoverLetterService();

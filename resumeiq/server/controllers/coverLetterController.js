const coverLetterService = require('../services/coverLetterService');

exports.generate = async (req, res, next) => {
  try {
    const stream = await coverLetterService.generateStream(req.body);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    return res.end();
  } catch (error) {
    console.error('Cover Letter Generate Error:', error);
    res.status(500).json({ success: false, error: 'Unable to generate cover letter.' });
  }
};

exports.save = async (req, res, next) => {
  try {
    const coverLetter = await coverLetterService.saveCoverLetter(req.user._id, req.body);
    res.status(201).json({ success: true, data: coverLetter });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const coverLetters = await coverLetterService.getUserCoverLetters(req.user._id);
    res.status(200).json({ success: true, data: coverLetters });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const coverLetter = await coverLetterService.getCoverLetter(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: coverLetter });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const coverLetter = await coverLetterService.updateCoverLetter(req.params.id, req.user._id, req.body);
    res.status(200).json({ success: true, data: coverLetter });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await coverLetterService.deleteCoverLetter(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Cover letter deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');

exports.extractTextFromBuffer = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (mimetype.includes('wordprocessingml') || mimetype === 'application/msword') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error('Unsupported file type');
};

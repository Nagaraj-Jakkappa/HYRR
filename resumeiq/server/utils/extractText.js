const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const axios = require("axios");

/**
 * Download file from URL and extract plain text.
 * Supports PDF and DOCX.
 */
const extractTextFromUrl = async (fileUrl, mimetype) => {
  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);

  if (mimetype === "application/pdf" || fileUrl.endsWith(".pdf")) {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (fileUrl.endsWith(".docx") || mimetype?.includes("wordprocessingml")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type for text extraction");
};

module.exports = { extractTextFromUrl };

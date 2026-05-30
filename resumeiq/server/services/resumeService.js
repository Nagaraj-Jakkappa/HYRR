const { cloudinary } = require('../config/cloudinary');
const { extractTextFromBuffer } = require('../utils/textExtractor');
const axios = require('axios');
const stream = require('stream');

/**
 * Uploads a buffer directly to Cloudinary using upload_stream.
 */
const uploadBufferToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const extension = originalName.split('.').pop();
    const publicId = `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'resumeiq/resumes',
        resource_type: 'raw', // Critical for PDF/DOCX to prevent Cloudinary from treating them as images
        public_id: publicId,
        format: extension,
        access_mode: 'public', // Make files publicly accessible (bypasses "Restrict unsigned raw" ACL)
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    // Create a read stream from the buffer and pipe it to Cloudinary
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  });
};

/**
 * Handles the extraction of text and subsequent upload to Cloudinary.
 * Eliminates the need to download the file from Cloudinary after uploading.
 */
exports.processAndUploadResume = async (fileBuffer, mimetype, originalName) => {
  // 1. Extract text directly from memory buffer
  let rawText = '';
  try {
    rawText = await extractTextFromBuffer(fileBuffer, mimetype);
  } catch (e) {
    console.error('Text extraction error:', e.message);
    rawText = 'Text extraction failed - manual review needed';
  }

  // 2. Upload to Cloudinary via stream
  const cloudResult = await uploadBufferToCloudinary(fileBuffer, originalName);

  return {
    rawText,
    fileUrl: cloudResult.secure_url,
    cloudinaryId: cloudResult.public_id,
  };
};

/**
 * Generates a signed URL for a raw asset.
 */
exports.getSignedUrl = (cloudinaryId) => {
  return cloudinary.url(cloudinaryId, {
    resource_type: 'raw',
    type: 'upload',
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
  });
};

/**
 * Deletes a raw resource from Cloudinary.
 */
exports.deleteFromCloudinary = async (cloudinaryId) => {
  if (cloudinaryId) {
    try {
      await cloudinary.uploader.destroy(cloudinaryId, { resource_type: 'raw' });
    } catch (e) {
      console.warn('Cloudinary delete failed:', e.message);
    }
  }
};

/**
 * Fetches a raw file securely, returning a stream to pipe to the client.
 * Highly optimized to avoid rate-limiting Cloudinary Admin APIs.
 */
exports.fetchResumeStream = async (cloudinaryId, originalName) => {
  // Since we upload with access_mode: 'public' and resource_type: 'raw',
  // we can use the private_download_url directly.
  
  const apiDownloadUrl = cloudinary.utils.private_download_url(
    cloudinaryId,
    '',
    {
      resource_type: 'raw',
      type: 'upload'
    }
  );
  
  console.log(`[ResumeService] Fetching secure download stream from:`, apiDownloadUrl);
  return axios.get(apiDownloadUrl, { responseType: 'stream' });
};

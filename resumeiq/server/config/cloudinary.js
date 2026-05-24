const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine file extension to keep the original format
    const extension = file.originalname.split('.').pop();

    return {
      folder: 'resumeiq/resumes',
      resource_type: 'raw', // Critical for PDF/DOCX to prevent Cloudinary from treating them as images
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`, // Unique filename
      format: extension,
      access_mode: 'public', // Make files publicly accessible (bypasses "Restrict unsigned raw" ACL)
    };
  },
});

// Configure Multer Middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword' // .doc
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'), false);
    }
  },
});

module.exports = { cloudinary, upload };
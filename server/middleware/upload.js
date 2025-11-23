// upload.js - Enhanced file upload middleware (CommonJS version)

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine with better file organization
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `post-${uniqueSuffix}${extension}`;
    cb(null, filename);
  },
});

// Check file type with more comprehensive validation
function checkFileType(file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const allowedMimetypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  // Check extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check mimetype
  const mimetype = allowedMimetypes.includes(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed!'));
  }
}

// File size limit: 5MB
const maxSize = 5 * 1024 * 1024;

// Initialize upload with better error handling
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: maxSize,
    files: 1 // Only one file per upload
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Error handling middleware for multer
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 5MB.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Only one file allowed per upload.',
      });
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next();
};

module.exports = { upload, handleUploadErrors };
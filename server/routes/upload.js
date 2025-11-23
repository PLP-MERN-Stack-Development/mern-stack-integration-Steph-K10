// upload.js - Enhanced file upload routes (CommonJS version)

const express = require('express');
const { upload, handleUploadErrors } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const Post = require('../models/Post');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Upload image
router.post('/', 
  protect, 
  authorize('admin'),
  upload.single('image'),
  handleUploadErrors,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Please select an image file to upload',
        });
      }

      res.json({
        success: true,
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: `/uploads/${req.file.filename}`,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload image',
      });
    }
  }
);

// Delete uploaded image
router.delete('/:filename',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join('uploads', filename);

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({
          success: false,
          error: 'File not found',
        });
      }

      // Check if any post is using this image
      const postUsingImage = await Post.findOne({ featuredImage: filename });
      if (postUsingImage) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete image. It is being used by a post.',
        });
      }

      // Delete the file
      await fs.unlink(filePath);

      res.json({
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error) {
      console.error('Delete image error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete image',
      });
    }
  }
);

// Get uploaded images list (for admin)
router.get('/',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const fs = require('fs').promises;
      const uploadsDir = 'uploads';

      let files = [];
      try {
        files = await fs.readdir(uploadsDir);
      } catch (error) {
        // If uploads directory doesn't exist, return empty array
        return res.json({
          success: true,
          data: [],
        });
      }

      // Get file details
      const fileDetails = await Promise.all(
        files.map(async (filename) => {
          const filePath = path.join(uploadsDir, filename);
          const stats = await fs.stat(filePath);
          
          // Check if file is used by any post
          const postUsingImage = await Post.findOne({ featuredImage: filename });

          return {
            filename,
            path: `/uploads/${filename}`,
            size: stats.size,
            createdAt: stats.birthtime,
            isUsed: !!postUsingImage,
          };
        })
      );

      res.json({
        success: true,
        data: fileDetails,
      });
    } catch (error) {
      console.error('Get images error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get images list',
      });
    }
  }
);

module.exports = router;
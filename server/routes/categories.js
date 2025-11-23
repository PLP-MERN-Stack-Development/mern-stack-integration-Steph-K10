const express = require('express');
const {
  getCategories,
  createCategory,
} = require('../controllers/categories');
const { protect, authorize } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validators');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), validateCategory, handleValidationErrors, createCategory);

module.exports = router;
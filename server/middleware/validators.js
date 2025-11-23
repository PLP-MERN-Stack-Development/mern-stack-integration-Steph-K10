// validators.js - Input validation rules

const { body } = require('express-validator');

// Auth validation
const validateAuth = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Post validation
const validatePost = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
];

// Category validation
const validateCategory = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name cannot be more than 50 characters'),
];

module.exports = {
  validateAuth,
  validatePost,
  validateCategory,
};
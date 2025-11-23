const express = require('express');
const {
  register,
  login,
  getMe,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const { validateAuth } = require('../middleware/validators');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateAuth, handleValidationErrors, register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
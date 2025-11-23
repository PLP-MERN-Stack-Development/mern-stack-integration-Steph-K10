// server/controllers/auth.js - Enhanced with comprehensive logging

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  console.log('=== REGISTRATION REQUEST START ===');
  console.log('📝 Request body:', { 
    username: req.body.username, 
    email: req.body.email,
    passwordLength: req.body.password ? req.body.password.length : 0
  });
  console.log('📍 Request IP:', req.ip);
  console.log('🕐 Timestamp:', new Date().toISOString());

  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      console.log('❌ Missing required fields:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: username, email, and password',
      });
    }

    console.log('🔍 Checking for existing user...');
    
    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      console.log('❌ User already exists:', { 
        existingEmail: existingUser.email, 
        existingUsername: existingUser.username,
        matchType: existingUser.email === email ? 'email' : 'username'
      });
      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists',
      });
    }

    console.log('✅ No existing user found, creating new user...');

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    console.log('✅ User created successfully:', { 
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });

    // Generate token
    const token = generateToken(user._id);
    console.log('✅ JWT token generated for user:', user._id);

    console.log('=== REGISTRATION SUCCESS ===');
    console.log('📤 Sending response with user data and token');

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });

  } catch (error) {
    console.error('❌ REGISTRATION ERROR:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue
    });
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      console.log('📋 Validation errors:', errors);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
    }

    if (error.code === 11000) {
      console.log('🔑 Duplicate key error:', error.keyValue);
      return res.status(400).json({
        success: false,
        error: 'Duplicate field value entered',
        field: Object.keys(error.keyValue)[0],
      });
    }

    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  console.log('=== LOGIN REQUEST START ===');
  console.log('📝 Login attempt for email:', req.body.email);
  console.log('📍 Request IP:', req.ip);
  console.log('🕐 Timestamp:', new Date().toISOString());

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log('❌ Missing credentials:', { email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    console.log('🔍 Finding user by email...');
    
    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    console.log('✅ User found, checking password...');
    
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      console.log('❌ Password mismatch for user:', user._id);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    console.log('✅ Password matched for user:', { 
      userId: user._id,
      username: user.username 
    });

    // Generate token
    const token = generateToken(user._id);
    console.log('✅ JWT token generated for user:', user._id);

    console.log('=== LOGIN SUCCESS ===');

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('❌ LOGIN ERROR:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  console.log('=== GET CURRENT USER REQUEST ===');
  console.log('👤 Request user ID:', req.user.id);
  console.log('📍 Request IP:', req.ip);
  console.log('🕐 Timestamp:', new Date().toISOString());

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log('❌ User not found in database for ID:', req.user.id);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    console.log('✅ Current user retrieved:', {
      userId: user._id,
      username: user.username,
      email: user.email
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('❌ GET ME ERROR:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
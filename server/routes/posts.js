const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  searchPosts,
} = require('../controllers/posts');
const { protect, authorize } = require('../middleware/auth');
const { validatePost } = require('../middleware/validators');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router
  .route('/')
  .get(getPosts)
  .post(protect, authorize('admin'), validatePost, handleValidationErrors, createPost);

router
  .route('/search')
  .get(searchPosts);

router
  .route('/:id')
  .get(getPost)
  .put(protect, authorize('admin'), validatePost, handleValidationErrors, updatePost)
  .delete(protect, authorize('admin'), deletePost);

router
  .route('/:id/comments')
  .post(protect, addComment);

module.exports = router;
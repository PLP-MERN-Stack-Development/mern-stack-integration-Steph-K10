// Post.js - Mongoose model for blog posts (Updated for image uploads)

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    featuredImage: {
      type: String,
      default: null,
    },
    imagePath: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: [1000, 'Comment cannot be more than 1000 characters'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from title before saving
PostSchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  // Generate base slug
  let slug = this.title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  
  // Add timestamp to ensure uniqueness
  this.slug = `${slug}-${Date.now()}`;
    
  next();
});

// Virtual for post URL
PostSchema.virtual('url').get(function () {
  return `/posts/${this.slug}`;
});

// Virtual for image URL
PostSchema.virtual('imageUrl').get(function () {
  if (this.featuredImage) {
    return `/uploads/${this.featuredImage}`;
  }
  return null;
});

// Virtual for formatted date
PostSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to add a comment
PostSchema.methods.addComment = function (userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

// Method to increment view count
PostSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Static method to get posts by category
PostSchema.statics.getPostsByCategory = function (categoryId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({ category: categoryId, isPublished: true })
    .populate('author', 'username avatar')
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to search posts
PostSchema.statics.searchPosts = function (query, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const searchQuery = {
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { excerpt: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } },
    ],
  };

  return this.find(searchQuery)
    .populate('author', 'username avatar')
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Index for better search performance
PostSchema.index({ title: 'text', content: 'text', tags: 'text' });
PostSchema.index({ category: 1, createdAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
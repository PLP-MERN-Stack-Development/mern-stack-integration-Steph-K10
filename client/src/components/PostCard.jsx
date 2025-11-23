// PostCard.jsx - Post card component

import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const excerpt = post.excerpt || post.content.substring(0, 150) + '...';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
        <img
          src={`/uploads/${post.featuredImage}`}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-blue-600 font-semibold">
            {post.category?.name}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          <Link to={`/posts/${post.slug}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4">{excerpt}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            By {post.author?.username}
          </span>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>👁️ {post.viewCount} views</span>
            <span>💬 {post.comments?.length || 0} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
// Post.jsx - Single post page component

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

const Post = () => {
  const { id } = useParams();
  const { fetchPost, addComment, loading, error } = usePosts();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchPost(id);
        setPost(postData);
      } catch (err) {
        console.error('Failed to load post:', err);
      }
    };

    loadPost();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      const updatedComments = await addComment(post._id, { content: commentContent });
      setPost(prev => ({ ...prev, comments: updatedComments }));
      setCommentContent('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Post not found.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Post Header */}
      <header className="mb-8">
        <nav className="mb-4">
          <Link to="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </Link>
        </nav>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
        
        <div className="flex items-center justify-between text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <span>By {post.author?.username}</span>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>👁️ {post.viewCount} views</span>
            <span>💬 {post.comments?.length || 0} comments</span>
          </div>
        </div>

        {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
          <img
            src={`/uploads/${post.featuredImage}`}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {post.category?.name}
          </span>
          {post.tags?.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Post Content */}
      <div 
        className="prose max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Comments Section */}
      <section className="border-t pt-8">
        <h3 className="text-2xl font-bold mb-6">
          Comments ({post.comments?.length || 0})
        </h3>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Add Comment
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-100 rounded-md">
            <p className="text-gray-600">
              Please <Link to="/login" className="text-blue-500 hover:underline">login</Link> to add a comment.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {post.comments?.map(comment => (
            <div key={comment._id} className="border-b pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">
                    {comment.user?.username}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}

          {(!post.comments || post.comments.length === 0) && (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </section>
    </article>
  );
};

export default Post;
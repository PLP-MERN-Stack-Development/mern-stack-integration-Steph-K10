// Home.jsx - Home page component

import React, { useState, useEffect } from 'react';
import { usePosts } from '../context/PostContext';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const { posts, loading, error, fetchPosts, fetchCategories, categories } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchPosts(currentPage, 10, selectedCategory);
    fetchCategories();
  }, [currentPage, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to MERN 101 Blog</h1>
        <p className="text-xl mb-8">Discover amazing stories and share your thoughts</p>
        <SearchBar />
      </section>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Filter by Category:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-full ${
              !selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category._id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.slug ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-blue-500 text-white rounded">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
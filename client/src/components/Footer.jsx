// Footer.jsx - Footer component

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2025 MERN 101 Blog. All rights reserved.</p>
        <p className="mt-2 text-gray-400">
          Built with MongoDB, Express.js, React.js, and Node.js
        </p>
      </div>
    </footer>
  );
};

export default Footer;
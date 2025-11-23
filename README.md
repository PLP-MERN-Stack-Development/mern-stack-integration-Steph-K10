# Week 4: MERN Stack Integration Assignment

A modern, full-stack blogging application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, CRUD operations, image uploads, and real-time comments.

## 🚀 Live Demo
Frontend: https://mern-stack-integration-steph-k10.vercel.app/

Backend API: https://mern-blog-backend-hp2h.onrender.com

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Setup Instructions](#-setup-instructions)
5. [Project Structure](#project-structure)
6. [API Documentation](#-api-documentation)
7. [Deployment](#-deployment)
8. [Future Enhancements](#future-enhancements)
9. [Screenshots](#-screenshots)
10. [Resources](#resources)

## 🎯 Project Overview
MERN 101 Blog is a comprehensive blogging platform that demonstrates seamless integration between frontend and backend components. The application provides a complete content management system with user authentication, post management, and social features.

## ✨ Features
- **Full CRUD Operations**: Create, read, update, and delete blog posts
- **User Authentication**: JWT-based registration and login system
- **Image Uploads**: Support for featured images in blog posts
- **Comment System**: Real-time comments on blog posts
- **Content Discovery**: Paginated post listings, category-based filtering, search functionality, post view counting
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Architecture**: Component-based React frontend with RESTful API

## 🛠 Tech Stack
### Frontend
- **React 18** - Component-based UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **Express** Validator - Input validation
- **Resend** - Transactional email service

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

## 🚀 Setup Instructions
### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

1. **Clone the Repository**
```
git clone https://github.com/your-username/mern-blog.git
cd mern-blog
```
2. **Backend Setup**
```
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```
**Configure Environment Variables (`server/.env`):**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
RESEND_API_KEY=your_resend_api_key
CLIENT_URL=http://localhost:3000
```
**Start the backend server:**
```
npm run dev
```

3. **Frontend Setup**
```
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure Environment Variables (`client/.env`):**
```
VITE_API_URL=http://localhost:5000/api
```
**Start the frontend development server:**
```
npm run dev
```

4. **Database Setup**
The application will automatically create the necessary collections when you first run it.

## Project Structure
```
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## 📚 API Documentation
### Authentication Endpoints
| Method  | Endpoint | Description  | Auth Required |
| ------------- | ------------- | ------------- | ------------- |
| POST | `/api/auth/register`  | Register new user  | No  |
| POST  | `/api/auth/login`  | User login  | No  |
| GET  | `/api/auth/me`  | Get current user  | Yes  |

### Blog Posts Endpoints
| Method  | Endpoint | Description  | Auth Required |
| ------------- | ------------- | ------------- | ------------- |
| GET | `/api/posts`  | Get all posts (paginated)  | No  |
| GET  | `/api/posts/:id`  | Get single post | No  |
| POST  | `/api/posts`  | Create new post  | Admin  |
| PUT | `/api/posts/:id`  | Update post  | Admin  |
| DELETE  | `/api/posts/:id`  | dELETE post  | Admin  |
| POST  | `	/api/posts/:id/comments`  | Add comment  | Yes  |
| GET  | `/api/posts/search?q=query`  | Search posts  | No  |

> For admin access, you'll need to manually update a user's role in the database:
```
// In MongoDB
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```
### Categories Endpoints
| Method  | Endpoint | Description  | Auth Required |
| ------------- | ------------- | ------------- | ------------- |
| GET | `/api/categories`  | Get all categories  | No  |
| POST  | `/api/categories`  | Create category  | Admin  |

### File Upload Endpoint

| Method  | Endpoint | Description  | Auth Required |
| ------------- | ------------- | ------------- | ------------- |
| POST | `/api/uploadr`  | Upload image  | Admin  |
| GET | `/api/upload`  | Get uploaded images  | Admin  |
| DELETE  | `/api/upload/:filename`  | Delete image  | Admin  |

## Request/Response Examples
### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```
###
```
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my post...",
  "category": "507f1f77bcf86cd799439011",
  "tags": ["javascript", "react"],
  "excerpt": "Brief description of the post",
  "isPublished": true
}
```

## 🌐 Deployment
### Backend Deployment (Render)
1. Push code to GitHub
2. Go to Render.com
3. Create new Web Service
4. Connect GitHub repository
5. Configure settings:
  - **Name**: mern-blog-backend
  - **Environment**: Node
  - **Build Command**: npm install
  - **Start Command**: npm start
  - **Root Directory**: server
6. Set environment variables in Render dashboard:
'''
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=30d
RESEND_API_KEY=your_resend_api_key
CLIENT_URL=https://your-frontend.vercel.app
'''

### Frontend Deployment (Vercel)
1. Install Vercel CLI:
```
npm install -g vercel
```
2. Deploy from client directory:
```
cd client
vercel
```
3. Or connect GitHub repository on [Vercel.com](https://vercel.com/)
4. 
```
VITE_API_URL=https://your-backend.onrender.com/api
```
## 📸 Screenshots


## Future Enhancements
- **Email Verification System**
  - Send verification links on registration
  - Verify email addresses before account activation
- **Password Reset**
  - Forgot password functionality
  - Password strength validation
  - Account lockout after multiple failed attempts
- **Cloud Storage Integration for file uploads**
  - The current implementation uses local file storage:images uploaded work in development
  - Need to integrate cloud/dedicated file storage service

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/) 
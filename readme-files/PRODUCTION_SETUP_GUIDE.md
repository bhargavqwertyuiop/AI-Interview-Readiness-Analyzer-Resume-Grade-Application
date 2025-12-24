# Production-Grade Authentication & Backend Integration Guide

## Overview

This document guides you through integrating the new production-grade authentication system and backend APIs with your existing React application.

## What Has Been Implemented

### Backend (Node.js + Express)

✅ **Complete Backend Server**
- Express.js REST API framework
- MongoDB integration with Mongoose
- JWT authentication (access + refresh tokens)
- Password hashing with bcrypt
- Protected route middleware
- CORS configuration

✅ **Database Models**
- User (with authentication)
- InterviewProgress (question answers and AI feedback)
- MockInterviewSession (voice interview sessions)

✅ **Authentication Endpoints**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - Logout

✅ **User Data Endpoints**
- `GET /api/user/profile` - Get user info
- `GET /api/user/dashboard-metrics` - Dashboard data
- `GET /api/user/progress` - Interview progress
- `POST /api/user/answer` - Submit question answer
- `POST /api/user/mock-interview` - Save mock interview
- `GET /api/user/mock-interviews` - Get interview history

### Frontend Integration

✅ **API Service Layer**
- `/src/services/api.js` - Centralized API communication
- Token management utilities
- Automatic token refresh handling
- Error handling

✅ **New Authentication Hook**
- `/src/hooks/useAuthNew.js` - Backend-integrated auth
- Login, signup, logout functionality
- Token management
- User state management

✅ **Updated Components**
- `/src/pages/LoginNew.jsx` - New login page with backend
- `/src/pages/DashboardNew.jsx` - Dashboard with real backend data
- `/src/components/ProtectedRouteNew.jsx` - Protected route wrapper

## Setup Instructions

### Step 1: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/interview-os
JWT_SECRET=your-super-secret-key-at-least-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-your-key
```

5. Start the backend:
```bash
npm run dev
```

**Expected output:**
```
Server running on port 5000
Environment: development
Frontend URL: http://localhost:5173
MongoDB connected: cluster.mongodb.net
```

### Step 2: Frontend Setup

1. Install frontend dependencies (if needed):
```bash
npm install
```

2. Create `.env` file in root directory:
```bash
VITE_API_URL=http://localhost:5000/api
```

3. Update `package.json` scripts to run both frontend and backend concurrently (optional):
```json
{
  "scripts": {
    "dev": "vite",
    "dev:all": "concurrently \"npm run dev\" \"cd backend && npm run dev\"",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

4. Start the frontend:
```bash
npm run dev
```

### Step 3: Update App.jsx (Main Integration Point)

Replace your existing `App.jsx` routing to use the new backend-integrated components:

```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuthNew'
import LoginNew from './pages/LoginNew'
import DashboardNew from './pages/DashboardNew'
import ProtectedRouteNew from './components/ProtectedRouteNew'
import Landing from './pages/Landing'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginNew />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRouteNew>
                <DashboardNew />
              </ProtectedRouteNew>
            }
          />

          {/* Add other protected routes here */}
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
```

## Testing the System

### Test 1: Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "testPassword123"
  }'
```

Expected response:
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Test 2: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "testPassword123"
  }'
```

### Test 3: Protected Endpoint

```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test 4: In Browser

1. Visit `http://localhost:5173/login`
2. Click "Create Account"
3. Fill in name, email, and password
4. Submit form
5. Should redirect to `/dashboard` with real user data

## How the System Works

### Authentication Flow

1. **User Signup/Login**
   - Frontend sends credentials to backend
   - Backend validates and creates JWT tokens
   - Access token stored in localStorage
   - Refresh token stored as httpOnly cookie (secure)

2. **Protected Requests**
   - Frontend attaches access token to request header
   - Backend middleware validates token
   - Request proceeds if valid

3. **Token Refresh**
   - If access token expires (15 min)
   - Frontend automatically uses refresh token
   - Requests new access token from backend
   - Retry original request with new token

4. **Logout**
   - Clear tokens from localStorage and cookies
   - Redirect to login page
   - Backend invalidates refresh token

### Data Flow

1. **Dashboard Load**
   - Component mounts
   - Checks for valid access token
   - Fetches `/api/user/dashboard-metrics`
   - Displays real user data

2. **Submit Answer**
   - User submits answer
   - POST to `/api/user/answer`
   - Backend stores in database
   - Dashboard updates with new data

3. **Cross-Device Access**
   - User logs in on new device
   - Same credentials work
   - All previous data restored from database
   - No local storage dependency

## File Structure

```
backend/
├── server.js                 # Main server file
├── package.json
├── .env.example
├── BACKEND_SETUP.md          # Detailed backend guide
├── config/
│   └── database.js           # MongoDB connection
├── models/
│   ├── User.js               # User schema
│   ├── InterviewProgress.js  # Question answers
│   └── MockInterviewSession.js # Interview sessions
├── controllers/
│   ├── authController.js     # Auth logic
│   └── userController.js     # User data logic
├── middleware/
│   └── auth.js               # JWT validation
└── routes/
    ├── auth.js               # Auth routes
    └── user.js               # User routes

src/
├── services/
│   └── api.js                # API client library
├── hooks/
│   ├── useAuthNew.js         # Backend-integrated auth
│   └── useAuth.js            # Legacy (deprecated)
├── pages/
│   ├── LoginNew.jsx          # New login page
│   ├── DashboardNew.jsx      # New dashboard
│   └── Login.jsx             # Legacy (deprecated)
└── components/
    └── ProtectedRouteNew.jsx # New route protection
```

## Migration Checklist

- [ ] Backend dependencies installed
- [ ] MongoDB Atlas account created and configured
- [ ] Backend `.env` file created with correct values
- [ ] Backend server starts without errors
- [ ] Frontend `.env` file created with API URL
- [ ] Test signup endpoint works
- [ ] Test login endpoint works
- [ ] Test protected endpoint with token
- [ ] Frontend login page shows and submits
- [ ] Dashboard loads with real data after login
- [ ] Token refresh works (test 15 min expiry)
- [ ] Logout clears tokens
- [ ] Try login on different browser/device - data persists

## Security Best Practices Implemented

✅ **Password Security**
- Hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Never returned to frontend

✅ **Token Security**
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Refresh tokens stored as httpOnly cookies
- Tokens validated on every protected request

✅ **Database Security**
- User IDs isolate data between users
- Indexes for fast queries
- Connection string secured in environment variables

✅ **API Security**
- CORS configured to only allow frontend URL
- Authorization headers required
- All sensitive routes protected with middleware

✅ **Data Integrity**
- MongoDB transactions for critical operations
- Timestamps on all records
- User IDs linked to all data

## Scaling to Production

### 1. Database (MongoDB Atlas)

```bash
# Free tier: 512 MB storage
# Production tier: Dedicated cluster with backups
# Set IP whitelist to allow only backend server
# Enable automated backups
```

### 2. Backend Deployment (Render)

1. Push code to GitHub
2. Connect repo to Render
3. Set environment variables:
   - Copy values from `.env.example`
   - Generate strong JWT secrets
4. Deploy

### 3. Frontend Deployment (Netlify)

1. Update build command: `npm run build`
2. Set environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
3. Deploy

### 4. Environment Variables for Production

```env
# Generate strong secrets
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" >
JWT_REFRESH_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" >

# Production URLs
FRONTEND_URL=https://your-frontend.netlify.app
MONGODB_URI=mongodb+srv://prod-user:strong-password@cluster-prod.mongodb.net/interview-os-prod

# SSL/TLS configuration
NODE_ENV=production
```

## Common Issues & Solutions

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Check `FRONTEND_URL` in backend `.env` matches your actual frontend URL
- Ensure credentials flag is true in fetch requests
- Clear browser cache and cookies

### Issue: MongoDB Connection Error
```
MongooseError: Cannot connect to MongoDB
```

**Solution:**
- Verify connection string format
- Check IP is whitelisted in MongoDB Atlas
- Verify username and password
- Test with MongoDB Compass

### Issue: Token Expired
```
401 Unauthorized
```

**Solution:**
- Token refresh should happen automatically
- Check `JWT_SECRET` matches between new tokens and old tokens
- Check browser localStorage isn't cleared

### Issue: Password Too Weak
```
Validation error: Password must be at least 6 characters
```

**Solution:**
- Use passwords with at least 6 characters
- For production, enforce stronger passwords

## Next Steps

1. **AI Integration**
   - Implement OpenAI API calls in `/api/user/answer` endpoint
   - Store AI feedback in database
   - Return feedback to frontend

2. **Advanced Features**
   - Email verification on signup
   - Password reset functionality
   - Two-factor authentication
   - Rate limiting

3. **Analytics**
   - Track user progression over time
   - Identify weak topics
   - Generate performance reports

4. **Monitoring**
   - Setup error logging (Sentry)
   - Monitor API performance
   - Database performance monitoring

## Support & Resources

- Backend Guide: See `backend/BACKEND_SETUP.md`
- API Documentation: All endpoints documented in comments
- Environment Setup: See `.env.example` files
- Security: See security notes in `middleware/auth.js`

## Key Takeaways

✅ Production-grade authentication system  
✅ Secure token management (JWT)  
✅ Persistent user data in database  
✅ Cross-device access support  
✅ Automatic token refresh  
✅ Protected API routes  
✅ Real-time dashboard with backend data  
✅ Scalable architecture for production  

Your application is now ready to handle real users with secure authentication and persistent data storage!

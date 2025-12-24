# Quick Start Guide - Production Authentication System

## 🚀 Get Started in 10 Minutes

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (free tier OK)
- Terminal/Command Prompt access

---

## Step 1: Setup Backend (5 minutes)

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

### 1.2 Create .env File
```bash
cp .env.example .env
```

### 1.3 Edit .env (Key Values)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-os
JWT_SECRET=abc123defghijklmnopqrstuvwxyz123456789
JWT_REFRESH_SECRET=xyz987abcdefghijklmnopqrstuvwxyz789456
```

**How to get MongoDB URI:**
1. Go to mongodb.com → Create free account
2. Create cluster → Create database user
3. Click "Connect" → Copy connection string
4. Replace `<username>` and `<password>` with your database user credentials

### 1.4 Start Backend Server
```bash
npm run dev
```

✅ **You should see:**
```
Server running on port 5000
MongoDB connected
```

---

## Step 2: Setup Frontend (2 minutes)

### 2.1 Create .env in Root Directory
```bash
# In root directory (not backend/)
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 2.2 Start Frontend
```bash
npm run dev
```

✅ **You should see:**
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

---

## Step 3: Test Authentication (3 minutes)

### 3.1 Open Browser
Go to `http://localhost:5173/login`

### 3.2 Create Account
1. Click "Create Account"
2. Enter:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Create Account"

### 3.3 Verify
✅ Should redirect to dashboard  
✅ Should show "Welcome, Test User!"  
✅ Dashboard should load (even with 0 stats)

### 3.4 Logout & Login Again
1. Click "Logout" button
2. Try logging in with email/password
3. Should see same data as before (persistence!)

---

## 🎉 Success!

You now have:
- ✅ Secure user authentication
- ✅ JWT token system
- ✅ Persistent data storage
- ✅ Cross-device access
- ✅ Production-ready architecture

---

## Common Issues

### Issue: "Cannot connect to MongoDB"
**Fix:** 
1. Check MongoDB URI in `.env`
2. Make sure IP is whitelisted (MongoDB Atlas → Security → IP Whitelist)
3. Check username/password are correct

### Issue: "CORS error in console"
**Fix:**
1. Make sure `FRONTEND_URL` is correct in backend `.env`
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try in incognito window

### Issue: "Port 5000 already in use"
**Fix:**
```bash
# Linux/Mac: Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows: Use Task Manager to find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "Signup says 'User already exists'"
**Fix:**
- Use a different email address for testing
- Or restart backend (it's using in-memory data temporarily)

---

## Next: Integrate with App

### Update App.jsx
Replace your current routing with:

```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuthNew'
import LoginNew from './pages/LoginNew'
import DashboardNew from './pages/DashboardNew'
import ProtectedRouteNew from './components/ProtectedRouteNew'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginNew />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRouteNew>
                <DashboardNew />
              </ProtectedRouteNew>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
```

---

## What's Running

### Backend Server
- Location: `backend/server.js`
- Port: 5000
- Database: MongoDB
- Authentication: JWT tokens

### Frontend App
- Location: `src/main.jsx`
- Port: 5173
- Framework: React + Vite
- Auth Hook: `useAuthNew.js`

### Data Flow
1. User enters email/password
2. Sent to backend `/api/auth/login`
3. Backend creates JWT tokens
4. Frontend stores token
5. Subsequent requests include token
6. Backend validates token on protected routes

---

## Files Created

### Backend
- `backend/server.js` - Main server
- `backend/models/User.js` - User database model
- `backend/models/InterviewProgress.js` - Answer storage
- `backend/models/MockInterviewSession.js` - Interview storage
- `backend/controllers/authController.js` - Login/Signup logic
- `backend/controllers/userController.js` - User data logic
- `backend/middleware/auth.js` - JWT validation
- `backend/routes/auth.js` - Auth endpoints
- `backend/routes/user.js` - User endpoints

### Frontend
- `src/services/api.js` - API client library
- `src/hooks/useAuthNew.js` - Authentication hook
- `src/pages/LoginNew.jsx` - Login page
- `src/pages/DashboardNew.jsx` - Dashboard with real data
- `src/components/ProtectedRouteNew.jsx` - Route protection

---

## Verify Backend is Working

```bash
# Test health check
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Backend server is running","timestamp":"2024-01-15T10:30:00Z"}
```

---

## Troubleshooting Commands

```bash
# Check if Node is installed
node -v
npm -v

# Check if ports are available
# Linux/Mac
lsof -i :5000
lsof -i :5173

# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Clear npm cache (if installation fails)
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ Token refresh mechanism
- ✅ Protected API routes
- ✅ CORS configured
- ✅ Environment variables for secrets
- ✅ User data isolation
- ✅ Secure httpOnly cookies

---

## Production Deployment

### Backend Deployment (Render.com)
1. Push backend code to GitHub
2. Connect repo to Render
3. Set environment variables
4. Deploy

### Frontend Deployment (Netlify)
1. Push frontend code to GitHub
2. Connect repo to Netlify
3. Set `VITE_API_URL` to your backend URL
4. Deploy

---

## Support

**Questions?**
- See `PRODUCTION_SETUP_GUIDE.md` for detailed setup
- See `backend/BACKEND_SETUP.md` for backend-specific issues
- See `backend/API_DOCUMENTATION.md` for API details

**Need help?**
Check that:
1. Backend is running (`npm run dev` in backend/)
2. Frontend is running (`npm run dev` in root)
3. MongoDB URI is correct
4. Port 5000 and 5173 are not already in use
5. Frontend `.env` has API URL set correctly

---

## Success Indicators

After completing this guide, you should be able to:

- ✅ Create a new account
- ✅ Login with email and password
- ✅ See dashboard with your name
- ✅ Logout successfully
- ✅ Login again on same/different browser
- ✅ See all your previous data persisted

**Congratulations! You have a production-grade authentication system!** 🎉

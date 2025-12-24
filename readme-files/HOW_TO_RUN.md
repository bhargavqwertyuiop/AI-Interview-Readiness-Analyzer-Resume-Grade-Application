# 🚀 How to Run InterviewOS Complete Application

## System Requirements

Before you start, ensure you have:
- **Node.js** 16+ ([Download](https://nodejs.org))
- **MongoDB Atlas Account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **.env file** with credentials (should already be in project root and backend folder)
- A terminal/command prompt (Git Bash, PowerShell, CMD, or WSL)

---

## Part 1: Verify Your Environment Files

### ✅ Check Root .env (Frontend)

In your project root folder, you should have `.env` file with:

```env
VITE_API_URL=http://localhost:5000
```

**To verify:**
```bash
# Windows (PowerShell)
Get-Content .env

# Windows (Git Bash / WSL)
cat .env
```

### ✅ Check Backend .env

In `backend/` folder, you should have `.env` file with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@clustername.mongodb.net/interviewdb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

**To verify:**
```bash
# Windows (PowerShell)
Get-Content backend\.env

# Windows (Git Bash / WSL)
cat backend/.env
```

---

## Part 2: Install Dependencies

### Step 1️⃣: Install Backend Dependencies

Open terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

**Expected output:**
```
added 158 packages
```

### Step 2️⃣: Install Frontend Dependencies

Navigate back to project root:

```bash
cd ..
npm install
```

**Expected output:**
```
up to date
```

---

## Part 3: Start the Backend Server

### Method 1: Using npm dev script (Recommended - with auto-reload)

```bash
cd backend
npm run dev
```

**Expected output:**
```
[nodemon] starting `node server.js`
Server running on port 5000
Environment: development
Frontend URL: http://localhost:5173
MongoDB connected: ac-0vrh6dr-shard-00-00.tppc7lc.mongodb.net
```

### Method 2: Using npm start (Simple start)

```bash
cd backend
npm start
```

**Expected output:**
```
Server running on port 5000
Environment: development
Frontend URL: http://localhost:5173
MongoDB connected: ac-0vrh6dr-shard-00-00.tppc7lc.mongodb.net
```

### Method 3: Direct Node (If npm scripts fail)

```bash
cd backend
node server.js
```

### ✅ Verify Backend is Running

**Option A: Using curl**
```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "Backend server is running",
  "timestamp": "2024-12-24T05:00:00.000Z"
}
```

**Option B: Using PowerShell**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing | Select-Object Content
```

**Option C: Open in Browser**
- Go to: `http://localhost:5000/api/health`
- You should see JSON response

---

## Part 4: Start the Frontend Server (In a New Terminal)

### Keep Backend Running!
**Important:** Backend terminal should keep running. Open a **NEW terminal window/tab** for frontend.

### Option 1: Using npm dev (Recommended)

```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.8  ready in 859 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### ✅ Verify Frontend is Running

Open your browser and go to:
```
http://localhost:5173
```

You should see the landing page with login/signup.

---

## Part 5: Test the Full Authentication Flow

### Step 1: Create an Account

1. **Open** `http://localhost:5173`
2. Click **"Sign Up"** (or toggle to signup mode)
3. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPassword123!`
4. Click **"Sign Up"**

**Expected result:**
- Account created successfully
- Redirected to dashboard
- See welcome message with your name

### Step 2: View Dashboard

Dashboard should show:
- Your name
- Readiness score: 0% (new user)
- Topics section
- Mock interviews section
- Analytics

### Step 3: Logout and Login

1. Click **"Logout"** button
2. You should be redirected to login page
3. Login with:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
4. You should see the same dashboard with your data

**Success!** ✅ Authentication and data persistence working!

---

## Part 6: Test API Endpoints Directly

### Test Signup Endpoint

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Password123!"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test Login Endpoint

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123!"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test Protected Endpoint (Get Dashboard Metrics)

```bash
# Replace TOKEN with the accessToken from login response
curl -X GET http://localhost:5000/api/user/dashboard-metrics \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "userName": "John Doe",
    "readinessScore": 0,
    "totalQuestionsAnswered": 0,
    "averageScore": 0,
    "lastActivityDate": "2024-12-24T05:00:00.000Z",
    "recentActivities": []
  }
}
```

---

## Part 7: Troubleshooting

### ❌ Problem: Backend Port 5000 Already in Use

**Solution 1: Kill existing process**

**Windows (PowerShell):**
```powershell
Get-Process node | Stop-Process -Force
```

**Windows (Git Bash):**
```bash
taskkill /IM node.exe /F
```

**Solution 2: Use a different port**

```bash
cd backend
PORT=5050 npm run dev
```

Then update `.env` file in root:
```env
VITE_API_URL=http://localhost:5050
```

### ❌ Problem: Frontend Port 5173 Already in Use

**Solution 1: Kill node processes**

```bash
# Windows PowerShell
Get-Process node | Stop-Process -Force

# Git Bash
taskkill /IM node.exe /F
```

**Solution 2: Let Vite use next available port**

Just run `npm run dev` - it will auto-use 5174, 5175, etc.

Then update backend `.env`:
```env
FRONTEND_URL=http://localhost:5174
```

### ❌ Problem: MongoDB Connection Failed

**Error message:**
```
MongoDB connection failed: connect ECONNREFUSED
```

**Solutions:**

1. **Check MongoDB Atlas connection string is correct**
   ```bash
   cat backend/.env | grep MONGODB
   ```

2. **Verify IP whitelist in MongoDB Atlas**
   - Go to: `https://cloud.mongodb.com`
   - Select your cluster → Network Access
   - Click "Add IP Address"
   - Add: `0.0.0.0/0` (allow all IPs for development)
   - Click "Confirm"

3. **Test connection with MongoDB shell**
   ```bash
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/interviewdb"
   ```

### ❌ Problem: Cannot find module errors

**Solution: Reinstall dependencies**

```bash
# Clear node_modules
cd backend
rm -rf node_modules package-lock.json
npm install

# Backend dependencies
cd ..
rm -rf node_modules package-lock.json
npm install
```

### ❌ Problem: CORS errors in browser console

**Error message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution: Update backend `.env`**

```env
FRONTEND_URL=http://localhost:5173
```

Or if using different port:
```env
FRONTEND_URL=http://localhost:5174
```

Restart backend after changing.

### ❌ Problem: npm: command not found

**Solution: Install Node.js**
- Download from: `https://nodejs.org`
- Install LTS version
- Restart terminal
- Verify: `node --version` and `npm --version`

---

## Quick Start Checklist

Use this checklist to verify everything is set up:

```
□ Node.js 16+ installed (node --version)
□ MongoDB Atlas account created
□ backend/.env has MONGODB_URI with credentials
□ backend/.env has JWT_SECRET
□ root/.env has VITE_API_URL=http://localhost:5000
□ backend dependencies installed (npm install in backend/)
□ frontend dependencies installed (npm install in root)
□ Backend started successfully (npm run dev in backend/)
□ Backend health check passes (curl http://localhost:5000/api/health)
□ Frontend started successfully (npm run dev in root)
□ Frontend loads in browser (http://localhost:5173)
□ Can create account via signup
□ Can login with created credentials
□ Dashboard shows user data
□ Can logout and login again
```

---

## Development Workflow

### Terminal Setup

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Keep this running. Shows all backend logs.

**Terminal 2 - Frontend:**
```bash
cd ..
npm run dev
```
Keep this running. Shows all frontend/Vite logs.

**Terminal 3 - Testing (Optional):**
```bash
# For running curl commands or testing
# Use this terminal for API calls
```

### Making Changes

**Backend Code Changes:**
- Edit files in `backend/` folder
- Nodemon auto-restarts the server
- Refresh browser or re-run API call

**Frontend Code Changes:**
- Edit files in `src/` folder
- Vite hot-reloads automatically
- Changes appear instantly in browser

---

## Next Steps After Setup

1. **Explore the codebase:**
   - `backend/controllers/authController.js` - Authentication logic
   - `backend/models/User.js` - User schema
   - `src/services/api.js` - Frontend API client
   - `src/hooks/useAuthNew.js` - Auth state management
   - `src/pages/LoginNew.jsx` - Login/signup UI
   - `src/pages/DashboardNew.jsx` - Dashboard UI

2. **Test features:**
   - Create multiple accounts
   - Submit answers to questions
   - View analytics
   - Start mock interviews

3. **Customize:**
   - Add new API endpoints
   - Modify UI components
   - Add new database models
   - Integrate AI services

4. **Deploy:**
   - See `DEPLOYMENT_CHECKLIST.md`
   - Deploy backend to Render/Railway
   - Deploy frontend to Netlify/Vercel

---

## Questions?

**Refer to:**
- `QUICK_START_PRODUCTION.md` - 10-minute quickstart
- `PRODUCTION_SETUP_GUIDE.md` - Detailed integration guide
- `backend/API_DOCUMENTATION.md` - All API endpoints
- `ARCHITECTURE_DIAGRAMS.md` - System architecture

---

**Happy coding!** 🎉

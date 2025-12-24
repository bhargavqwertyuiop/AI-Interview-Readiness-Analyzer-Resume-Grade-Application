# 🔍 Running Internal Auth Tests

## Issues Found & Fixed

### 1. Missing JWT_REFRESH_SECRET ✅ FIXED
**File:** `backend/.env`

**Issue:** The JWT refresh token secret was missing, which would cause token refresh to fail.

**Fixed by adding:**
```env
JWT_REFRESH_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### 2. Port Configuration ✅ VERIFIED
**File:** `backend/.env`

Backend is running on **port 5178** (not 5000)
- `PORT=5178` in backend/.env
- `VITE_API_URL=http://localhost:5178` in root .env
- Frontend correctly points to port 5178

### 3. Password Hashing Middleware ✅ ALREADY FIXED
**File:** `backend/models/User.js`

Fixed the pre-save middleware to properly return when password hasn't been modified.

---

## How to Test Internally

### Quick Test (5 minutes)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

Wait for:
```
Server running on port 5178
MongoDB connected: ...
```

**Terminal 2 - Run PowerShell Test:**

```powershell
# On Windows PowerShell
.\test-auth-debug.ps1
```

**Expected Output:**
```
✅ Backend is running
✅ Signup successful!
✅ Login successful!
✅ Password was correctly hashed and verified!
✅ Wrong password correctly rejected!
✅ Protected endpoint works!

✅ ALL TESTS PASSED!
```

---

## What the Test Does

### 1. **Health Check** ✅
Verifies backend is running on port 5000 (or 5178 if you changed it)

### 2. **Signup Test** ✅
Creates new user with:
- Name: `Debug Test User`
- Email: `testauth_XXXX@testdebug.com` (random)
- Password: `Debug123!@#`

**What happens:**
- Password is hashed with bcrypt (10 salt rounds)
- User stored in MongoDB
- JWT tokens generated
- Credentials stored for next tests

### 3. **Password Hashing Verification** ✅
Verifies password was actually hashed (not stored as plaintext)

**Check:** MongoDB should store password as `$2a$10$...` or similar bcrypt hash

### 4. **Login Test** ✅
Attempts login with **same credentials** from signup

**What this proves:**
- Password comparison works correctly
- Bcrypt hash matches the plaintext password
- **This is what was failing in cross-browser scenario**

### 5. **Wrong Password Test** ✅
Attempts login with incorrect password

**Expected:** Should fail with "Invalid credentials"

**What this proves:**
- Wrong passwords are properly rejected
- Security is working

### 6. **Protected Endpoint Test** ✅
Calls `/api/user/dashboard-metrics` with JWT token

**What this proves:**
- JWT token is valid
- Protected routes work
- User authentication is complete

---

## Manual Test (Without Script)

If PowerShell script doesn't work, test manually:

### Step 1: Signup

```powershell
$body = @{
    name = "Test User"
    email = "mytest@example.com"
    password = "MyPassword123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5178/api/auth/signup" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $body

$response.Content | ConvertFrom-Json | Format-List
```

**Expected:** Returns `accessToken` and `refreshToken`

### Step 2: Login

```powershell
$body = @{
    email = "mytest@example.com"
    password = "MyPassword123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5178/api/auth/login" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $body

$response.Content | ConvertFrom-Json | Format-List
```

**Expected:** Returns `accessToken` and `refreshToken`

**If this fails:** Password hashing is broken

### Step 3: Wrong Password (Should Fail)

```powershell
$body = @{
    email = "mytest@example.com"
    password = "WrongPassword"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5178/api/auth/login" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $body

$response.Content | ConvertFrom-Json | Format-List
```

**Expected:** `success: false` and error message

### Step 4: Protected Endpoint

```powershell
$token = "YOUR_ACCESS_TOKEN_FROM_LOGIN"

$response = Invoke-WebRequest -Uri "http://localhost:5178/api/user/dashboard-metrics" `
    -Method GET `
    -Headers @{"Authorization" = "Bearer $token"}

$response.Content | ConvertFrom-Json | Format-List
```

**Expected:** Returns user dashboard metrics

---

## Troubleshooting Test Failures

### ❌ Backend Not Running
```
Error: Cannot connect to http://localhost:5000
```

**Solution:**
```bash
cd backend
npm run dev
```

### ❌ Signup Returns Error
```
"Error creating user"
```

**Check:**
1. Email doesn't already exist (use random email)
2. Password is at least 6 characters
3. MongoDB is connected (check backend logs)

### ❌ Login Fails with "Invalid credentials"
```
"Invalid credentials"
```

**This is the cross-browser issue!**

**Check:**
1. Verify signup was successful
2. Verify password hashing is working:
   ```bash
   # Delete test user and try again
   # Check MongoDB for passwordHash field (should start with $2a$ or $2b$)
   ```

3. Check backend logs for errors:
   ```bash
   # Look for bcrypt errors
   # Look for mongoose validation errors
   ```

### ❌ JWT_REFRESH_SECRET Error
```
Error: Cannot verify refresh token
```

**Solution:** Restart backend after adding JWT_REFRESH_SECRET to `.env`

---

## After Tests Pass

### Manual Cross-Browser Test

1. **Browser 1 (Chrome):**
   - Open: `http://localhost:5173`
   - Sign up with new email
   - Dashboard loads with your data

2. **Browser 2 (Firefox/Edge):**
   - Open: `http://localhost:5173`
   - Login with same email/password
   - Dashboard loads with **SAME data** ✅

3. **Browser 1 Again:**
   - Refresh page
   - Login again
   - See same data ✅

---

## Files to Check If Tests Fail

1. **backend/.env**
   - JWT_SECRET is set
   - JWT_REFRESH_SECRET is set
   - MONGODB_URI is correct
   - FRONTEND_URL is correct

2. **backend/models/User.js**
   - Password hashing middleware looks correct
   - matchPassword method exists

3. **backend/controllers/authController.js**
   - signup creates user and hashes password
   - login finds user and compares password
   - Both generate tokens

4. **backend/middleware/auth.js**
   - generateTokens function exists
   - Uses JWT_SECRET and JWT_REFRESH_SECRET

---

## Next Steps

1. ✅ Run the test script
2. ✅ All tests should pass
3. ✅ Try manual cross-browser login
4. ✅ Progress should sync across browsers

If you still have issues after tests pass, the problem is in the frontend UI, not the backend!

---

**Run the test now:**

```powershell
cd "c:\Users\bharg\OneDrive\Desktop\final-app\final-3\AI Interview Readiness Analyzer – Resume-Grade Application"
.\test-auth-debug.ps1
```

Let me know the output!

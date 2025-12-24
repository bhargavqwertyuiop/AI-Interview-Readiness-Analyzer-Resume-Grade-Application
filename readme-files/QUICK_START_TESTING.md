# Authentication System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Project dependencies installed (`npm install`)
- Dev server running (`npm run dev`)

---

## 📝 Test Scenarios

### Scenario 1: Complete Sign Up & Login Flow

**Step 1: Sign Up**
1. Navigate to `http://localhost:5174/login`
2. Click **"Don't have an account? Sign up"**
3. Fill in the form:
   ```
   Name: John Developer
   Email: john@example.com
   Password: password123
   ```
4. Click **"Create Account"**
5. ✅ Expected: Redirect to dashboard with welcome message

**Step 2: Verify Welcome Message**
- Should see: "Welcome back, John Developer! 👋"
- Sidebar shows user name and plan badge (Free)

**Step 3: Logout**
1. Click **"Sign Out"** in the sidebar
2. ✅ Expected: Return to landing page

**Step 4: Login Again**
1. Click **"Login"** button
2. Use same credentials:
   ```
   Email: john@example.com
   Password: password123
   ```
3. Click **"Sign In"**
4. ✅ Expected: Dashboard loads immediately

---

### Scenario 2: Test Validation Errors

**Invalid Email Format**
1. Go to `/login`
2. Try to sign up with:
   ```
   Name: Jane
   Email: notanemail
   Password: password123
   ```
3. ✅ Expected: Error: "Invalid email format"

**Password Too Short**
1. Try to sign up with:
   ```
   Name: Jane
   Email: jane@example.com
   Password: 12345 (only 5 chars)
   ```
2. ✅ Expected: Error: "Password must be at least 6 characters"

**Name Too Short**
1. Try to sign up with:
   ```
   Name: J (only 1 char)
   Email: jane@example.com
   Password: password123
   ```
2. ✅ Expected: Error: "Name must be at least 2 characters"

**Duplicate Email**
1. Sign up with `john@example.com` (from Scenario 1)
2. Logout and try signing up again with same email
3. ✅ Expected: Error: "Email already registered"

---

### Scenario 3: Test Protected Routes

**Without Logout (Authenticated)**
1. After signing in, navigate to `/topics`
2. ✅ Expected: Topics page loads normally

**After Logout (Unauthenticated)**
1. Sign out
2. Try to access `/dashboard` directly
3. ✅ Expected: Redirect to `/login`

4. Try to access `/topics`
5. ✅ Expected: Redirect to `/login`

---

### Scenario 4: Session Persistence

**Test 1: Page Refresh**
1. Sign in with `john@example.com`
2. See welcome message
3. Press **Cmd+R** (Mac) or **Ctrl+R** (Windows)
4. ✅ Expected: Still logged in, welcome message still visible

**Test 2: Close and Reopen Browser**
1. Sign in
2. Close browser tab
3. Reopen `http://localhost:5174`
4. ✅ Expected: Still logged in (session persisted)

**Test 3: Navigate Away and Back**
1. Sign in
2. Click on different pages (Dashboard → Topics → Analytics)
3. User should remain logged in
4. ✅ Expected: All pages accessible, user context preserved

---

### Scenario 5: Multiple Users

**Create Second Account**
1. Logout from John's account
2. Sign up with new credentials:
   ```
   Name: Sarah Engineer
   Email: sarah@example.com
   Password: secure456
   ```
3. ✅ Expected: Welcome message shows "Sarah Engineer"

**Verify Data Isolation**
1. You're now logged in as Sarah
2. Check browser DevTools → Application → Local Storage
3. Look for keys:
   - `auth_user` (should show Sarah's info)
   - `user_data_user_*` (should be Sarah's unique ID)

**Switch Back to John**
1. Logout
2. Login with `john@example.com` / `password123`
3. ✅ Expected: Welcome shows "John Developer"
4. Check localStorage - `auth_user` now shows John's info

---

## 🔍 Browser DevTools Inspection

### Check Authentication State
1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **Local Storage**
4. Check these keys:

**auth_user** (Current logged-in user)
```javascript
{
  "id": "user_1234567890_abc",
  "email": "john@example.com",
  "name": "John Developer",
  "plan": "free"
}
```

**auth_users** (All registered users)
```javascript
{
  "user_1234567890_abc": {
    "id": "user_1234567890_abc",
    "email": "john@example.com",
    "name": "John Developer",
    "passwordHash": "cGFzc3dvcmQxMjM=",
    "plan": "free",
    "createdAt": "2024-01-15T14:30:00Z"
  }
}
```

**user_data_user_* (User-specific progress data)**
```javascript
{
  "userId": "user_1234567890_abc",
  "profile": {
    "name": "John Developer",
    "email": "john@example.com",
    "createdAt": "2024-01-15T14:30:00Z"
  },
  "progress": {
    "selectedRole": null,
    "answeredQuestions": [],
    "readinessScoreHistory": [],
    "lastActiveAt": "2024-01-15T14:35:00Z"
  }
}
```

---

## 🧪 Advanced Testing

### Test Account Information
You can create as many test accounts as needed. Requirements:
- **Name:** 2+ characters
- **Email:** Valid format (must contain @)
- **Password:** 6+ characters

### Test Multiple Browsers/Devices
1. **Same Device, Different Browser:**
   - Each browser has separate localStorage
   - Sign in on Chrome, Firefox still shows login page

2. **Mobile Device:**
   - Access `http://[computer-ip]:5174` from phone
   - Same authentication works
   - Responsive design adapts to mobile

### Test Error States
1. Sign in with wrong password
2. ✅ Should see: "Invalid email or password"
3. Try non-existent email
4. ✅ Should see: "Invalid email or password"

---

## 📊 Data Verification Checklist

After each test, verify:

- [ ] User can sign up with valid data
- [ ] Validation errors show for invalid data
- [ ] User can login with correct credentials
- [ ] Login fails with wrong password
- [ ] Welcome message shows user's name
- [ ] Sidebar displays user info
- [ ] Logout clears session
- [ ] Protected routes redirect unauthenticated users
- [ ] Page refresh maintains session
- [ ] Multiple users have isolated data
- [ ] localStorage contains expected keys

---

## 🐛 Troubleshooting

### "Email already registered" error
**Solution:** Use a different email address or clear localStorage

### Session lost after refresh
**Solution:** Check if localStorage is disabled in browser settings

### Can't see welcome message
**Solution:** 
1. Check if user name is loading
2. Check browser console for errors
3. Verify useAuth hook is returning user data

### Redirect loops
**Solution:**
1. Clear localStorage (Application → Local Storage → Clear All)
2. Close and reopen browser
3. Start fresh sign up

---

## 🎯 Common Test Patterns

### Pattern 1: New User Journey
```
Sign Up → See Dashboard → Logout → Login → See Dashboard
```

### Pattern 2: Error Recovery
```
Try Invalid Input → See Error → Correct Input → Success
```

### Pattern 3: Session Stability
```
Login → Refresh → Still Logged In → Navigate → Still Logged In
```

### Pattern 4: Data Isolation
```
Login as User A → Logout → Login as User B → Check isolated data
```

---

## ✅ Success Criteria

**Authentication System Working** ✅ When:
- Users can sign up and create accounts
- Email validation prevents invalid formats
- Password validation enforces 6+ characters
- Duplicate emails are rejected
- Users can login with correct credentials
- Wrong passwords are rejected
- Users can logout
- Protected routes redirect unauthenticated users
- Welcome messages personalize the dashboard
- Session persists across page reloads
- Multiple users maintain separate data

---

## 📱 UI Elements to Check

### Login Page
- [ ] Form title changes (Login ↔ Sign Up)
- [ ] Error messages display in red
- [ ] Submit button has loading state
- [ ] Links work (back, switch modes)

### Dashboard
- [ ] Welcome message visible
- [ ] User name displays correctly
- [ ] Greeting is personalized

### Sidebar
- [ ] User name shows at top
- [ ] Plan badge visible
- [ ] "Sign Out" button accessible
- [ ] Logout works

---

## 🔗 Files to Monitor (DevTools)

Watch these files load when testing:

1. **App.jsx** - Main routing logic
2. **useAuth.js** - Authentication hook
3. **useUserData.js** - User data management
4. **ProtectedRoute.jsx** - Route protection
5. **Sidebar.jsx** - User display
6. **Dashboard.jsx** - User welcome

---

## 💾 Reset Instructions

**Full Reset:**
```
1. DevTools → Application → Local Storage
2. Delete all keys
3. Refresh page
4. Start fresh sign up
```

**Soft Reset:**
```
1. Logout (clears auth_user)
2. All data still in localStorage
3. Can login again to recover
```

---

## 📞 Quick Reference

| Action | Expected Result |
|--------|-----------------|
| Sign up with valid data | Redirect to dashboard |
| Sign up with invalid email | Error: "Invalid email format" |
| Sign up with password < 6 chars | Error: "Password must be at least 6 characters" |
| Sign up with duplicate email | Error: "Email already registered" |
| Login with correct credentials | Redirect to dashboard |
| Login with wrong password | Error: "Invalid email or password" |
| Access `/dashboard` without login | Redirect to `/login` |
| Logout | Redirect to landing page |
| Refresh page while logged in | Stay logged in |
| Create 2 accounts | Each has isolated data |

---

**Ready to test!** 🎉

Start with Scenario 1 and work through each test methodically. Use DevTools to verify data in localStorage.

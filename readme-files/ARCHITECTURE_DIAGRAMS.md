# System Architecture & Data Flow Diagrams

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   USER'S BROWSER                             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            React App (Port 5173)                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐   │  │
│  │  │  Login Page  │→ │  Dashboard   │→ │  Topics    │   │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘   │  │
│  │         ↓                  ↓                  ↓         │  │
│  │     useAuthNew       api.js (Service)   Fetch API     │  │
│  │     (Hook)           - Token Management                │  │
│  │                      - Error Handling                  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
        ┌───────────────────────────────────────┐
        │   JWT Token in Authorization Header   │
        │   Bearer: eyJhbGc...                   │
        └───────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│              BACKEND SERVER (Port 5000)                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           Express.js REST API                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  /api/auth      /api/user      Routes            │  │  │
│  │  │  - signup       - profile      Controllers        │  │  │
│  │  │  - login        - dashboard    Models             │  │  │
│  │  │  - refresh      - progress     Middleware         │  │  │
│  │  │  - logout       - answers      Services           │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │         ↓ Middleware (auth.js)                         │  │
│  │    JWT Token Validation                                │  │
│  │    - Verify signature                                  │  │
│  │    - Check expiration                                  │  │
│  │    - Extract userId                                    │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            ↓ Mongoose
        ┌───────────────────────────────────────┐
        │  Connection String from .env          │
        │  mongodb+srv://user:pass@cluster      │
        └───────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│              MONGODB DATABASE (Cloud)                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  interview-os Database                                 │  │
│  │  ├─ Users Collection                                   │  │
│  │  │  └─ { _id, name, email, passwordHash, ... }       │  │
│  │  ├─ InterviewProgress Collection                       │  │
│  │  │  └─ { userId, questionId, userAnswer, score, ... } │  │
│  │  └─ MockInterviewSession Collection                    │  │
│  │     └─ { userId, role, duration, feedback, ... }      │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow Diagram

```
USER SIGNUP
───────────

┌─────────────┐
│   Browser   │
│  Login Page │
└──────┬──────┘
       │
       │ 1. User enters name, email, password
       │ 2. Clicks "Create Account"
       │
       ▼
┌──────────────────────────────────────┐
│  Frontend (React)                    │
│  - Validates input                   │
│  - Calls authAPI.signup()            │
│  - Stores token on success           │
└──────┬───────────────────────────────┘
       │
       │ 3. POST /api/auth/signup
       │    { name, email, password }
       │
       ▼
┌──────────────────────────────────────┐
│  Backend (Express)                   │
│  - Validates input                   │
│  - Checks email doesn't exist        │
│  - Hashes password with bcrypt       │
│  - Creates user in database          │
│  - Generates JWT tokens              │
└──────┬───────────────────────────────┘
       │
       │ 4. Returns accessToken
       │    { accessToken, user }
       │
       ▼
┌──────────────────────────────────────┐
│  Frontend (React)                    │
│  - Stores token in localStorage      │
│  - Redirects to dashboard            │
│  - Fetches user profile              │
└──────┬───────────────────────────────┘
       │
       │ 5. GET /api/user/dashboard
       │    Authorization: Bearer <token>
       │
       ▼
┌──────────────────────────────────────┐
│  Backend (Express)                   │
│  - Validates JWT token               │
│  - Extracts userId from token        │
│  - Fetches user data from database   │
│  - Returns dashboard metrics         │
└──────┬───────────────────────────────┘
       │
       │ 6. Returns dashboard data
       │    { metrics, recentAnswers }
       │
       ▼
┌──────────────────────────────────────┐
│  Frontend (React)                    │
│  - Renders dashboard                 │
│  - Shows user name                   │
│  - Shows readiness score             │
│  - Shows activity history            │
└──────────────────────────────────────┘
```

---

## 🔑 Token Lifecycle Diagram

```
LOGIN EVENT
───────────

Time: 0 minutes
┌─────────────────────────────────┐
│  User Logs In                   │
│  ↓                              │
│  JWT Tokens Generated           │
│  - accessToken (15 min expiry)  │
│  - refreshToken (7 days expiry) │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Frontend Storage               │
│  - accessToken → localStorage   │
│  - refreshToken → httpOnly      │
└─────────────────────────────────┘


Time: 0-15 minutes
┌─────────────────────────────────┐
│  User Makes Requests            │
│  ↓                              │
│  Header: Authorization          │
│  Value: Bearer <accessToken>    │
│  ↓                              │
│  Backend validates token        │
│  ✅ Valid → Request succeeds    │
└─────────────────────────────────┘


Time: 15 minutes (Token Expires)
┌─────────────────────────────────┐
│  User Makes New Request         │
│  ↓                              │
│  Backend validates token        │
│  ❌ Expired → Returns 401       │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Frontend Detects 401           │
│  ↓                              │
│  POST /api/auth/refresh         │
│  Body: { refreshToken }         │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Backend Validates refreshToken │
│  ✅ Valid → New tokens issued   │
│  ❌ Invalid → User logs out     │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Frontend Gets New accessToken  │
│  ↓                              │
│  Updates localStorage           │
│  ↓                              │
│  Retries original request       │
│  ✅ Request succeeds            │
└─────────────────────────────────┘
         ↓
(User continues without interruption)


Time: 7 days (Refresh Token Expires)
┌─────────────────────────────────┐
│  User Makes Request             │
│  ↓                              │
│  Access Token Expired           │
│  ↓                              │
│  Try to Refresh                 │
│  ↓                              │
│  Refresh Token Also Expired     │
│  ❌ Cannot refresh              │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Frontend Redirects to Login    │
│  ↓                              │
│  User Must Login Again          │
└─────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
SUBMIT ANSWER
─────────────

1. User Answers Question
   ┌────────────────────────┐
   │  QuestionCard Component│
   │  - Displays question   │
   │  - Shows textarea      │
   │  - Submit button       │
   └────────────┬───────────┘
                │
2. Form Submit  │
   ┌────────────▼───────────┐
   │  aiService.evaluateAnswer()
   │  - Gets user answer    │
   │  - Gets question ID    │
   │  - Calls userAPI       │
   └────────────┬───────────┘
                │
3. API Call     │
   ┌────────────▼───────────────────────┐
   │  POST /api/user/answer              │
   │  Authorization: Bearer <token>      │
   │  {                                  │
   │    questionId,                      │
   │    question,                        │
   │    userAnswer,                      │
   │    role,                            │
   │    difficulty,                      │
   │    timeSpent                        │
   │  }                                  │
   └────────────┬───────────────────────┘
                │
4. Backend      │
   ┌────────────▼───────────────────────┐
   │  authMiddleware (auth.js)           │
   │  - Validate JWT token               │
   │  - Extract userId                   │
   │  - Pass to controller               │
   └────────────┬───────────────────────┘
                │
5. Controller   │
   ┌────────────▼───────────────────────┐
   │  submitAnswer()                     │
   │  - Validate input                   │
   │  - Create progress record           │
   │  - Link to userId                   │
   │  - Save to database                 │
   └────────────┬───────────────────────┘
                │
6. Database     │
   ┌────────────▼───────────────────────┐
   │  MongoDB                            │
   │  InterviewProgress.insert()         │
   │  {                                  │
   │    userId: "507f...",               │
   │    questionId: "q1",                │
   │    userAnswer: "...",               │
   │    aiScore: null,  ← Will be filled │
   │    createdAt: Date.now()            │
   │  }                                  │
   └────────────┬───────────────────────┘
                │
7. Response     │
   ┌────────────▼───────────────────────┐
   │  {                                  │
   │    success: true,                   │
   │    progress: { _id, ... }           │
   │  }                                  │
   └────────────┬───────────────────────┘
                │
8. Frontend     │
   ┌────────────▼───────────────────────┐
   │  - Show success message             │
   │  - Update UI                        │
   │  - Refresh progress list            │
   │  - Navigate to next question        │
   └────────────────────────────────────┘
```

---

## 🔄 Cross-Device Data Sync

```
DEVICE A (Laptop)              DEVICE B (Phone)
─────────────────              ────────────────

1. User logs in
   ├─ POST /api/auth/login
   ├─ Gets accessToken
   └─ Stored in localStorage

2. Dashboard Loads
   ├─ GET /api/user/dashboard
   ├─ Authorization: Bearer <token>
   └─ Shows 0 questions answered
      (First time)

3. User practices questions
   ├─ POST /api/user/answer
   ├─ Answer saved to database
   └─ Score: 85


4. User logs in on Phone
                           ├─ POST /api/auth/login
                           ├─ Same email/password
                           ├─ Gets NEW accessToken
                           └─ Stored in localStorage


5. Dashboard loads on Phone
                           ├─ GET /api/user/dashboard
                           ├─ Authorization: Bearer <token>
                           ├─ Queries MongoDB for this userId
                           └─ Shows same data:
                              ✓ 1 question answered
                              ✓ Score: 85
                              ✓ Same user profile


6. User practices on Phone
                           ├─ POST /api/user/answer
                           ├─ Same userId in database
                           └─ Score: 90


7. Laptop refreshes               (Even if closed!)
                           
   Dashboard fetches data
   ├─ GET /api/user/dashboard
   ├─ Uses same userId
   ├─ Gets same data from MongoDB
   └─ Now shows:
      ✓ 2 questions answered
      ✓ Average: 87.5


KEY INSIGHT:
═══════════
All data is tied to userId in database, NOT the device.
Any user logging in with same credentials on ANY device
gets the SAME data automatically.

No sync needed. No manual refresh needed.
Just MongoDB doing its job! 🎯
```

---

## 🛡️ Security Layers Diagram

```
REQUEST COMING TO BACKEND
─────────────────────────

Client (Browser)
   │
   ├─ LAYER 1: HTTPS
   │  Encrypts all data in transit
   │  ✅ Password never sent in plain text
   │  ✅ Token encrypted in request body
   │
   └─ Authorization Header
      Authorization: Bearer <token>
         │
         ├─ LAYER 2: CORS Check
         │  ✅ Request from allowed origin only
         │  ✅ Blocks cross-site attacks
         │
         └─ Express Middleware (auth.js)
            │
            ├─ LAYER 3: Token Extraction
            │  ✅ Checks Authorization header exists
            │  ✅ Extracts token from "Bearer <token>"
            │
            └─ JWT Validation
               │
               ├─ LAYER 4: Signature Verification
               │  ✅ Verifies token signed with JWT_SECRET
               │  ✅ Ensures token not tampered with
               │
               ├─ LAYER 5: Expiration Check
               │  ✅ Verifies token not expired
               │  ✅ Returns 401 if expired
               │
               └─ LAYER 6: User Extraction
                  │
                  ├─ Extract userId from token payload
                  ├─ Attach to request object
                  │
                  └─ Controller
                     │
                     ├─ LAYER 7: Data Isolation
                     │  ✅ Query database with userId from token
                     │  ✅ Return only this user's data
                     │  ✅ Prevent cross-user access
                     │
                     └─ Response
                        ✅ Data specific to authenticated user only
```

---

## 📈 Database Query Flow

```
GET /api/user/dashboard-metrics
Authorization: Bearer <token>
───────────────────────────────

Backend Middleware
   │
   └─ Validate token
      Extract userId: "507f1f77bcf86cd799439011"


Dashboard Controller
   │
   ├─ Query 1: Get user details
   │  db.users.findById("507f1f77bcf86cd799439011")
   │  ✅ Returns user profile
   │
   ├─ Query 2: Get recent answers
   │  db.interviewProgress.find({
   │    userId: "507f1f77bcf86cd799439011"
   │  }).sort({createdAt: -1}).limit(5)
   │  ✅ Returns last 5 answers from THIS user only
   │
   ├─ Query 3: Get recent interviews
   │  db.mockInterviewSessions.find({
   │    userId: "507f1f77bcf86cd799439011"
   │  }).sort({createdAt: -1}).limit(5)
   │  ✅ Returns last 5 interviews from THIS user only
   │
   └─ Query 4: Calculate average score
      db.interviewProgress.aggregate([
        {
          $match: {
            userId: ObjectId("507f1f77bcf86cd799439011")
          }
        },
        {
          $group: {
            _id: null,
            avgScore: { $avg: "$aiScore" }
          }
        }
      ])
      ✅ Returns average score for THIS user only


Response to Frontend
{
  success: true,
  metrics: {
    overallReadinessScore: 75,
    totalQuestionsAnswered: 24,
    recentAnswers: [ ... THIS USER'S answers only ... ],
    recentMockInterviews: [ ... THIS USER'S interviews only ... ],
    ...
  }
}
```

---

## 🔀 Component Communication

```
App.jsx
   │
   ├─ AuthProvider (Context)
   │  │
   │  ├─ useAuthNew Hook
   │  │  ├─ login()
   │  │  ├─ signup()
   │  │  ├─ logout()
   │  │  └─ error handling
   │  │
   │  └─ Provides to child components
   │
   ├─ ProtectedRouteNew
   │  │
   │  ├─ Check isAuthenticated
   │  ├─ Render children or redirect
   │  └─ Show loading state
   │
   ├─ LoginNew Page
   │  │
   │  ├─ Calls useAuth()
   │  ├─ Calls authAPI.login()
   │  ├─ Stores tokens
   │  └─ Redirects to /dashboard
   │
   └─ DashboardNew Page
      │
      ├─ Calls useAuth()
      ├─ Calls userAPI.getDashboardMetrics()
      ├─ Renders dashboard with real data
      └─ Handles logout


API Service Layer (api.js)
   │
   ├─ Manages tokens
   ├─ Adds Authorization header
   ├─ Handles 401 responses
   ├─ Auto-refreshes tokens
   └─ Retries requests


Database
   │
   └─ Stores all persistent data
```

---

These diagrams illustrate the complete flow of data, authentication, and security in your production system!

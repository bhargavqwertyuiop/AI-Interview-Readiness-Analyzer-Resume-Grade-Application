# Project Structure & Authentication System Map

## 📂 Complete Project Structure

```
Interview Readiness Analyzer/
│
├── 📋 DOCUMENTATION (Root)
│   ├── AUTHENTICATION_DOCS_INDEX.md ←── START HERE for navigation
│   ├── STAGE4_COMPLETION_SUMMARY.md ←── Executive summary
│   ├── AUTHENTICATION_COMPLETE_SUMMARY.md ←── Full overview
│   ├── AUTHENTICATION_GUIDE.md ←── Technical deep dive
│   ├── QUICK_START_TESTING.md ←── Testing guide
│   ├── STAGE4_IMPLEMENTATION.md ←── Stage 4 details
│   ├── STAGE5_ROADMAP.md ←── Future planning
│   ├── README.md
│   ├── SETUP_GUIDE.md
│   └── DEPLOYMENT.md
│
├── 🔐 AUTHENTICATION SYSTEM
│   └── src/
│       └── hooks/
│           ├── useAuth.js ⭐ (240 lines)
│           │   ├── login()
│           │   ├── signup()
│           │   ├── logout()
│           │   ├── updateProfile()
│           │   ├── upgradeToPro()
│           │   └── downgradeToFree()
│           │
│           ├── useUserData.js ⭐ (289 lines)
│           │   ├── initializeUserData()
│           │   ├── loadUserData()
│           │   ├── updateTopicProgress()
│           │   ├── addAnsweredQuestion()
│           │   ├── addEvaluation()
│           │   ├── addVoiceInterview()
│           │   ├── updateReadinessScore()
│           │   ├── getReadinessScore()
│           │   └── clearUserData()
│           │
│           ├── useLocalStorage.js
│           └── useUsageLimits.js
│
├── 🛡️ ROUTE PROTECTION
│   └── src/
│       ├── App.jsx ⭐ (197 lines - UPDATED)
│       │   ├── Route definitions
│       │   ├── ProtectedRoute wrapper
│       │   ├── User data initialization
│       │   └── Landing/Login routing
│       │
│       └── components/
│           ├── ProtectedRoute.jsx ⭐ (NEW)
│           │   ├── Auth check
│           │   ├── Loading spinner
│           │   └── Redirect logic
│           │
│           └── Layout/
│               └── Sidebar.jsx ⭐ (138 lines - UPDATED)
│                   ├── User info display
│                   ├── Logout button
│                   ├── Plan badge
│                   └── Navigation
│
├── 📱 PAGES
│   └── src/pages/
│       ├── Login.jsx ⭐ (155 lines - UPDATED)
│       │   ├── Signup form
│       │   ├── Login form
│       │   ├── Validation display
│       │   └── Error messages
│       │
│       ├── Dashboard.jsx ⭐ (122 lines - UPDATED)
│       │   ├── Welcome message
│       │   ├── User context
│       │   ├── Role selector
│       │   └── Progress display
│       │
│       ├── Landing.jsx
│       ├── Roadmap.jsx
│       ├── Topics.jsx
│       ├── Analytics.jsx
│       ├── MockInterviews.jsx
│       ├── VoiceMockInterview.jsx
│       └── Pricing.jsx
│
├── 🎨 UI COMPONENTS
│   └── src/components/
│       ├── Analytics/
│       │   ├── ConfidenceChart.jsx
│       │   ├── ReadinessChart.jsx
│       │   ├── TopicsProgressChart.jsx
│       │   └── WeeklyActivityChart.jsx
│       │
│       ├── Dashboard/
│       │   ├── QuickStats.jsx
│       │   ├── ReadinessScore.jsx
│       │   ├── RoleSelector.jsx
│       │   └── WeakAreas.jsx
│       │
│       ├── MockInterviews/
│       │   ├── MockInterviewCard.jsx
│       │   └── ScheduleMockModal.jsx
│       │
│       ├── Topics/
│       │   ├── AIQuestionGenerator.jsx
│       │   ├── AnswerEvaluation.jsx
│       │   ├── QuestionBank.jsx
│       │   └── TopicCard.jsx
│       │
│       ├── Layout/
│       │   └── Sidebar.jsx
│       │
│       └── UsageLimitBanner.jsx
│
├── 🛠️ UTILITIES & DATA
│   └── src/
│       ├── services/
│       │   ├── aiService.js
│       │   └── answerEvaluationService.js
│       │
│       ├── utils/
│       │   ├── pdfGenerator.js
│       │   ├── questionHelpers.js
│       │   ├── readinessCalculator.js
│       │   ├── speechService.js
│       │   └── weakAreaDetector.js
│       │
│       └── data/
│           ├── questionBank.js
│           └── roadmaps.js
│
├── 📦 PROJECT FILES
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── public/
│
└── 🎨 STYLES
    └── src/
        └── index.css
```

---

## 🔗 Authentication System Data Flow

```
User Browser
    │
    └─→ Login.jsx (UI)
        │
        └─→ useAuth Hook
            ├─ signup(email, password, name)
            │   └─ localStorage.auth_users (registry)
            │      localStorage.auth_user (session)
            │
            ├─ login(email, password)
            │   └─ localStorage.auth_user (session)
            │
            └─ logout()
                └─ Clear localStorage.auth_user
    │
    └─→ App.jsx (Routing)
        │
        ├─→ ProtectedRoute (Guard)
        │   ├─ Check isAuthenticated
        │   ├─ Show spinner if loading
        │   └─ Redirect if not authenticated
        │
        └─→ Dashboard.jsx (Protected Page)
            │
            └─→ useUserData Hook
                └─ localStorage.user_data_${userId}
                   (User-scoped data)
    │
    └─→ Sidebar.jsx (UI)
        │
        ├─ Display user info
        ├─ Logout button
        └─ useAuth hook (call logout())
```

---

## 🗂️ Key Files Quick Reference

### ⭐ Most Important (Authentication Core)

| File | Size | Purpose | Status |
|------|------|---------|--------|
| **useAuth.js** | 240 L | Auth logic | ✅ NEW |
| **useUserData.js** | 289 L | User data | ✅ NEW |
| **ProtectedRoute.jsx** | 24 L | Route guard | ✅ NEW |
| **App.jsx** | 197 L | Routing setup | ✅ UPDATED |
| **Dashboard.jsx** | 122 L | User context | ✅ UPDATED |
| **Sidebar.jsx** | 138 L | User display | ✅ UPDATED |
| **Login.jsx** | 155 L | Auth UI | ✅ UPDATED |

### 📚 Documentation (New)

| File | Purpose |
|------|---------|
| AUTHENTICATION_DOCS_INDEX.md | Navigation hub |
| STAGE4_COMPLETION_SUMMARY.md | What's done |
| AUTHENTICATION_COMPLETE_SUMMARY.md | Full overview |
| AUTHENTICATION_GUIDE.md | Technical details |
| QUICK_START_TESTING.md | How to test |
| STAGE4_IMPLEMENTATION.md | What changed |
| STAGE5_ROADMAP.md | What's next |

### 📱 UI Components (Existing)

| File | Purpose |
|------|---------|
| RoleSelector.jsx | Role selection |
| ReadinessScore.jsx | Score display |
| QuickStats.jsx | Quick stats card |
| WeakAreas.jsx | Weak areas card |
| ConfidenceChart.jsx | Confidence chart |
| ReadinessChart.jsx | Readiness chart |
| TopicsProgressChart.jsx | Progress chart |
| WeeklyActivityChart.jsx | Activity chart |

---

## 🔄 File Dependencies

```
App.jsx
├─ imports: ProtectedRoute
├─ imports: useAuth
├─ imports: useUserData
├─ imports: useLocalStorage
└─ renders: AppLayout
    └─ renders: Sidebar + Routes
        ├─ renders: Login (public)
        ├─ renders: Dashboard (protected)
        ├─ renders: Roadmap (protected)
        ├─ renders: Topics (protected)
        ├─ renders: Analytics (protected)
        ├─ renders: MockInterviews (protected)
        └─ renders: VoiceMockInterview (protected)

Dashboard.jsx
├─ imports: useAuth
├─ imports: useUserData
├─ imports: useLocalStorage
└─ uses: user.name from useAuth
└─ uses: userData from useUserData

Login.jsx
├─ imports: useAuth
├─ uses: login() from useAuth
├─ uses: signup() from useAuth
└─ uses: error from useAuth

Sidebar.jsx
├─ imports: useAuth
├─ imports: useUsageLimits
├─ uses: user from useAuth
├─ uses: logout() from useAuth
└─ uses: isPro from useUsageLimits

ProtectedRoute.jsx
├─ imports: Navigate from react-router-dom
└─ checks: isAuthenticated prop
```

---

## 💾 localStorage Structure

```javascript
localStorage = {
  // ===== AUTHENTICATION =====
  
  auth_user: {
    // Current logged-in user (ONE)
    id: "user_1234567890_abc",
    email: "john@example.com",
    name: "John Developer",
    plan: "free",
    lastLogin: "2024-01-15T14:30:00Z"
  },
  
  auth_users: {
    // User registry (MANY)
    "user_1234567890_abc": {
      id: "user_1234567890_abc",
      email: "john@example.com",
      name: "John Developer",
      passwordHash: "cGFzc3dvcmQxMjM=",
      plan: "free",
      createdAt: "2024-01-15T14:30:00Z"
    },
    "user_1234567891_def": {
      id: "user_1234567891_def",
      email: "jane@example.com",
      name: "Jane Engineer",
      passwordHash: "c2VjdXJlNDU2",
      plan: "pro",
      createdAt: "2024-01-14T10:00:00Z"
    }
  },
  
  // ===== USER DATA (Isolated Per User) =====
  
  user_data_user_1234567890_abc: {
    // John's data
    userId: "user_1234567890_abc",
    profile: {
      name: "John Developer",
      email: "john@example.com",
      avatarUrl: null,
      createdAt: "2024-01-15T14:30:00Z"
    },
    progress: {
      selectedRole: "Frontend Engineer",
      answeredQuestions: [...],
      aiEvaluations: [...],
      voiceInterviews: [...],
      readinessScoreHistory: [...],
      topicProgress: {...},
      lastActiveAt: "2024-01-15T14:30:00Z"
    },
    preferences: {
      theme: "dark",
      notifications: true,
      language: "en"
    }
  },
  
  user_data_user_1234567891_def: {
    // Jane's data (completely isolated)
    userId: "user_1234567891_def",
    profile: {...},
    progress: {...},
    preferences: {...}
  },
  
  // ===== MISC =====
  
  selectedRole: "Frontend Engineer",
  topics: {...},
  mockInterviews: [...]
}
```

---

## 🔐 Security Layers

```
Layer 1: Input Validation
├─ Email format check
├─ Password length check (6+)
└─ Name length check (2+)

Layer 2: User Registry
├─ Duplicate email detection
├─ User lookup on login
└─ Password verification

Layer 3: Session Management
├─ Unique user ID generation
├─ Session token (auth_user)
└─ Auto-clear on logout

Layer 4: Data Isolation
├─ User-scoped localStorage key
├─ No cross-user access
└─ Mirrors production multi-tenancy

Layer 5: Route Protection
├─ Auth state checking
├─ Loading state handling
└─ Automatic redirects
```

---

## 📊 Component Hierarchy

```
<App>
  <Router>
    <Routes>
      
      {/* Public Routes */}
      <Route path="/">
        <Landing />
      </Route>
      
      <Route path="/login">
        <Login />
      </Route>
      
      <Route path="/pricing">
        <Pricing />
      </Route>
      
      {/* Protected Routes */}
      <Route path="/*">
        <ProtectedRoute isAuthenticated={isAuth} isLoading={isLoading}>
          <AppLayout>
            <Sidebar>
              {/* User Info */}
              {/* Navigation */}
              {/* Logout Button */}
            </Sidebar>
            
            <Routes>
              <Route path="/dashboard">
                <Dashboard user={user} userData={userData} />
              </Route>
              
              <Route path="/roadmap">
                <Roadmap />
              </Route>
              
              <Route path="/topics">
                <Topics userData={userData} />
              </Route>
              
              <Route path="/analytics">
                <Analytics userData={userData} />
              </Route>
              
              <Route path="/mock-interviews">
                <MockInterviews userData={userData} />
              </Route>
              
              <Route path="/voice-interview">
                <VoiceMockInterview userData={userData} />
              </Route>
            </Routes>
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
    </Routes>
  </Router>
</App>
```

---

## 🧵 Hook Usage Map

```
useAuth Hook (Session Management)
├─ Used in: App.jsx
├─ Used in: Dashboard.jsx
├─ Used in: Login.jsx
├─ Used in: Sidebar.jsx
└─ Provides:
   ├─ user (current user)
   ├─ isAuthenticated (boolean)
   ├─ isLoading (boolean)
   ├─ error (string | null)
   ├─ login()
   ├─ signup()
   ├─ logout()
   ├─ updateProfile()
   ├─ upgradeToPro()
   └─ downgradeToFree()

useUserData Hook (Progress Management)
├─ Used in: App.jsx (initialization)
├─ Used in: Dashboard.jsx
├─ Used in: [Future] Topics.jsx
├─ Used in: [Future] Analytics.jsx
├─ Used in: [Future] MockInterviews.jsx
└─ Provides:
   ├─ userData (object)
   ├─ isLoading (boolean)
   ├─ initializeUserData()
   ├─ loadUserData()
   ├─ saveUserData()
   ├─ updateTopicProgress()
   ├─ addAnsweredQuestion()
   ├─ addEvaluation()
   ├─ addVoiceInterview()
   ├─ updateReadinessScore()
   ├─ setSelectedRole()
   ├─ getReadinessScore()
   └─ clearUserData()

useLocalStorage Hook
├─ Used in: App.jsx
├─ Used in: Dashboard.jsx
├─ Used in: [Various Components]
└─ Provides:
   ├─ getValue()
   └─ setValue()

useUsageLimits Hook
├─ Used in: Sidebar.jsx
├─ Used in: [Various Components]
└─ Provides:
   ├─ isPro (boolean)
   └─ plan (string)
```

---

## 📝 Method Quick Reference

### useAuth Methods
```javascript
const { user, isAuthenticated, isLoading, error } = useAuth()

login(email, password)              // Returns Promise<user>
signup(email, password, name)       // Returns Promise<user>
logout()                            // Returns void
updateProfile(updates)              // Updates current user
upgradeToPro()                      // Changes plan to pro
downgradeToFree()                   // Changes plan to free
```

### useUserData Methods
```javascript
const { userData, isLoading } = useUserData()

initializeUserData(user)            // Creates new user data
loadUserData(userId)                // Loads existing data
saveUserData(data)                  // Saves to localStorage
updateTopicProgress(...)            // Updates topic status
addAnsweredQuestion(...)            // Records answer
addEvaluation(...)                  // Records evaluation
addVoiceInterview(...)              // Records interview
updateReadinessScore(score)         // Updates score
setSelectedRole(role)               // Sets role
getReadinessScore(role)             // Returns score (0-100)
clearUserData()                     // Deletes all data
```

---

## 🎯 File Modification Summary

### New Files Created
```
✅ src/hooks/useUserData.js (289 lines)
✅ src/components/ProtectedRoute.jsx (24 lines)
✅ AUTHENTICATION_DOCS_INDEX.md
✅ STAGE4_COMPLETION_SUMMARY.md
✅ AUTHENTICATION_COMPLETE_SUMMARY.md
✅ AUTHENTICATION_GUIDE.md
✅ QUICK_START_TESTING.md
✅ STAGE4_IMPLEMENTATION.md
✅ STAGE5_ROADMAP.md
```

### Files Modified
```
✅ src/hooks/useAuth.js (240 lines - completely rewritten)
✅ src/App.jsx (197 lines - routing updates)
✅ src/pages/Dashboard.jsx (122 lines - user integration)
✅ src/components/Layout/Sidebar.jsx (138 lines - user display)
✅ src/pages/Login.jsx (155 lines - error handling)
```

### Files Unchanged
```
✅ src/pages/Landing.jsx
✅ src/pages/Roadmap.jsx
✅ src/pages/Topics.jsx
✅ src/pages/Analytics.jsx
✅ src/pages/MockInterviews.jsx
✅ src/pages/VoiceMockInterview.jsx
✅ src/pages/Pricing.jsx
✅ [All component files]
✅ [All utility files]
```

---

## 🚀 Ready for Integration

### What's Ready (Stage 5)
```
Topics.jsx
├─ Ready to integrate: addAnsweredQuestion()
├─ Ready to integrate: updateTopicProgress()
└─ Ready to use: userData.progress.answeredQuestions

Analytics.jsx
├─ Ready to integrate: userData.progress.readinessScoreHistory
└─ Ready to use: getReadinessScore()

MockInterviews.jsx
├─ Ready to integrate: addVoiceInterview()
└─ Ready to use: userData.progress.voiceInterviews

VoiceMockInterview.jsx
├─ Ready to integrate: Voice session tracking
└─ Ready to use: userData progress storage

Dashboard.jsx (Partially Done)
├─ ✅ Welcome message done
├─ ⏳ Progress charts ready for data
└─ ⏳ Recent activity ready for data
```

---

**Complete System Documentation Provided**

All files are organized, documented, and ready for:
- ✅ Testing
- ✅ Integration (Stage 5)
- ✅ Production deployment
- ✅ Interview discussion

See **AUTHENTICATION_DOCS_INDEX.md** for full navigation.

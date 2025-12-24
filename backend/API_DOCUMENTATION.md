# API Documentation - InterviewOS Backend

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Authentication Endpoints

### POST /auth/signup

Register a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "subscription": {
      "plan": "free"
    },
    "usageStats": {
      "questionsAnswered": 0,
      "mockInterviewsCompleted": 0,
      "totalLearningMinutes": 0
    },
    "overallReadinessScore": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `400` - Missing fields or invalid email format
- `400` - User already exists

---

### POST /auth/login

Authenticate user and get tokens.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "lastLoginAt": "2024-01-15T11:00:00Z"
  }
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

### POST /auth/refresh

Refresh the access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Refresh token required
- `401` - Invalid refresh token

---

### POST /auth/logout

Logout user and invalidate tokens.

**Protected: YES** (requires Authorization header)

**Request:**
```json
{}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### GET /user/profile

Get logged-in user's profile information.

**Protected: YES**

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "subscription": {
      "plan": "free",
      "startDate": null,
      "endDate": null
    },
    "usageStats": {
      "questionsAnswered": 24,
      "mockInterviewsCompleted": 3,
      "totalLearningMinutes": 180
    },
    "overallReadinessScore": 75,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "lastLoginAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `401` - Unauthorized (invalid token)
- `404` - User not found

---

### GET /user/dashboard-metrics

Get comprehensive dashboard metrics and analytics.

**Protected: YES**

**Query Parameters:**
- None

**Response (200):**
```json
{
  "success": true,
  "metrics": {
    "overallReadinessScore": 75,
    "totalQuestionsAnswered": 24,
    "totalMockInterviews": 3,
    "totalLearningMinutes": 180,
    "averageScore": 78,
    "lastLoginAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "recentAnswers": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "questionId": "q1",
        "question": "Tell me about yourself",
        "userAnswer": "I am a software engineer...",
        "aiScore": 82,
        "strengths": ["Good structure", "Clear communication"],
        "gaps": ["Could add more specific examples"],
        "suggestions": ["Practice with real interview scenarios"],
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "recentMockInterviews": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "role": "Frontend Engineer",
        "difficulty": "intermediate",
        "duration": 1800,
        "overallScore": 85,
        "createdAt": "2024-01-14T15:00:00Z"
      }
    ],
    "weeklyProgressCount": 12
  }
}
```

---

### GET /user/progress

Get paginated list of user's interview progress.

**Protected: YES**

**Query Parameters:**
- `limit` (number, default: 20) - Items per page
- `skip` (number, default: 0) - Items to skip

**Response (200):**
```json
{
  "success": true,
  "progress": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "questionId": "q1",
      "role": "Backend Engineer",
      "difficulty": "intermediate",
      "question": "What is a database transaction?",
      "userAnswer": "A transaction is a sequence of operations...",
      "aiScore": 85,
      "strengths": ["Accurate definition"],
      "gaps": ["Missing examples"],
      "suggestions": ["Add real-world examples"],
      "feedback": "Good start, but need more details",
      "timeSpent": 240,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "totalCount": 24,
  "limit": 20,
  "skip": 0
}
```

---

### POST /user/answer

Submit an answer for evaluation.

**Protected: YES**

**Request:**
```json
{
  "questionId": "q1",
  "question": "What is a database transaction?",
  "userAnswer": "A transaction is a sequence of database operations...",
  "role": "Backend Engineer",
  "difficulty": "intermediate",
  "timeSpent": 240
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Answer submitted successfully",
  "progress": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "questionId": "q1",
    "question": "What is a database transaction?",
    "userAnswer": "A transaction is a sequence of database operations...",
    "role": "Backend Engineer",
    "difficulty": "intermediate",
    "timeSpent": 240,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `400` - Missing required fields
- `401` - Unauthorized

---

### POST /user/mock-interview

Save a completed mock interview session.

**Protected: YES**

**Request:**
```json
{
  "role": "Frontend Engineer",
  "difficulty": "advanced",
  "duration": 1800,
  "questionsAsked": 4,
  "questionsAnswered": 4,
  "overallScore": 82,
  "interviewTranscript": [
    {
      "timestamp": "2024-01-15T10:00:00Z",
      "speaker": "ai",
      "text": "Hello, tell me about yourself"
    },
    {
      "timestamp": "2024-01-15T10:00:30Z",
      "speaker": "user",
      "text": "I'm a frontend engineer with 5 years of experience..."
    }
  ],
  "aiFeedback": {
    "summary": "Good overall performance",
    "strengths": ["Clear communication", "Technical knowledge"],
    "areasForImprovement": ["Could use more specific examples"],
    "suggestions": ["Practice handling follow-up questions"]
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Mock interview session saved successfully",
  "session": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "role": "Frontend Engineer",
    "difficulty": "advanced",
    "duration": 1800,
    "questionsAsked": 4,
    "questionsAnswered": 4,
    "overallScore": 82,
    "aiFeedback": {
      "summary": "Good overall performance",
      "strengths": ["Clear communication", "Technical knowledge"],
      "areasForImprovement": ["Could use more specific examples"],
      "suggestions": ["Practice handling follow-up questions"]
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### GET /user/mock-interviews

Get paginated list of mock interview sessions.

**Protected: YES**

**Query Parameters:**
- `limit` (number, default: 10) - Items per page
- `skip` (number, default: 0) - Items to skip

**Response (200):**
```json
{
  "success": true,
  "sessions": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "role": "Frontend Engineer",
      "difficulty": "advanced",
      "duration": 1800,
      "questionsAsked": 4,
      "questionsAnswered": 4,
      "overallScore": 82,
      "aiFeedback": {
        "summary": "Good overall performance",
        "strengths": ["Clear communication"],
        "areasForImprovement": ["Could use more examples"],
        "suggestions": ["Practice follow-ups"]
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalCount": 5,
  "limit": 10,
  "skip": 0
}
```

---

## Data Models

### User

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String (bcrypt),
  subscription: {
    plan: String (free|pro|enterprise),
    startDate: Date,
    endDate: Date
  },
  usageStats: {
    questionsAnswered: Number,
    mockInterviewsCompleted: Number,
    totalLearningMinutes: Number
  },
  overallReadinessScore: Number (0-100),
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### InterviewProgress

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  questionId: String,
  role: String,
  difficulty: String,
  question: String,
  userAnswer: String,
  aiScore: Number (0-100),
  strengths: [String],
  gaps: [String],
  suggestions: [String],
  feedback: String,
  timeSpent: Number (seconds),
  createdAt: Date
}
```

### MockInterviewSession

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  role: String,
  difficulty: String (beginner|intermediate|advanced),
  duration: Number (seconds),
  questionsAsked: Number,
  questionsAnswered: Number,
  overallScore: Number (0-100),
  interviewTranscript: [{
    timestamp: Date,
    speaker: String (ai|user),
    text: String
  }],
  aiFeedback: {
    summary: String,
    strengths: [String],
    areasForImprovement: [String],
    suggestions: [String]
  },
  recordingUrl: String,
  createdAt: Date
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, add rate limiting:

```bash
npm install express-rate-limit
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Token Format

JWT tokens are signed with `JWT_SECRET` and have the following payload:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "iat": 1705316400,
  "exp": 1705317300
}
```

- Access tokens expire in 15 minutes (configurable)
- Refresh tokens expire in 7 days (configurable)

---

## Examples

### JavaScript/Fetch

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('accessToken', data.accessToken);

// Protected request
const profileResponse = await fetch('http://localhost:5000/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});
```

### cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get profile
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Support

For issues or questions about the API, refer to `BACKEND_SETUP.md` or check the backend code comments.

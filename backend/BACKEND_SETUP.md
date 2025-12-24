# Backend Setup Guide

This guide explains how to set up and run the InterviewOS backend server.

## Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Environment File

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB URI (get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-os

# JWT Keys (generate strong random strings at least 32 characters)
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key
```

## Running the Server

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000` and watch for file changes.

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication Endpoints

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
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

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "user": { ... }
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

### User Endpoints (Protected - Require JWT Token)

#### Get User Profile
```
GET /api/user/profile
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "user": { ... }
}
```

#### Get Dashboard Metrics
```
GET /api/user/dashboard-metrics
Authorization: Bearer <accessToken>

Response:
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
    "recentAnswers": [ ... ],
    "recentMockInterviews": [ ... ],
    "weeklyProgressCount": 12
  }
}
```

#### Get Progress
```
GET /api/user/progress?limit=20&skip=0
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "progress": [ ... ],
  "totalCount": 24,
  "limit": 20,
  "skip": 0
}
```

#### Submit Answer
```
POST /api/user/answer
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "questionId": "q1",
  "question": "Tell me about yourself",
  "userAnswer": "I am a software engineer with 5 years of experience...",
  "role": "Senior Developer",
  "difficulty": "intermediate",
  "timeSpent": 120
}

Response:
{
  "success": true,
  "progress": { ... }
}
```

#### Save Mock Interview Session
```
POST /api/user/mock-interview
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "role": "Frontend Engineer",
  "difficulty": "advanced",
  "duration": 1800,
  "questionsAsked": 4,
  "questionsAnswered": 3,
  "overallScore": 82,
  "interviewTranscript": [ ... ],
  "aiFeedback": {
    "summary": "Good overall performance",
    "strengths": [ ... ],
    "areasForImprovement": [ ... ],
    "suggestions": [ ... ]
  }
}

Response:
{
  "success": true,
  "session": { ... }
}
```

#### Get Mock Interview Sessions
```
GET /api/user/mock-interviews?limit=10&skip=0
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "sessions": [ ... ],
  "totalCount": 5,
  "limit": 10,
  "skip": 0
}
```

## Database Schema

### User
- `_id`: MongoDB ObjectId
- `name`: String (required)
- `email`: String (required, unique)
- `passwordHash`: String (hashed with bcrypt)
- `subscription`: Object with plan, dates
- `usageStats`: Object with counters
- `overallReadinessScore`: Number (0-100)
- `createdAt`: Date
- `updatedAt`: Date
- `lastLoginAt`: Date

### InterviewProgress
- `_id`: MongoDB ObjectId
- `userId`: Reference to User
- `questionId`: String
- `role`: String
- `difficulty`: String
- `question`: String
- `userAnswer`: String
- `aiScore`: Number (0-100)
- `strengths`: Array of Strings
- `gaps`: Array of Strings
- `suggestions`: Array of Strings
- `feedback`: String
- `timeSpent`: Number (seconds)
- `createdAt`: Date

### MockInterviewSession
- `_id`: MongoDB ObjectId
- `userId`: Reference to User
- `role`: String
- `difficulty`: String (beginner, intermediate, advanced)
- `duration`: Number (seconds)
- `questionsAsked`: Number
- `questionsAnswered`: Number
- `overallScore`: Number (0-100)
- `interviewTranscript`: Array of messages
- `aiFeedback`: Object with summary and analysis
- `createdAt`: Date

## Security Best Practices

1. **JWT Tokens**
   - Access tokens expire in 15 minutes
   - Refresh tokens expire in 7 days
   - Refresh tokens stored as httpOnly cookies
   - Tokens validated on every protected request

2. **Password Security**
   - Passwords hashed with bcrypt (salt rounds: 10)
   - Never store plain passwords
   - Always validate on login

3. **CORS**
   - Only allows requests from frontend URL
   - Credentials (cookies) included in requests

4. **Environment Variables**
   - Never commit `.env` file to git
   - Use strong, unique keys in production
   - Rotate keys regularly

## Deployment

### MongoDB Atlas Setup

1. Create cluster at mongodb.com
2. Create database user
3. Add IP whitelist
4. Get connection string
5. Add to `.env` as `MONGODB_URI`

### Backend Hosting Options

**Render (Recommended)**
- Free tier available
- Automatic deployments from Git
- Built-in environment variable management

**Railway**
- Simple, modern deployment
- Pay per use
- GitHub integration

**Azure App Service**
- Enterprise-grade
- Integrated with Azure ecosystem
- More configuration options

**Heroku** (Legacy)
- Free tier discontinued
- Paid options available

### Deployment Steps

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy
5. Test endpoints

## Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testPassword123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123"
  }'
```

### Test Protected Route (requires access token)
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### MongoDB Connection Error
- Check connection string in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Verify database user credentials

### JWT Token Issues
- Ensure JWT_SECRET is set in `.env`
- Check token expiration time
- Verify Authorization header format: `Bearer <token>`

### CORS Errors
- Check FRONTEND_URL in `.env` matches actual frontend URL
- Ensure credentials flag is set in frontend requests
- Clear browser cookies and try again

### Port Already in Use
```bash
# Kill process using port 5000 on macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# On Windows, use Task Manager or:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## Next Steps

1. **Frontend Integration** - Update React components to use these APIs
2. **AI Evaluation** - Implement OpenAI integration for answer evaluation
3. **Advanced Analytics** - Add more metrics and progress tracking
4. **Rate Limiting** - Add rate limiting for API endpoints
5. **Logging** - Implement comprehensive logging system

## Support

For issues or questions, refer to the main README.md or create an issue in the repository.

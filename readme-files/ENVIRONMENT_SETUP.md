# Environment Configuration Guide

## Quick Reference

### Frontend (.env in root directory)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env in backend/ directory)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-os
JWT_SECRET=your_32_character_secret_key_here
JWT_REFRESH_SECRET=your_32_character_refresh_key_here
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-your-openai-key-here
```

---

## Detailed Setup

### Step 1: Frontend Configuration

**File location:** Root directory (same level as src/, package.json)

**Create `.env` file:**
```bash
touch .env
```

**Add content:**
```env
# API Configuration
# Points to your backend server
VITE_API_URL=http://localhost:5000/api

# For production, use:
# VITE_API_URL=https://your-backend-domain.com/api
```

**Verify it works:**
```bash
# Should show your API URL
echo $VITE_API_URL

# In code:
// access with: import.meta.env.VITE_API_URL
console.log(import.meta.env.VITE_API_URL)
```

---

### Step 2: Backend Configuration

**File location:** `backend/` directory

#### 2.1: Copy Example File
```bash
cd backend
cp .env.example .env
```

#### 2.2: Generate Strong Secrets

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d
```

Generate JWT_REFRESH_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output example: z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0
```

#### 2.3: Get MongoDB Connection String

**Local MongoDB (for development):**
```env
MONGODB_URI=mongodb://localhost:27017/interview-os
```

**MongoDB Atlas (Cloud - Recommended):**

1. Go to https://mongodb.com
2. Create account or login
3. Click "Create" → "Build a Database"
4. Choose free tier
5. Select your region
6. Create cluster
7. Create database user:
   - Username: `myusername` (avoid special chars)
   - Password: `MySecurePassword123!`
   - Choose "Autogenerate secure password" option
8. Click "Create User"
9. Add IP Address:
   - Click "Add My Current IP Address"
   - Or add 0.0.0.0/0 (allows all IPs - dev only!)
10. Click "Finish and Close"
11. Go to "Databases" → Your cluster → "Connect"
12. Select "Connect your application"
13. Choose "Node.js" and version "4.0+"
14. Copy connection string:
    ```
    mongodb+srv://myusername:MySecurePassword123@cluster.mongodb.net/?retryWrites=true&w=majority
    ```
15. Replace `<username>` and `<password>` with your actual values
16. Add database name after `.net/`:
    ```
    mongodb+srv://myusername:MySecurePassword123@cluster.mongodb.net/interview-os?retryWrites=true&w=majority
    ```

#### 2.4: Complete .env File

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/interview-os

# For MongoDB Atlas (Cloud):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-os?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d
JWT_REFRESH_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0

# Token Expiration Times
JWT_EXPIRY=15m            # 15 minutes for access token
JWT_REFRESH_EXPIRY=7d     # 7 days for refresh token

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# AI Integration (Optional)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Database Type (mongodb or postgres)
DB_TYPE=mongodb
```

---

## Environment Variables Explained

### Server Configuration

| Variable | Value | Purpose |
|----------|-------|---------|
| PORT | 5000 | Server port (backend) |
| NODE_ENV | development | Environment mode |
| | production | Production mode |

### Database

| Variable | Example | Purpose |
|----------|---------|---------|
| MONGODB_URI | mongodb+srv://... | Database connection string |
| DB_TYPE | mongodb | Type of database (mongodb, postgres) |

### JWT

| Variable | Example | Purpose |
|----------|---------|---------|
| JWT_SECRET | abc123... | Secret key for signing tokens |
| JWT_REFRESH_SECRET | xyz789... | Secret for refresh tokens |
| JWT_EXPIRY | 15m | Access token lifetime |
| JWT_REFRESH_EXPIRY | 7d | Refresh token lifetime |

### CORS

| Variable | Example | Purpose |
|----------|---------|---------|
| FRONTEND_URL | http://localhost:5173 | Allowed frontend URL |

### APIs

| Variable | Example | Purpose |
|----------|---------|---------|
| OPENAI_API_KEY | sk-... | OpenAI API key for AI features |

---

## Common Configuration Scenarios

### Local Development

**Backend .env:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/interview-os
JWT_SECRET=dev-secret-change-in-production-12345678901234567890
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production-123456
FRONTEND_URL=http://localhost:5173
```

**Frontend .env:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Production on Render

**Backend .env (in Render dashboard):**
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod-user:strong-password@prod-cluster.mongodb.net/interview-os-prod
JWT_SECRET=<generate-strong-secret-123-chars>
JWT_REFRESH_SECRET=<generate-strong-secret-123-chars>
FRONTEND_URL=https://your-app.netlify.app
OPENAI_API_KEY=sk-your-production-api-key
```

**Frontend .env (in Netlify):**
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Production on Railway

**Backend .env (in Railway):**
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://railway-user:password@cluster.mongodb.net/db
JWT_SECRET=<strong-256-bit-secret>
JWT_REFRESH_SECRET=<strong-256-bit-secret>
FRONTEND_URL=https://your-frontend-domain.com
```

### Production on Azure

**Backend Configuration (App Service Settings):**
```
PORT: 8080 (Azure default)
NODE_ENV: production
MONGODB_URI: mongodb+srv://...
JWT_SECRET: <strong-secret>
JWT_REFRESH_SECRET: <strong-secret>
FRONTEND_URL: https://your-azure-app.azurewebsites.net
```

---

## Security Best Practices

### ✅ DO

- ✅ Use strong random secrets (32+ characters)
- ✅ Generate secrets with `crypto.randomBytes()`
- ✅ Never commit `.env` file to git
- ✅ Use different secrets for each environment
- ✅ Rotate secrets periodically
- ✅ Use environment variables for all secrets
- ✅ Keep secrets out of logs
- ✅ Use HTTPS in production

### ❌ DON'T

- ❌ Hardcode secrets in code
- ❌ Use short or simple secrets
- ❌ Reuse secrets across environments
- ❌ Commit `.env` to git
- ❌ Share secrets in emails/chat
- ❌ Use example values in production
- ❌ Log sensitive data
- ❌ Use HTTP in production

---

## Troubleshooting

### "Cannot find module 'dotenv'"
```bash
cd backend
npm install dotenv
```

### "MONGODB_URI is undefined"
- Check `.env` file exists in `backend/` directory
- Check `MONGODB_URI=...` line exists
- Make sure no extra spaces: `MONGODB_URI =` won't work
- Restart backend server after changing `.env`

### "MongoDB connection timeout"
- Check `MONGODB_URI` is correct
- Check IP is whitelisted in MongoDB Atlas
- Check username/password are correct
- Check network connectivity

### "JWT verification failed"
- Check `JWT_SECRET` matches between signup and login
- Check `JWT_SECRET` is same on both backend instances
- Make sure secret is at least 32 characters

### "CORS error in browser"
- Check `FRONTEND_URL` in backend matches actual frontend URL
- Check `http://` vs `https://`
- Check port numbers (5173 vs 3000)

### "Token expired immediately"
- Check `JWT_EXPIRY` is set correctly (default: 15m)
- Check server clock is synchronized
- Check no typos in expiry value

---

## Accessing Environment Variables

### In Backend (Node.js)
```javascript
// After: import dotenv from 'dotenv'; dotenv.config();

const port = process.env.PORT;          // 5000
const jwtSecret = process.env.JWT_SECRET;
const mongoUri = process.env.MONGODB_URI;

console.log(`Server running on port ${port}`);
```

### In Frontend (Vite)
```javascript
// Must start with VITE_

const apiUrl = import.meta.env.VITE_API_URL;
// http://localhost:5000/api

if (import.meta.env.DEV) {
  console.log('Development mode');
}

if (import.meta.env.PROD) {
  console.log('Production mode');
}
```

---

## Production Secret Generation

### Generate JWT Secrets

**Option 1: Using Node.js**
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32  # JWT_SECRET
openssl rand -hex 32  # JWT_REFRESH_SECRET
```

**Option 3: Online Generator**
- https://www.random.org/strings/
- Generate two 64-character hex strings

---

## Environment File Examples

### .gitignore (Prevent committing secrets)
```
.env
.env.local
.env.*.local
node_modules/
dist/
```

### .env.example (Safe template to commit)
```env
VITE_API_URL=http://localhost:5000/api
```

```env
# backend/.env.example
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-os
JWT_SECRET=generate-a-random-32-character-string
JWT_REFRESH_SECRET=generate-another-random-32-character-string
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-your-api-key-here
```

---

## Verification Checklist

- [ ] `.env` file created in backend/
- [ ] `.env` file created in root/
- [ ] MONGODB_URI set correctly
- [ ] JWT_SECRET set (32+ characters)
- [ ] JWT_REFRESH_SECRET set (32+ characters)
- [ ] FRONTEND_URL matches actual URL
- [ ] VITE_API_URL matches backend URL
- [ ] .env files added to .gitignore
- [ ] No hardcoded secrets in code
- [ ] Backend starts without errors
- [ ] Frontend can connect to backend

---

## Getting Help

If environment setup fails:

1. Check all variables are present
2. Verify no typos in variable names
3. Check MongoDB Atlas credentials
4. Test MongoDB connection separately
5. Verify JWT secrets are correct
6. Check CORS configuration
7. Review error logs in detail

**Environment setup complete!** ✅

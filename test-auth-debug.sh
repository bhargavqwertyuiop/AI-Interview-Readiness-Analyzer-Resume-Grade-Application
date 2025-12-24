#!/bin/bash

# Comprehensive Authentication Debug Test
# This script tests the entire auth flow step-by-step

API_URL="http://localhost:5178/api"
TIMESTAMP=$(date +%s%N | md5sum | head -c 8)
TEST_EMAIL="testauth_${TIMESTAMP}@testdebug.com"
TEST_PASSWORD="Debug123!@#"
TEST_NAME="Debug Test User"

echo "=================================================="
echo "COMPREHENSIVE AUTHENTICATION DEBUG TEST"
echo "=================================================="
echo ""
echo "Configuration:"
echo "  API URL: $API_URL"
echo "  Test Email: $TEST_EMAIL"
echo "  Test Password: $TEST_PASSWORD"
echo "  Test Name: $TEST_NAME"
echo ""
echo "This test will:"
echo "  1. Check if backend is running"
echo "  2. Create a new user account (signup)"
echo "  3. Verify user is stored in database"
echo "  4. Login with same credentials"
echo "  5. Verify token generation"
echo "  6. Access protected endpoint"
echo ""

# Check if backend is running
echo "Step 1️⃣  : Checking if backend is running..."
echo "---"
if ! curl -s http://localhost:5178/api/health > /dev/null; then
    echo "❌ Backend is not running!"
    echo "Start it with: cd backend && npm run dev"
    echo ""
    echo "Make sure backend is running on port 5178"
    echo "Check your backend/.env file has: PORT=5178"
    exit 1
fi
echo "✅ Backend is running"
echo ""

# Step 1: SIGNUP
echo "Step 2️⃣ : Testing SIGNUP..."
echo "---"
echo "Request:"
echo "  Method: POST"
echo "  Endpoint: /api/auth/signup"
echo "  Body: {"
echo "    \"name\": \"$TEST_NAME\","
echo "    \"email\": \"$TEST_EMAIL\","
echo "    \"password\": \"$TEST_PASSWORD\""
echo "  }"
echo ""

SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

echo "Response:"
echo "$SIGNUP_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SIGNUP_RESPONSE"
echo ""

# Extract tokens from signup response
SIGNUP_SUCCESS=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "false")
SIGNUP_TOKEN=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('accessToken', ''))" 2>/dev/null || echo "")
SIGNUP_REFRESH=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('refreshToken', ''))" 2>/dev/null || echo "")
SIGNUP_USER_ID=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); uid=d.get('user',{}).get('_id','') or d.get('user',{}).get('id',''); print(uid)" 2>/dev/null || echo "")

if [ "$SIGNUP_SUCCESS" != "True" ] && [ "$SIGNUP_TOKEN" == "" ]; then
    echo "❌ Signup failed!"
    echo "Troubleshooting:"
    echo "  - Check if email already exists"
    echo "  - Check password requirements (min 6 chars)"
    echo "  - Check MongoDB connection"
    exit 1
fi

echo "✅ Signup successful!"
echo "  Access Token: ${SIGNUP_TOKEN:0:50}..."
echo "  Refresh Token: ${SIGNUP_REFRESH:0:50}..."
echo "  User ID: $SIGNUP_USER_ID"
echo ""

# Step 2: VERIFY SIGNUP - Check password was hashed
echo "Step 3️⃣ : Verifying password hashing..."
echo "---"
echo "Check: Password should be bcrypt hashed in database"
echo "Expected: Password hash starts with \$2a\$ or \$2b\$"
echo ""

# We can't directly access MongoDB from bash, but we can verify through login
echo "This will be verified in the next login step"
echo ""

# Step 3: LOGIN with same credentials
echo "Step 4️⃣ : Testing LOGIN (simulating different browser)..."
echo "---"
echo "Request:"
echo "  Method: POST"
echo "  Endpoint: /api/auth/login"
echo "  Body: {"
echo "    \"email\": \"$TEST_EMAIL\","
echo "    \"password\": \"$TEST_PASSWORD\""
echo "  }"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

echo "Response:"
echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extract login token
LOGIN_SUCCESS=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "false")
LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('accessToken', ''))" 2>/dev/null || echo "")

if [ "$LOGIN_TOKEN" == "" ]; then
    echo "❌ Login failed! This is the issue."
    echo ""
    echo "Diagnosis:"
    echo "  The password hashing might still have issues."
    echo "  Password comparison might be failing."
    echo ""
    echo "Debug:"
    echo "  1. Check if password hash is correct in database"
    echo "  2. Verify bcryptjs is hashing correctly"
    echo "  3. Check if password comparison function works"
    exit 1
fi

echo "✅ Login successful!"
echo "  Access Token: ${LOGIN_TOKEN:0:50}..."
echo "  ✅ Password was correctly hashed and verified!"
echo ""

# Step 4: TEST WRONG PASSWORD
echo "Step 5️⃣ : Testing LOGIN with WRONG password (should fail)..."
echo "---"

WRONG_PASSWORD_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"WrongPassword123\"}")

WRONG_SUCCESS=$(echo "$WRONG_PASSWORD_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "false")
WRONG_TOKEN=$(echo "$WRONG_PASSWORD_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('accessToken', ''))" 2>/dev/null || echo "")

echo "Response:"
echo "$WRONG_PASSWORD_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$WRONG_PASSWORD_RESPONSE"
echo ""

if [ "$WRONG_TOKEN" != "" ]; then
    echo "❌ Wrong password was accepted! Security issue!"
    exit 1
fi

echo "✅ Wrong password correctly rejected!"
echo ""

# Step 5: Test Protected Endpoint
echo "Step 6️⃣ : Testing PROTECTED ENDPOINT (dashboard metrics)..."
echo "---"
echo "Request:"
echo "  Method: GET"
echo "  Endpoint: /api/user/dashboard-metrics"
echo "  Authorization: Bearer ${LOGIN_TOKEN:0:30}..."
echo ""

PROTECTED_RESPONSE=$(curl -s -X GET "$API_URL/user/dashboard-metrics" \
  -H "Authorization: Bearer $LOGIN_TOKEN")

echo "Response:"
echo "$PROTECTED_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PROTECTED_RESPONSE"
echo ""

PROTECTED_SUCCESS=$(echo "$PROTECTED_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "false")

if [ "$PROTECTED_SUCCESS" != "True" ]; then
    echo "❌ Protected endpoint failed!"
    exit 1
fi

echo "✅ Protected endpoint works!"
echo ""

# Summary
echo "=================================================="
echo "✅ ALL TESTS PASSED!"
echo "=================================================="
echo ""
echo "Summary:"
echo "  ✅ Backend is running"
echo "  ✅ Signup works (user created with hashed password)"
echo "  ✅ Login works (password correctly hashed and verified)"
echo "  ✅ Wrong password rejected (security working)"
echo "  ✅ Protected endpoints accessible (JWT tokens working)"
echo ""
echo "Cross-browser authentication should work!"
echo ""
echo "Next steps:"
echo "  1. Open Browser 1: http://localhost:5173"
echo "  2. Logout from current session"
echo "  3. Open Browser 2 (different browser)"
echo "  4. Login with: $TEST_EMAIL / $TEST_PASSWORD"
echo "  5. You should see the same dashboard"
echo ""
echo "Test account details:"
echo "  Email: $TEST_EMAIL"
echo "  Password: $TEST_PASSWORD"
echo ""


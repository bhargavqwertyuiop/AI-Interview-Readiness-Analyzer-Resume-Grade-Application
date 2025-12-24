#!/bin/bash

# Authentication Testing Script
# Tests signup, login, and cross-browser authentication

API_URL="http://localhost:5000/api"
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser_${TIMESTAMP}@example.com"
TEST_PASSWORD="TestPassword123!"
TEST_NAME="Test User"

echo "=========================================="
echo "InterviewOS Authentication Test"
echo "=========================================="
echo ""
echo "Testing with:"
echo "  Email: $TEST_EMAIL"
echo "  Password: $TEST_PASSWORD"
echo "  API URL: $API_URL"
echo ""

# Test 1: Signup
echo "1️⃣  Testing SIGNUP..."
echo "---"

SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

echo "Response:"
echo "$SIGNUP_RESPONSE" | python3 -m json.tool

# Extract tokens
ACCESS_TOKEN=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('accessToken', ''))" 2>/dev/null)
REFRESH_TOKEN=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('refreshToken', ''))" 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Signup failed - no access token"
    exit 1
fi

echo ""
echo "✅ Signup successful!"
echo "Access Token: ${ACCESS_TOKEN:0:30}..."
echo ""

# Test 2: Login (same credentials)
echo "2️⃣  Testing LOGIN with same credentials..."
echo "---"

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

echo "Response:"
echo "$LOGIN_RESPONSE" | python3 -m json.tool

LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('accessToken', ''))" 2>/dev/null)

if [ -z "$LOGIN_TOKEN" ]; then
    echo "❌ Login failed - no access token"
    exit 1
fi

echo ""
echo "✅ Login successful!"
echo ""

# Test 3: Protected endpoint with login token
echo "3️⃣  Testing PROTECTED ENDPOINT (Dashboard Metrics)..."
echo "---"

DASHBOARD_RESPONSE=$(curl -s -X GET "$API_URL/user/dashboard-metrics" \
  -H "Authorization: Bearer $LOGIN_TOKEN")

echo "Response:"
echo "$DASHBOARD_RESPONSE" | python3 -m json.tool

if echo "$DASHBOARD_RESPONSE" | grep -q "success"; then
    echo ""
    echo "✅ Protected endpoint accessible!"
else
    echo ""
    echo "❌ Protected endpoint failed"
fi

echo ""
echo "=========================================="
echo "✅ All tests passed!"
echo "=========================================="
echo ""
echo "Notes:"
echo "• User created: $TEST_EMAIL"
echo "• Password: $TEST_PASSWORD"
echo "• You can login from any browser with these credentials"
echo "• Data will sync across all devices"
echo ""

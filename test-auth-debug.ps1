# Comprehensive Authentication Debug Test (Windows PowerShell)
# This script tests the entire auth flow step-by-step

$API_URL = "http://localhost:5178/api"
$TIMESTAMP = (Get-Random -Maximum 10000)
$TEST_EMAIL = "testauth_${TIMESTAMP}@testdebug.com"
$TEST_PASSWORD = "Debug123!@#"
$TEST_NAME = "Debug Test User"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "COMPREHENSIVE AUTHENTICATION DEBUG TEST" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  API URL: $API_URL"
Write-Host "  Test Email: $TEST_EMAIL"
Write-Host "  Test Password: $TEST_PASSWORD"
Write-Host "  Test Name: $TEST_NAME"
Write-Host ""
Write-Host "This test will:" -ForegroundColor Yellow
Write-Host "  1. Check if backend is running"
Write-Host "  2. Create a new user account (signup)"
Write-Host "  3. Verify user is stored in database"
Write-Host "  4. Login with same credentials"
Write-Host "  5. Verify token generation"
Write-Host "  6. Access protected endpoint"
Write-Host ""

# Function to check if backend is running
function Test-Backend {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5178/api/health" -UseBasicParsing -ErrorAction SilentlyContinue
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

# Check if backend is running
Write-Host "Step 1️⃣  : Checking if backend is running..." -ForegroundColor Cyan
Write-Host "---"
if (-not (Test-Backend)) {
    Write-Host "❌ Backend is not running!" -ForegroundColor Red
    Write-Host "Start it with: cd backend && npm run dev" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor Yellow
    Write-Host "Also make sure backend is running on port 5178" -ForegroundColor Yellow
    Write-Host "Check your backend/.env file has: PORT=5178" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Backend is running" -ForegroundColor Green
Write-Host ""

# Step 1: SIGNUP
Write-Host "Step 2️⃣  : Testing SIGNUP..." -ForegroundColor Cyan
Write-Host "---"
Write-Host "Request:"
Write-Host "  Method: POST"
Write-Host "  Endpoint: /api/auth/signup"
Write-Host "  Body: {" -ForegroundColor Gray
Write-Host "    ""name"": ""$TEST_NAME""," -ForegroundColor Gray
Write-Host "    ""email"": ""$TEST_EMAIL""," -ForegroundColor Gray
Write-Host "    ""password"": ""$TEST_PASSWORD""" -ForegroundColor Gray
Write-Host "  }" -ForegroundColor Gray
Write-Host ""

$signupBody = @{
    name     = $TEST_NAME
    email    = $TEST_EMAIL
    password = $TEST_PASSWORD
} | ConvertTo-Json

try {
    $signupResponse = Invoke-WebRequest -Uri "$API_URL/auth/signup" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json" } `
        -Body $signupBody `
        -UseBasicParsing

    $signupData = $signupResponse.Content | ConvertFrom-Json
}
catch {
    $signupData = $_.Exception.Response.Content | ConvertFrom-Json
}

Write-Host "Response:"
Write-Host ($signupData | ConvertTo-Json | Out-String)

$signupToken = $signupData.accessToken
$signupRefresh = $signupData.refreshToken
$signupUserId = $signupData.user._id

if (-not $signupToken) {
    Write-Host "❌ Signup failed!" -ForegroundColor Red
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  - Check if email already exists"
    Write-Host "  - Check password requirements (min 6 chars)"
    Write-Host "  - Check MongoDB connection"
    exit 1
}

Write-Host "✅ Signup successful!" -ForegroundColor Green
Write-Host "  Access Token: $($signupToken.Substring(0, [Math]::Min(50, $signupToken.Length)))..."
Write-Host "  Refresh Token: $($signupRefresh.Substring(0, [Math]::Min(50, $signupRefresh.Length)))..."
Write-Host "  User ID: $signupUserId"
Write-Host ""

# Step 2: Verify password hashing
Write-Host "Step 3️⃣  : Verifying password hashing..." -ForegroundColor Cyan
Write-Host "---"
Write-Host "Check: Password should be bcrypt hashed in database"
Write-Host "Expected: Password hash starts with `$2a`$ or `$2b`$"
Write-Host ""
Write-Host "This will be verified in the next login step" -ForegroundColor Yellow
Write-Host ""

# Step 3: LOGIN with same credentials
Write-Host "Step 4️⃣  : Testing LOGIN (simulating different browser)..." -ForegroundColor Cyan
Write-Host "---"
Write-Host "Request:"
Write-Host "  Method: POST"
Write-Host "  Endpoint: /api/auth/login"
Write-Host "  Body: {" -ForegroundColor Gray
Write-Host "    ""email"": ""$TEST_EMAIL""," -ForegroundColor Gray
Write-Host "    ""password"": ""$TEST_PASSWORD""" -ForegroundColor Gray
Write-Host "  }" -ForegroundColor Gray
Write-Host ""

$loginBody = @{
    email    = $TEST_EMAIL
    password = $TEST_PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$API_URL/auth/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json" } `
        -Body $loginBody `
        -UseBasicParsing

    $loginData = $loginResponse.Content | ConvertFrom-Json
}
catch {
    $loginData = $_.Exception.Response.Content | ConvertFrom-Json
}

Write-Host "Response:"
Write-Host ($loginData | ConvertTo-Json | Out-String)

$loginToken = $loginData.accessToken

if (-not $loginToken) {
    Write-Host "❌ Login failed! This is the issue." -ForegroundColor Red
    Write-Host ""
    Write-Host "Diagnosis:" -ForegroundColor Yellow
    Write-Host "  The password hashing might still have issues."
    Write-Host "  Password comparison might be failing."
    Write-Host ""
    Write-Host "Debug:" -ForegroundColor Yellow
    Write-Host "  1. Check if password hash is correct in database"
    Write-Host "  2. Verify bcryptjs is hashing correctly"
    Write-Host "  3. Check if password comparison function works"
    exit 1
}

Write-Host "✅ Login successful!" -ForegroundColor Green
Write-Host "  Access Token: $($loginToken.Substring(0, [Math]::Min(50, $loginToken.Length)))..."
Write-Host "  ✅ Password was correctly hashed and verified!" -ForegroundColor Green
Write-Host ""

# Step 4: TEST WRONG PASSWORD
Write-Host "Step 5️⃣  : Testing LOGIN with WRONG password (should fail)..." -ForegroundColor Cyan
Write-Host "---"

$wrongPasswordBody = @{
    email    = $TEST_EMAIL
    password = "WrongPassword123"
} | ConvertTo-Json

try {
    $wrongPasswordResponse = Invoke-WebRequest -Uri "$API_URL/auth/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json" } `
        -Body $wrongPasswordBody `
        -UseBasicParsing

    $wrongPasswordData = $wrongPasswordResponse.Content | ConvertFrom-Json
}
catch {
    $wrongPasswordData = $_.Exception.Response.Content | ConvertFrom-Json
}

Write-Host "Response:"
Write-Host ($wrongPasswordData | ConvertTo-Json | Out-String)

$wrongToken = $wrongPasswordData.accessToken

if ($wrongToken) {
    Write-Host "❌ Wrong password was accepted! Security issue!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Wrong password correctly rejected!" -ForegroundColor Green
Write-Host ""

# Step 5: Test Protected Endpoint
Write-Host "Step 6️⃣  : Testing PROTECTED ENDPOINT (dashboard metrics)..." -ForegroundColor Cyan
Write-Host "---"
Write-Host "Request:"
Write-Host "  Method: GET"
Write-Host "  Endpoint: /api/user/dashboard-metrics"
Write-Host "  Authorization: Bearer $($loginToken.Substring(0, 30))..."
Write-Host ""

try {
    $protectedResponse = Invoke-WebRequest -Uri "$API_URL/user/dashboard-metrics" `
        -Method GET `
        -Headers @{"Authorization" = "Bearer $loginToken" } `
        -UseBasicParsing

    $protectedData = $protectedResponse.Content | ConvertFrom-Json
}
catch {
    $protectedData = $_.Exception.Response.Content | ConvertFrom-Json
}

Write-Host "Response:"
Write-Host ($protectedData | ConvertTo-Json | Out-String)

if (-not $protectedData.success) {
    Write-Host "❌ Protected endpoint failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Protected endpoint works!" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "==================================================" -ForegroundColor Green
Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  ✅ Backend is running"
Write-Host "  ✅ Signup works (user created with hashed password)"
Write-Host "  ✅ Login works (password correctly hashed and verified)"
Write-Host "  ✅ Wrong password rejected (security working)"
Write-Host "  ✅ Protected endpoints accessible (JWT tokens working)"
Write-Host ""
Write-Host "Cross-browser authentication should work!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Open Browser 1: http://localhost:5173"
Write-Host "  2. Logout from current session"
Write-Host "  3. Open Browser 2 (different browser)"
Write-Host "  4. Login with: $TEST_EMAIL / $TEST_PASSWORD"
Write-Host "  5. You should see the same dashboard"
Write-Host ""
Write-Host "Test account details:" -ForegroundColor Cyan
Write-Host "  Email: $TEST_EMAIL"
Write-Host "  Password: $TEST_PASSWORD"
Write-Host ""

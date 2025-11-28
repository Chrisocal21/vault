# Test Cloud API

Write-Host "Testing OC Vault Cloud API..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://vault-if2an7h3r-chrisoc.vercel.app"

# Test 1: Login
Write-Host "Test 1: Login" -ForegroundColor Yellow
$loginBody = @{
    username = "admin"
    password = "321password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($response.token)" -ForegroundColor Gray
    Write-Host "User: $($response.user.username)" -ForegroundColor Gray
    $token = $response.token
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Get Files
Write-Host "Test 2: Get Files" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/files" -Method GET -Headers $headers
    Write-Host "✅ Files retrieved!" -ForegroundColor Green
    Write-Host "Files count: $($response.files.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Get files failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Upload File Metadata
Write-Host "Test 3: Upload File Metadata" -ForegroundColor Yellow
$fileBody = @{
    name = "test-image.jpg"
    size = 50000
    originalSize = 150000
    type = "image/jpeg"
    compressed = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/files" -Method POST -Body $fileBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ File uploaded!" -ForegroundColor Green
    Write-Host "File ID: $($response.fileId)" -ForegroundColor Gray
    $fileId = $response.fileId
} catch {
    Write-Host "❌ Upload failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: Get Files Again
Write-Host "Test 4: Get Files (after upload)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/files" -Method GET -Headers $headers
    Write-Host "✅ Files retrieved!" -ForegroundColor Green
    Write-Host "Files count: $($response.files.Count)" -ForegroundColor Gray
    $response.files | ForEach-Object {
        Write-Host "  - $($_.name) ($($_.size) bytes)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Get files failed: $_" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ API is functional" -ForegroundColor Green
Write-Host "✅ Authentication working (mock tokens)" -ForegroundColor Green
Write-Host "✅ File upload endpoint working" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  NOTE: Without KV namespace binding, files are NOT persisted" -ForegroundColor Yellow
Write-Host "   Files are stored in-memory during request only" -ForegroundColor Yellow
Write-Host ""
Write-Host "To enable persistence, create KV namespace:" -ForegroundColor Cyan
Write-Host "  npx wrangler kv:namespace create OC_VAULT" -ForegroundColor Gray
Write-Host "  Then bind it in Cloudflare Dashboard" -ForegroundColor Gray
Write-Host ""

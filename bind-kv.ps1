# Quick script to bind KV namespace to Pages project
$accountId = "7accc8c4599bee1498e96c90d59e965c"
$token = "j_gan2cSsuJygOIqkvxeiAKkuzUhxBIa1CLpDsn1"
$projectName = "oc-vault"
$kvId = "8b08acb222ed48d58caba5fc32977895"

Write-Host "Binding KV namespace to Pages project..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get project settings
$getUrl = "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/$projectName"

try {
    $project = Invoke-RestMethod -Uri $getUrl -Method GET -Headers $headers
    Write-Host "✅ Found project: $projectName" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get project: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "⚠️  Note: KV binding must be configured in Cloudflare Dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Host "Go to:" -ForegroundColor Cyan
Write-Host "  https://dash.cloudflare.com/$accountId/pages/view/$projectName/settings/functions" -ForegroundColor Gray
Write-Host ""
Write-Host "Then:" -ForegroundColor Cyan
Write-Host "  1. Scroll to 'KV namespace bindings' section" -ForegroundColor Gray
Write-Host "  2. Click 'Add binding'" -ForegroundColor Gray
Write-Host "  3. Variable name: VAULT_KV" -ForegroundColor Gray
Write-Host "  4. KV namespace: OC_VAULT (8b08acb222ed48d58caba5fc32977895)" -ForegroundColor Gray
Write-Host "  5. Click 'Save'" -ForegroundColor Gray
Write-Host ""

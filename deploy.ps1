# OC Vault - Quick Deploy Script for Cloudflare Pages (PowerShell)
# Usage: .\deploy.ps1

Write-Host "🚀 OC Vault - Deploying to Cloudflare Pages..." -ForegroundColor Cyan
Write-Host ""

# Check if wrangler is installed
try {
    $null = Get-Command wrangler -ErrorAction Stop
} catch {
    Write-Host "❌ Wrangler CLI not found. Installing..." -ForegroundColor Red
    npm install -g wrangler
}

# Login check
Write-Host "🔐 Checking Cloudflare authentication..." -ForegroundColor Yellow
$loginCheck = wrangler whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔑 Please login to Cloudflare:" -ForegroundColor Yellow
    wrangler login
}

# Deploy
Write-Host ""
Write-Host "📦 Deploying to Cloudflare Pages..." -ForegroundColor Cyan
wrangler pages deploy . --project-name=oc-vault --branch=main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your site is live at: https://oc-vault.pages.dev" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Configure custom domain in Cloudflare dashboard"
    Write-Host "  2. Test on multiple devices"
    Write-Host "  3. Set up analytics"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed. Check the errors above." -ForegroundColor Red
    exit 1
}

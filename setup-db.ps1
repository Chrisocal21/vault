# Setup D1 Database for OC Vault (Windows)

Write-Host "🗄️  Setting up OC Vault D1 Database..." -ForegroundColor Cyan

# Apply schema to D1 database
Write-Host "📝 Applying database schema..." -ForegroundColor Yellow
npx wrangler d1 execute oc-vault-db --remote --file=./schema.sql

Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Database ID: e5284918-6980-4bfa-8059-c05a3ce6c5fd"
Write-Host "Binding name: DB"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Deploy to Cloudflare Pages: npm run deploy"
Write-Host "2. Test locally: npm run dev"

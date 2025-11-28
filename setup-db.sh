#!/bin/bash
# Setup D1 Database for OC Vault

echo "🗄️  Setting up OC Vault D1 Database..."

# Apply schema to D1 database
echo "📝 Applying database schema..."
npx wrangler d1 execute oc-vault-db --remote --file=./schema.sql

echo "✅ Database setup complete!"
echo ""
echo "Database ID: e5284918-6980-4bfa-8059-c05a3ce6c5fd"
echo "Binding name: DB"
echo ""
echo "Next steps:"
echo "1. Deploy to Cloudflare Pages: npm run deploy"
echo "2. Test locally: npm run dev"

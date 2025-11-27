#!/bin/bash

# OC Vault - Quick Deploy Script for Cloudflare Pages
# Usage: ./deploy.sh

echo "🚀 OC Vault - Deploying to Cloudflare Pages..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null
then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Login check
echo "🔐 Checking Cloudflare authentication..."
wrangler whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "🔑 Please login to Cloudflare:"
    wrangler login
fi

# Deploy
echo ""
echo "📦 Deploying to Cloudflare Pages..."
wrangler pages deploy . --project-name=oc-vault --branch=main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your site is live at: https://oc-vault.pages.dev"
    echo ""
    echo "Next steps:"
    echo "  1. Configure custom domain in Cloudflare dashboard"
    echo "  2. Test on multiple devices"
    echo "  3. Set up analytics"
    echo ""
else
    echo ""
    echo "❌ Deployment failed. Check the errors above."
    exit 1
fi

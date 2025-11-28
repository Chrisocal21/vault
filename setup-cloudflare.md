# Cloudflare Setup Guide for OC Vault

## ⚠️ Current Issue: 404 on /api/files

The API endpoints are returning 404 because **KV namespace binding is missing**.

## Quick Fix - Create KV Namespace

### Step 1: Create KV Namespace

```powershell
npx wrangler kv:namespace create "OC_VAULT"
```

This will output something like:
```
⛅️ wrangler 4.51.0
✨ Success! Created KV namespace OC_VAULT
 Add the following to your wrangler.toml:
 [[kv_namespaces]]
 binding = "OC_VAULT"
 id = "abc123xyz..."
```

### Step 2: Bind KV to Pages Project

Option A - Via Dashboard (Recommended):
1. Go to: https://dash.cloudflare.com/7accc8c4599bee1498e96c90d59e965c/pages/view/oc-vault/settings/functions
2. Scroll to **KV namespace bindings**
3. Click **Add binding**
   - Variable name: `VAULT_KV`
   - KV namespace: Select the one you just created (OC_VAULT)
4. Click **Save**

Option B - Via Wrangler:
```powershell
npx wrangler pages deployment create --project-name=oc-vault --kv VAULT_KV=YOUR_KV_ID
```

### Step 3: Update Functions Code

The Functions need to reference `env.VAULT_KV`. Let me check if that's already configured...

## Alternative: Use In-Memory Storage (Testing Only)

If you want to test without KV (data won't persist):

1. The current code has a fallback for missing KV
2. But we need to make sure it's actually being triggered
3. Check the Functions logs in Cloudflare Dashboard

## Environment Variables to Set

Go to: Pages → oc-vault → Settings → Environment Variables

Add these for **Production**:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=321password123
JWT_SECRET=dev_secret_change_in_production_12345
```

## Troubleshooting

### Check Functions Logs
1. Cloudflare Dashboard → Pages → oc-vault → Deployments
2. Click on latest deployment
3. Click **Functions** tab
4. View logs to see actual errors

### Test API Directly
```powershell
curl https://910d8509.oc-vault.pages.dev/api/auth/login -X POST -H "Content-Type: application/json" -d '{\"username\":\"admin\",\"password\":\"321password123\"}'
```

### Verify Functions Deployed
Check: https://910d8509.oc-vault.pages.dev/_worker.js
(Should show worker code if Functions are deployed)

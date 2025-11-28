# 🎉 Vercel Deployment Complete!

## Your URLs

**Production URL**: https://vault-ivory-eta.vercel.app

You can also check your Vercel dashboard for the exact production domain:
https://vercel.com/chrisoc/vault

## Testing Your Deployment

1. **Visit the production URL** in your browser
2. The app should load with all features
3. **Switch to Cloud Storage** mode in the dropdown
4. **Login** with:
   - Username: `admin`
   - Password: `321password123`
5. **Upload files** - they will work!

## ⚠️ Important Note About Storage

Vercel uses **in-memory storage** which means:
- ✅ Files persist within the same serverless function instance
- ❌ Files reset when the function "cold starts" (after ~5 minutes of inactivity)

### Upgrade to Persistent Storage (Recommended)

For production use, integrate **Vercel KV** (Redis):

```powershell
# Enable Vercel KV in your dashboard first, then:
npm install @vercel/kv
```

Then update your API functions to use `@vercel/kv` instead of `global.sessions` and `global.userFiles`.

## Custom Domain (Optional)

Add a custom domain in Vercel dashboard:
1. Go to: https://vercel.com/chrisoc/vault/settings/domains
2. Add your domain (e.g., vault.yourdomain.com)
3. Follow DNS setup instructions

## Environment Variables

Already configured:
- ✅ ADMIN_USERNAME = admin
- ✅ ADMIN_PASSWORD = 321password123
- ✅ JWT_SECRET = (set)

To update, go to:
https://vercel.com/chrisoc/vault/settings/environment-variables

## Local Development

Test locally with Vercel CLI:

```powershell
vercel dev
```

Then visit: http://localhost:3000

## Redeploy

Whenever you make changes:

```powershell
vercel --prod
```

## Questions?

- Check: https://vercel.com/docs
- Vercel KV: https://vercel.com/docs/storage/vercel-kv

# Security Configuration Guide

## ⚠️ IMPORTANT - Before Going to Production

### 1. Change Default Credentials

**Never use default credentials in production!**

Default credentials (for development only):
- Username: `admin`
- Password: `321password123`

### 2. Environment Variables Setup

#### For Cloudflare Pages Deployment:

1. Go to Cloudflare Dashboard
2. Navigate to: **Pages** → **oc-vault** → **Settings** → **Environment Variables**
3. Add these variables:

**Production:**
```
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=generate_a_long_random_string_here
```

**Preview (optional):**
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=test_password_123
JWT_SECRET=preview_secret_key
```

#### For Local Development:

Create a `.dev.vars` file (already gitignored):
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_dev_password
JWT_SECRET=dev_secret_key
```

### 3. Generate Secure JWT Secret

Use one of these methods:

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**PowerShell:**
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Online (use with caution):**
- https://randomkeygen.com/

### 4. Update Admin Panel Password

The admin panel (`admin.html`) also has hardcoded credentials. Update these:

Search for:
```javascript
if (username === 'admin' && password === '321password123')
```

Replace with environment-based check or remove the hardcoded values.

### 5. Enable HTTPS Only

In production, ensure:
- Cloudflare Pages automatically uses HTTPS
- Set `Strict-Transport-Security` headers
- Disable HTTP access

### 6. Rate Limiting (Recommended)

Add rate limiting to prevent brute force attacks:

```javascript
// In your Workers/Functions
const rateLimiter = new Map();

function checkRateLimit(ip) {
  const attempts = rateLimiter.get(ip) || 0;
  if (attempts > 5) {
    return false; // Too many attempts
  }
  rateLimiter.set(ip, attempts + 1);
  return true;
}
```

### 7. Additional Security Measures

- [ ] **2FA**: Implement two-factor authentication
- [ ] **Password Hashing**: Use bcrypt/Argon2 (not plain text)
- [ ] **Session Expiry**: Tokens expire after 7 days
- [ ] **CORS**: Configure allowed origins properly
- [ ] **Input Validation**: Sanitize all user inputs
- [ ] **File Upload Limits**: Restrict file sizes
- [ ] **Content-Type Validation**: Check uploaded file types
- [ ] **Malware Scanning**: Scan uploaded files (future)

## 🔒 Files That Should NEVER Be Committed

Already in `.gitignore`:
- `.env`
- `.env.local`
- `.env.production`
- `.dev.vars`
- `wrangler.toml.local`

## 📋 Security Checklist for Production

- [ ] Changed default admin credentials
- [ ] Set environment variables in Cloudflare
- [ ] Generated secure JWT secret
- [ ] Tested login with new credentials
- [ ] Removed any API keys from code
- [ ] Enabled HTTPS only
- [ ] Set up rate limiting
- [ ] Configured CORS properly
- [ ] Added input validation
- [ ] Set up error logging
- [ ] Created backup admin account
- [ ] Documented recovery process

## 🚨 If Credentials Are Compromised

1. Immediately change passwords in Cloudflare Dashboard
2. Rotate JWT secret
3. Invalidate all existing sessions
4. Review access logs
5. Notify affected users
6. Enable 2FA if not already enabled

## 📞 Security Contacts

- Report vulnerabilities: security@yourdomain.com
- Emergency contact: [Your contact method]

---

**Last Updated**: November 27, 2025  
**Review Frequency**: Every 3 months or after any security incident

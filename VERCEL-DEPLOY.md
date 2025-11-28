# Deploy to Vercel

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Chrisocal21/vault)

## Manual Deployment

### 1. Install Vercel CLI

```powershell
npm i -g vercel
```

### 2. Login to Vercel

```powershell
vercel login
```

### 3. Deploy

```powershell
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **oc-vault** (or your preferred name)
- Directory? **./** (current directory)
- Override settings? **N**

### 4. Set Environment Variables

After deployment, add environment variables:

```powershell
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
vercel env add JWT_SECRET
```

Or via dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `ADMIN_USERNAME` = your username
   - `ADMIN_PASSWORD` = your password
   - `JWT_SECRET` = random secret string

### 5. Production Deployment

```powershell
vercel --prod
```

## Project Structure

```
/api
  /auth
    login.js      - POST /api/auth/login
    logout.js     - POST /api/auth/logout
  /files
    [id].js       - DELETE /api/files/:id
  files.js        - GET/POST /api/files
index.html        - Main application
vercel.json       - Vercel configuration
```

## Storage Note

⚠️ **In-Memory Storage**: Vercel serverless functions use in-memory storage that resets on cold starts. For persistent storage, you'll need to integrate a database like:

- **Vercel KV** (Redis)
- **Vercel Postgres**
- **MongoDB Atlas**
- **PlanetScale**
- **Supabase**

### Upgrade to Vercel KV (Recommended)

1. Enable Vercel KV in your project dashboard
2. Update API functions to use `@vercel/kv`
3. Install package: `npm install @vercel/kv`

## API Endpoints

- `POST /api/auth/login` - Login and get token
- `POST /api/auth/logout` - Logout
- `GET /api/files` - List all files
- `POST /api/files` - Upload file metadata
- `DELETE /api/files/:id` - Delete file

## Development

Local development with Vercel CLI:

```powershell
vercel dev
```

This runs your Vercel functions locally at http://localhost:3000

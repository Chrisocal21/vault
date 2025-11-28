# OC Vault D1 Database Setup

## Database Information
- **Database ID**: `e5284918-6980-4bfa-8059-c05a3ce6c5fd`
- **Database Name**: `oc-vault-db`
- **Binding Name**: `DB`

## Quick Setup

### 1. Install Wrangler (if not already installed)
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Apply Database Schema
```bash
npm run setup-db
```

Or manually:
```bash
npx wrangler d1 execute oc-vault-db --remote --file=./schema.sql
```

## Database Schema

### Tables
1. **users** - User accounts and authentication
2. **files** - File metadata and storage info
3. **shared_links** - Shareable file links
4. **activity_log** - User activity tracking
5. **sessions** - Active user sessions

### Default Admin Account
- Username: `admin`
- Email: `admin@ocvault.com`
- Password: `321password123`
- Storage: 50GB

⚠️ **IMPORTANT**: Change the default admin password after first login!

## Local Development

### Run with local D1 database
```bash
npm run db:local
npx wrangler pages dev . --d1 DB=oc-vault-db
```

### Query the database
```bash
# Remote database
npm run db:query "SELECT * FROM users"

# Local database
npx wrangler d1 execute oc-vault-db --local --command "SELECT * FROM users"
```

## API Endpoints

All API endpoints are automatically available through Cloudflare Pages Functions:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Files
- `GET /api/files` - List user's files
- `POST /api/files` - Upload file metadata
- `DELETE /api/files/:id` - Delete file

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user

### Share Links
- `POST /api/share` - Create share link
- `GET /api/share/:token` - Access shared file

### Activity
- `GET /api/activity` - Get user activity log

## Production Deployment

1. **Setup R2 Bucket** (for file storage)
```bash
npx wrangler r2 bucket create oc-vault-files
```

2. **Deploy to Cloudflare Pages**
```bash
npm run deploy
```

3. **Update Environment Variables**
   - Go to Cloudflare Dashboard > Pages > oc-vault > Settings > Environment Variables
   - Add any required secrets (JWT_SECRET, etc.)

## Security Notes

⚠️ **Before Production:**
1. Replace simple password hashing with **bcrypt** or **Argon2**
2. Implement proper JWT token generation
3. Add rate limiting
4. Enable HTTPS only
5. Set up CORS properly
6. Add input validation and sanitization
7. Implement file upload size limits
8. Add malware scanning for uploaded files

## Troubleshooting

### Database connection errors
```bash
# Check database status
npx wrangler d1 info oc-vault-db

# List all databases
npx wrangler d1 list
```

### Reset database
```bash
# Delete all data (CAUTION!)
npx wrangler d1 execute oc-vault-db --remote --command "DROP TABLE users; DROP TABLE files; DROP TABLE shared_links; DROP TABLE activity_log; DROP TABLE sessions;"

# Reapply schema
npm run setup-db
```

## Next Steps

1. ✅ Database schema created
2. ✅ API endpoints defined
3. ⏳ Update frontend to use API
4. ⏳ Setup R2 storage for files
5. ⏳ Implement proper authentication
6. ⏳ Add file upload to R2
7. ⏳ Deploy to production

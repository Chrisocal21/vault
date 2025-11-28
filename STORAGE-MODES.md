# Storage Mode Guide - OC Vault

## Overview
OC Vault now supports **dual storage modes**: Local Storage and Cloud Storage. You can switch between them at any time using the dropdown in the navigation bar.

## 🗂️ Storage Modes

### 📱 Local Storage (Default)
- **How it works**: Files are stored in your browser's localStorage
- **Pros**:
  - ✅ No authentication required
  - ✅ Works offline
  - ✅ Instant access
  - ✅ No backend required
- **Cons**:
  - ❌ Limited to ~10MB total storage
  - ❌ Files deleted if you clear browser data
  - ❌ Not accessible from other devices
  - ❌ Not truly backed up

**Best for**: Testing, temporary files, quick prototyping

### ☁️ Cloud Storage (D1/R2)
- **How it works**: Files stored in Cloudflare D1 database and R2 storage
- **Pros**:
  - ✅ 5GB+ storage per user
  - ✅ Accessible from any device
  - ✅ True backup and recovery
  - ✅ Shareable links
  - ✅ Activity logging
- **Cons**:
  - ❌ Requires authentication
  - ❌ Requires internet connection
  - ❌ Requires Cloudflare backend setup

**Best for**: Production use, real backups, multi-device access

## 🔄 Switching Between Modes

### From the UI
1. Click the **Storage dropdown** in the navigation bar
2. Select **Local** or **Cloud (D1/R2)**
3. Confirm the switch if you have existing files

### Notes on Switching
- ⚠️ **Files are NOT automatically migrated** between storage modes
- Each mode maintains its own separate file collection
- You can manually re-upload files if switching permanently

## 🔐 Cloud Storage Setup

### Prerequisites
1. **D1 Database**: Already configured (ID: e5284918-6980-4bfa-8059-c05a3ce6c5fd)
2. **Authentication**: Login required before using cloud mode
3. **Cloudflare Account**: Deployed to Cloudflare Pages

### Activate Cloud Storage

1. **Setup Database**:
   ```powershell
   npm run setup-db
   ```

2. **Deploy to Cloudflare**:
   ```powershell
   npm run deploy
   ```

3. **Login to Vault**:
   - Default admin credentials:
     - Username: `admin`
     - Password: `321password123`

4. **Switch to Cloud Mode**:
   - Select "Cloud (D1/R2)" from storage dropdown
   - You'll now be using cloud storage!

## 📊 Current Status by Mode

### Local Storage
- ✅ Fully functional
- ✅ File upload/download/delete
- ✅ Image/video compression
- ✅ Search, sort, favorites
- ✅ All UI features working

### Cloud Storage  
- ✅ Database schema created
- ✅ API endpoints defined
- ✅ File metadata storage (D1)
- ⏳ R2 file upload (ready but needs testing)
- ⏳ Authentication system (needs login UI integration)
- ⏳ Share links implementation

## 🎯 Usage Examples

### Scenario 1: Quick Testing (Local)
```
1. Open vault
2. Drag & drop files
3. Files stored locally
4. Close browser - files persist until you clear browser data
```

### Scenario 2: Production Backup (Cloud)
```
1. Deploy to Cloudflare Pages
2. Setup D1 database
3. Login with credentials
4. Switch to Cloud mode
5. Upload files - stored in D1/R2
6. Access from any device with login
```

### Scenario 3: Hybrid Usage
```
1. Use Local mode for temporary/sensitive files
2. Use Cloud mode for important backups
3. Switch between modes as needed
4. Each mode has its own file collection
```

## 🔒 Security Notes

### Local Storage
- Files stored in browser's localStorage (base64 encoded)
- Cleared when browser cache is cleared
- Not encrypted (visible in DevTools)
- No authentication required

### Cloud Storage
- Files stored in Cloudflare R2 (encrypted at rest)
- Metadata in D1 database
- Requires authentication token
- Session-based access control
- Activity logging enabled

## 🚀 Future Enhancements

- [ ] Auto-sync between local and cloud
- [ ] Conflict resolution for duplicate files
- [ ] One-click migration tool
- [ ] Hybrid mode (cache cloud files locally)
- [ ] Background sync when online

## 📝 Developer Notes

### Key Files
- `index.html` - Frontend with dual storage support
- `functions/api/[[path]].js` - Cloud API endpoints
- `schema.sql` - D1 database schema
- `wrangler.toml` - Cloudflare configuration

### Storage Mode Variable
```javascript
let storageMode = localStorage.getItem('ocvault_storage_mode') || 'local';
```

### Switching Modes
```javascript
async function switchStorageMode() {
  // Handles mode switching with confirmation
  // Reloads files from new storage
  // Updates UI indicators
}
```

### API Integration
```javascript
// Cloud operations use fetch to API endpoints
await fetch('/api/files', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## ❓ FAQ

**Q: What happens to my files when I switch modes?**  
A: Each mode has separate storage. Files aren't migrated automatically.

**Q: Can I use cloud storage without authentication?**  
A: No, cloud storage requires login for security and user isolation.

**Q: How much storage do I get in local mode?**  
A: ~10MB depending on browser (localStorage limit).

**Q: How much storage do I get in cloud mode?**  
A: 5GB default quota per user (configurable by admin).

**Q: Are files compressed in both modes?**  
A: Yes! Image compression works in both local and cloud storage.

**Q: Can I export all files before switching?**  
A: Yes, use the "Export All" button to download a backup.

**Q: What happens if cloud storage is unavailable?**  
A: The app automatically falls back to local storage mode.

## 🎨 UI Indicators

- **Badge in header**: Shows current storage mode (📱 Local or ☁️ Cloud)
- **Description text**: Updates based on storage mode
- **Dropdown selector**: Always shows current mode
- **Upload confirmation**: Shows which storage was used

## 🛠️ Troubleshooting

### "Cloud storage unavailable" error
- Check internet connection
- Verify Cloudflare deployment
- Check D1 database status
- Ensure API endpoints are working

### "Please login to use cloud storage"
- Click Admin Panel to login
- Use admin credentials
- Token stored in localStorage
- Refresh page after login

### Files not appearing after switching
- This is normal - each mode has separate storage
- Re-upload files or use migration tool (coming soon)

---

**Current Version**: v2.0 (Dual Storage Support)  
**Last Updated**: November 27, 2025

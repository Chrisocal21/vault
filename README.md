# OC Vault

**Secure Personal File Storage Vault**

A dark-mode file storage application for personal use with admin controls for managing user accounts.

---

## 🚀 Quick Start

### Run Locally

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Features

- ✅ **Dark Mode** (toggle with sun/moon icon)
- ✅ **File Upload** (drag & drop, files, folders)
- ✅ **File Management** (list/grid view, download, delete)
- ✅ **Admin Panel** (create/manage user accounts)
- ✅ **Storage Stats** (track files, storage, media)
- ✅ **Responsive Design** (mobile, tablet, desktop)

---

## 📁 Pages

### Main Vault (`index.html`)
- Upload files, folders, photos, videos
- View files in list or grid view
- Download and delete files
- Real-time storage statistics
- Dark/light theme toggle

### Admin Panel (`admin.html`)
- Create new user accounts
- Manage existing users
- Set storage limits per user
- View system statistics
- Default admin account: `admin` / `admin123`

---

## 💾 Data Storage

Currently uses **localStorage** for demo purposes. Files metadata is stored locally.

**For production:**
- Replace localStorage with Cloudflare R2 for file storage
- Use Cloudflare D1 for user/metadata database
- Implement proper authentication (Cloudflare Access or JWT)
- Add file encryption at rest

### Read Full Documentation

See `OC-VAULT.md` for complete product specifications, architecture details, and development roadmap.

---

## 📁 Project Structure

```
vault/
├── index.html          # Landing page (ready to deploy)
├── OC-VAULT.md        # Complete product & architecture documentation
└── README.md          # This file
```

---

## 🎯 What is OC Vault?

OC Vault is a photographer-first cloud backup solution that provides:

- ✅ **Multi-device uploads** (mobile, tablet, desktop)
- ✅ **Intelligent compression** (save storage costs)
- ✅ **Project organization** (by shoot/client/location/date)
- ✅ **Offline capability** (PWA with background sync)
- ✅ **Desktop folder sync** (automatic backup)
- ✅ **EXIF metadata** (search by camera, lens, settings)
- ✅ **Secure sharing** (time-limited gallery links)

Built entirely on **Cloudflare's edge infrastructure** (Pages, Workers, R2, D1).

---

## 🚢 Deployment

### Deploy Landing Page to Cloudflare Pages

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - OC Vault landing page"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Workers & Pages** → **Create Application** → **Pages**
   - Connect your Git repository
   - Set build settings:
     - **Build command:** (leave empty)
     - **Build output directory:** `/`
     - **Root directory:** `/`
   - Click **Save and Deploy**

3. **Custom Domain (Optional)**
   - In Pages settings, add custom domain (e.g., `ocvault.com`)
   - Cloudflare automatically provisions SSL certificate

4. **Go Live!**
   - Your landing page is now live at `https://<project-name>.pages.dev`
   - Or your custom domain if configured

---

## 📋 Development Roadmap

### Phase 1: MVP (2-3 weeks)
- [ ] Basic authentication
- [ ] R2 bucket + Workers API
- [ ] File upload (single/multiple)
- [ ] Project management
- [ ] Thumbnail grid view
- [ ] D1 database setup
- [ ] PWA manifest + service worker

### Phase 2: Pro Features (3-4 weeks)
- [ ] Compression pipeline
- [ ] Per-project settings
- [ ] Collections & tagging
- [ ] EXIF extraction
- [ ] Advanced filters
- [ ] Mobile optimization

### Phase 3: Automation (2-3 weeks)
- [ ] Desktop folder sync (rclone)
- [ ] Background indexing
- [ ] Upload retry logic
- [ ] Push notifications

### Phase 4: Advanced (Ongoing)
- [ ] Client galleries
- [ ] Archiving rules
- [ ] Multi-user support
- [ ] Lightroom integration

See `OC-VAULT.md` for detailed feature specifications.

---

## 💰 Cost Estimates

**Cloudflare Pricing (for 1TB storage):**
- **Pages:** Free (500 builds/month)
- **Workers:** $0-5/month (100k requests/day free)
- **R2 Storage:** ~$15/month (1TB @ $0.015/GB)
- **Total:** ~$15-20/month

**Comparison:**
- Dropbox 2TB: $11.99/month (limited features)
- Google Drive 2TB: $9.99/month
- AWS S3 1TB: ~$23/month + egress fees

**OC Vault advantages:**
- Zero egress fees
- Full control & customization
- Photographer-specific features
- Scales affordably

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js / React / Svelte (your choice)
- **Styling:** Tailwind CSS + shadcn/ui
- **PWA:** Service Worker + Manifest

### Backend
- **API:** Cloudflare Workers (TypeScript)
- **Storage:** Cloudflare R2 (S3-compatible)
- **Database:** Cloudflare D1 (SQLite at edge)
- **Cache:** Cloudflare KV (optional)

### Tools
- **Image Processing:** `sharp` / `browser-image-compression`
- **Uploads:** `uppy` / native `fetch`
- **EXIF:** `exifr`
- **Desktop Sync:** `rclone` (Phase 3)

---

## 📖 Documentation

### Key Documents
- **`OC-VAULT.md`** — Complete product specification
  - Architecture diagrams
  - Data models
  - User workflows
  - Security considerations
  - Full feature roadmap

- **`index.html`** — Production-ready landing page
  - Hero section
  - Features showcase
  - How It Works
  - Pricing tiers
  - Call-to-action

---

## 🎨 Landing Page Features

The included `index.html` is production-ready with:

✅ **Responsive Design** — Mobile, tablet, desktop  
✅ **Modern UI** — Gradient backgrounds, smooth animations  
✅ **SEO Optimized** — Meta tags, semantic HTML  
✅ **Fast Loading** — No external dependencies (except fonts)  
✅ **Accessible** — Semantic markup, proper contrast  
✅ **Interactive** — Smooth scroll, hover effects, scroll animations  

### Sections Included:
1. **Hero** — Eye-catching value proposition
2. **Features** — 9 key features with icons
3. **How It Works** — 4-step onboarding flow
4. **Pricing** — 3 tiers (Free, Pro, Storage Add-on)
5. **CTA** — Final call-to-action
6. **Footer** — Links, resources, tech stack credits

---

## 🔒 Security Considerations

### Landing Page
- ✅ No external scripts (except Google Fonts)
- ✅ No tracking or analytics (add if needed)
- ✅ HTTPS enforced by Cloudflare
- ✅ CSP headers (configure in Pages settings)

### Future App
- Authentication via Cloudflare Access or custom JWT
- Private R2 buckets (signed URLs only)
- Row-level security in D1
- Rate limiting on uploads
- Time-limited share links

---

## 🎬 Next Steps

### To Go Live with Landing Page:
1. ✅ Review `index.html` — customize text, colors, branding
2. ✅ Add your logo/favicon (replace 🔒 emoji)
3. ✅ Deploy to Cloudflare Pages (see instructions above)
4. ✅ Configure custom domain
5. ✅ Test on mobile devices
6. ✅ Share with potential users for feedback

### To Start Building the App:
1. Read `OC-VAULT.md` — understand architecture
2. Set up Cloudflare account
3. Create R2 bucket + D1 database
4. Initialize Next.js/React project
5. Build Phase 1 MVP features
6. Deploy to Cloudflare Pages
7. Use your own product daily

---

## 📞 Support & Feedback

This is a personal project template. Customize it to fit your needs!

**Useful Resources:**
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

---

## 📄 License

This project template is provided as-is for personal or commercial use. Customize freely!

---

**Built for photographers who take their work seriously.** 🚀📷

*OC Vault — Never lose a shoot again.*

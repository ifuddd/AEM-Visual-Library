# 🚀 Start AEM Portal on Your Mac

**IMPORTANT:** Run these commands on YOUR Mac, not in the remote environment.

The remote container doesn't have:
- PostgreSQL database server
- Full npm package registry access
- Persistent node_modules

---

## ✅ Complete Startup Sequence

### Step 1: Pull Latest Changes

```bash
cd /Users/fadhlisheik/Documents/AEM-Visual-Library
git pull origin claude/plan-aem-library-01NwUfar18HqXNwKgK6wfgmD
```

**What you're getting:**
- ✅ `backend/prisma/seed.ts` - Complete seed with 18 components
- ✅ `backend/setup.sh` - Automated setup script
- ✅ `backend/.env.example` - Environment template
- ✅ `frontend/.env.local` example (may need to create)
- ✅ All bug fixes and improvements
- ✅ Complete documentation

---

### Step 2: Install Dependencies

```bash
# From project root
npm install --legacy-peer-deps
```

**This installs dependencies for:**
- Frontend (Next.js, React, MSAL)
- Backend (Express, Prisma, Azure SDKs)
- Shared (Common types)
- Sync Service (Azure Functions)

**Expected time:** 2-3 minutes

---

### Step 3: Setup Environment Files

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

The `.env` file should have:
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aem_portal
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Azure AD commented out for dev mode
# AZURE_AD_TENANT_ID=...
# AZURE_AD_CLIENT_ID=...
```

**Frontend (.env.local):**
```bash
cd ../frontend
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ENV=development

# Azure AD commented out for dev mode
# NEXT_PUBLIC_AZURE_AD_CLIENT_ID=...
# NEXT_PUBLIC_AZURE_AD_TENANT_ID=...
EOF
```

---

### Step 4: Start PostgreSQL

```bash
# Check if running
psql -U postgres -c "SELECT version();"

# If not running, start it
brew services start postgresql

# Or start manually
pg_ctl -D /usr/local/var/postgres start
```

---

### Step 5: Setup Database

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev

# Seed database (creates 18 components)
npx prisma db seed
```

**Expected output:**
```
🌱 Starting seed...
✅ Created admin user: admin@example.com
✅ Created sample users
📦 Creating components...
  ✅ Hero Banner (STABLE)
  ✅ CTA Button (STABLE)
  ✅ Card (STABLE)
  ... (15 more)
📦 Creating fragments...
  ✅ Article Content Fragment
  ✅ Product Experience Fragment
✅ Created patterns with component relationships
✅ Created sample sync log
🎉 Seed completed successfully!
```

**Verify:**
```bash
psql postgresql://postgres:postgres@localhost:5432/aem_portal \
  -c "SELECT COUNT(*) as total_components FROM \"Component\";"

# Should show: total_components = 18
```

---

### Step 6: Start Backend Server

**In Terminal 1:**
```bash
cd backend
npm run dev
```

**Expected output:**
```
⚠️  Development mode: Using mock authentication (Azure AD not configured)
🚨 Configure Azure AD before deploying to production!
✅ Created development admin user: dev@localhost

[server] Server started on port 4000
[server] Environment: development
[server] CORS enabled for: http://localhost:3000
```

**Keep this terminal running!**

---

### Step 7: Start Frontend Server

**In Terminal 2:**
```bash
cd frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 1.2s
```

**Browser console should show:**
```
⚠️  Development mode: Azure AD not configured
🚨 Configure Azure AD before deploying to production!
📝 See DEPLOYMENT_NOTES.md for setup instructions
```

**Keep this terminal running!**

---

### Step 8: Open in Browser

```bash
# Open browser automatically
open http://localhost:3000

# Or manually navigate to:
# http://localhost:3000
```

---

## ✅ Verification Checklist

### Backend Health Check
- [ ] Terminal shows "Server started on port 4000"
- [ ] No error messages
- [ ] Shows dev mode warning (expected)
- [ ] Shows "Created development admin user"

### Frontend Health Check
- [ ] Terminal shows "Ready in X.Xs"
- [ ] No compilation errors
- [ ] Browser opens to http://localhost:3000

### Application Check
- [ ] Page loads without errors
- [ ] No ChunkLoadError in browser console
- [ ] No 401 Unauthorized errors
- [ ] Click "Browse Components" button works

### Components Display
- [ ] Shows 18 components in grid view
- [ ] Component cards show titles and descriptions
- [ ] Thumbnail images display (placeholder images)
- [ ] Tags display correctly

### Functionality Check
- [ ] Search box works (type to filter)
- [ ] Tag filters work (click tags to filter)
- [ ] Click component card to view details
- [ ] Component details page loads
- [ ] Figma links display
- [ ] AEM metadata shows (dialog schema, etc.)
- [ ] Back button works

---

## 🎯 What You Should See

### Homepage
- Clean, modern UI
- "AEM Visual Portal" header
- "Browse Components" button
- Stats: "18 Components Available"

### Browse Components Page
- Grid of 18 component cards
- Each card shows:
  - Component title
  - Description
  - Status badge (STABLE/EXPERIMENTAL)
  - Tags
  - Thumbnail image

### Component Detail Page
- Full component metadata
- Figma design links
- AEM component path
- Dialog schema (JSON)
- Allowed children
- Limitations
- Screenshots (author/published views)

---

## 🐛 Troubleshooting

### "tsx: not found"
```bash
cd backend
npm install
npm run dev
```

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start if needed
brew services start postgresql

# Check connection
psql -U postgres -c "SELECT version();"
```

### "No components found"
```bash
# Database not seeded
cd backend
npx prisma db seed
```

### ChunkLoadError on frontend
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

### 401 Unauthorized errors
```bash
# Check backend .env
cd backend
cat .env | grep NODE_ENV
# Should show: NODE_ENV=development

# Restart backend
# Ctrl+C in backend terminal
npm run dev
```

### Port already in use
```bash
# Backend (port 4000)
lsof -ti:4000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

---

## 📊 Component List

All 18 components you should see:

**Basic (15):**
1. Hero Banner
2. CTA Button
3. Card
4. Navigation Header
5. Accordion
6. Tabs
7. Form Field
8. Image
9. Video Player
10. Breadcrumb
11. Footer
12. Text Block
13. Carousel
14. Modal
15. Alert

**Advanced Enterprise (3):**
16. Teaser
17. Section Container
18. Content List

---

## 🎉 Success!

When you see all 18 components in your browser, you've successfully:
- ✅ Set up the complete development environment
- ✅ Configured authentication bypass for local dev
- ✅ Seeded the database with production-ready components
- ✅ Started both backend and frontend servers
- ✅ Verified the application works end-to-end

---

## 📁 Quick Reference

**Start servers (after initial setup):**
```bash
# Terminal 1 - Backend
cd /Users/fadhlisheik/Documents/AEM-Visual-Library/backend
npm run dev

# Terminal 2 - Frontend
cd /Users/fadhlisheik/Documents/AEM-Visual-Library/frontend
npm run dev

# Browser
open http://localhost:3000
```

**Stop servers:**
- Press `Ctrl+C` in each terminal

**View database:**
```bash
cd backend
npx prisma studio
# Opens GUI at http://localhost:5555
```

**Re-seed database:**
```bash
cd backend
npx prisma db seed
# Safe to run multiple times (uses upsert)
```

---

**Created:** 2026-07-01  
**Branch:** claude/plan-aem-library-01NwUfar18HqXNwKgK6wfgmD  
**Documentation:** See `progress.md` for complete project status

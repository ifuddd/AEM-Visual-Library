# Database Seeding Instructions

You're getting the Prisma seed error because the `seed.ts` file doesn't exist on your Mac yet.

## ✅ Easiest Solution: Pull from Git

The seed.ts file already exists in the repository. Just pull it:

```bash
cd /Users/fadhlisheik/Documents/AEM-Visual-Library
git pull origin claude/plan-aem-library-01NwUfar18HqXNwKgK6wfgmD
```

This will download:
- ✅ `backend/prisma/seed.ts` (the file you need)
- ✅ Updated setup scripts
- ✅ All other fixes

## After Pulling, Run the Seed:

```bash
cd backend

# Option 1: Using Prisma (recommended)
npx prisma db seed

# Option 2: Using the package script
npm run prisma:seed

# Option 3: Using tsx directly
npx tsx prisma/seed.ts
```

## Expected Output:

```
🌱 Starting seed...
✅ Created admin user: admin@example.com
✅ Created sample users
📦 Creating components...
  ✅ Hero Banner (STABLE)
  ✅ CTA Button (STABLE)
  ✅ Card (STABLE)
  ✅ Navigation Header (STABLE)
  ✅ Accordion (STABLE)
  ✅ Tabs (STABLE)
  ✅ Form Field (STABLE)
  ✅ Image (STABLE)
  ✅ Video Player (STABLE)
  ✅ Breadcrumb (STABLE)
  ✅ Footer (STABLE)
  ✅ Text Block (STABLE)
  ✅ Carousel (EXPERIMENTAL)
  ✅ Modal (STABLE)
  ✅ Alert (STABLE)
  ✅ Teaser (STABLE)
  ✅ Section Container (STABLE)
  ✅ Content List (STABLE)
📦 Creating fragments...
  ✅ Article Content Fragment
  ✅ Product Experience Fragment
✅ Created patterns with component relationships
✅ Created sample sync log
🎉 Seed completed successfully!
```

## What Gets Created:

- **3 users** (admin, designer, developer)
- **18 components** (15 basic + 3 advanced enterprise components)
- **2 fragments** (content fragment, experience fragment)
- **2 patterns** (landing page, article layout)
- **1 sync log** (sample)

## Verify It Worked:

```bash
# Check the database
psql postgresql://postgres:postgres@localhost:5432/aem_portal -c "SELECT COUNT(*) FROM \"Component\";"

# Should show: count = 18
```

## If You Want to Re-Seed:

The seed uses `upsert`, so it's safe to run multiple times. It will update existing records instead of creating duplicates.

```bash
# Clear database and re-seed
cd backend
npx prisma migrate reset

# This will:
# - Drop all tables
# - Re-run migrations
# - Run seed automatically
```

## Troubleshooting:

### Error: "Cannot find module '@prisma/client'"
```bash
cd backend
npx prisma generate
npm run prisma:seed
```

### Error: "Cannot connect to database"
Make sure PostgreSQL is running:
```bash
# Mac:
brew services start postgresql

# Or check if it's running:
psql -U postgres -c "SELECT version();"
```

### Error: "tsx: command not found"
```bash
cd backend
npm install
npm run prisma:seed
```

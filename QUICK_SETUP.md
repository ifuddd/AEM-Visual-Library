# Quick Setup Guide - Run on Your Mac

## Step 1: Generate Prisma Client

```bash
cd /Users/fadhlisheik/Documents/AEM-Visual-Library/backend
npx prisma generate
```

## Step 2: Run Database Seed

```bash
npm run prisma:seed
```

You should see:
```
🌱 Starting seed...
✅ Created admin user: admin@example.com
✅ Created sample users
📦 Creating components...
  ✅ Hero Banner (STABLE)
  ✅ CTA Button (STABLE)
  ✅ Card (STABLE)
  ... (15 more components)
  ✅ Teaser (STABLE)
  ✅ Section Container (STABLE)
  ✅ Content List (STABLE)
🎉 Seed completed successfully!
```

## Step 3: Refresh Your Browser

Go to: http://localhost:3000

You should now see **18 components** in the catalog!

---

## If Seed Fails

### Issue: "Cannot find module @prisma/client"

Run:
```bash
cd backend
npm install
npx prisma generate
npm run prisma:seed
```

### Issue: "Database connection error"

Check your `.env` file has:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aem_portal
```

And PostgreSQL is running.

### Issue: "tsx not found"

Install dependencies:
```bash
cd backend
npm install
```

---

## Verify Components in Database

Optional - Open Prisma Studio to see the data:
```bash
cd backend
npx prisma studio
```

Opens at: http://localhost:5555

Navigate to the `Component` table - you should see 18 rows!

---

## Next: Test the Portal

1. Backend should be running: `npm run dev`
2. Frontend should be running: `npm run dev` (in frontend folder)
3. Open: http://localhost:3000
4. Click "Browse Components"
5. Should see all 18 components! ✅

---

## Component Breakdown (18 Total)

### Basic Components (15)
- Hero Banner, CTA Button, Card
- Navigation Header, Accordion, Tabs
- Form Field, Image, Video Player
- Breadcrumb, Footer, Text Block
- Carousel, Modal, Alert

### Advanced Components (3)
- **Teaser** - Content promotion
- **Section Container** - Layout with backgrounds
- **Content List** - Dynamic content aggregation

---

**Run these commands on your Mac now!** 🚀

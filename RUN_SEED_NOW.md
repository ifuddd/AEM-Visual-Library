# 🌱 RUN SEED NOW - Simple Steps

## ✅ Run These Commands on Your Mac

### Option 1: Direct Node.js Seed (EASIEST)

```bash
# 1. Navigate to backend folder
cd /Users/fadhlisheik/Documents/AEM-Visual-Library/backend

# 2. Install PostgreSQL client
npm install pg

# 3. Run the seed
node seed-direct.js
```

**Expected Output:**
```
🌱 Starting direct database seed...

👥 Creating users...
  ✅ Created 3 users

📦 Creating 18 components...
  ✅ Hero Banner (STABLE)
  ✅ CTA Button (STABLE)
  ✅ Card (STABLE)
  ... (15 more)

✅ Seed completed successfully!

📊 Summary:
  - 3 users created
  - 18 components created
  - 15 basic components (Hero, Button, Card, etc.)
  - 3 advanced components (Teaser, Section Container, Content List)

🎉 Database is ready! Refresh your browser to see components.
```

### Option 2: SQL File (if Option 1 fails)

```bash
# If you have psql installed
cd /Users/fadhlisheik/Documents/AEM-Visual-Library/backend
psql postgresql://postgres:postgres@localhost:5432/aem_portal < seed.sql
```

---

## 🎯 After Running Seed

### 1. Refresh Your Browser

Open: **http://localhost:3000**

### 2. You Should See:

- **18 Components** in the catalog
- Search bar working
- Filters (Status, Tags, Team)
- No more "No components found" message

### 3. Test It Out:

**Search for "hero":**
- Should show "Hero Banner" and "Teaser" (has hero variant)

**Filter by STABLE:**
- Should show 17 components (all except Carousel)

**Filter by "core-component" tag:**
- Should show 3 advanced components

**Click on "Teaser":**
- Should show full component details
- Figma links
- AEM metadata
- Developer/Designer/Documentation tabs

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'pg'"

**Solution:**
```bash
cd backend
npm install pg
node seed-direct.js
```

### Error: "Connection refused"

**Check PostgreSQL is running:**
```bash
# Check if PostgreSQL is running
psql --version
psql -U postgres -l
```

**If not running, start it:**
```bash
# macOS with Homebrew:
brew services start postgresql

# Or check if using Postgres.app
```

### Error: "relation does not exist"

**Run Prisma migrations first:**
```bash
cd backend
npx prisma migrate dev
# Then run seed again
node seed-direct.js
```

### Success but no components showing

**Check backend logs:**
- Should show dev mode warnings
- Check for any errors

**Verify database:**
```bash
cd backend
npx prisma studio
```
- Open http://localhost:5555
- Click "Component" table
- Should see 18 rows

---

## ✅ Verification Checklist

After running seed:

- [ ] Seed script completed successfully
- [ ] No errors in terminal
- [ ] Browser shows components (not "No components found")
- [ ] Can search for components
- [ ] Can filter components
- [ ] Can click on component to see details
- [ ] All 18 components visible

---

## 📊 Component Breakdown

### Basic Components (15)
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
13. Carousel (EXPERIMENTAL)
14. Modal
15. Alert

### Advanced Components (3)
16. **Teaser** - Content promotion component
17. **Section Container** - Layout with backgrounds
18. **Content List** - Dynamic content aggregation

---

## 🎉 Once Working

You'll have:
- ✅ 18 fully documented AEM components
- ✅ Complete Figma integration examples
- ✅ Search and filtering
- ✅ All 12 bugs fixed
- ✅ Dev authentication bypass working
- ✅ Production-ready portal

---

**Run the seed now and enjoy your AEM Visual Portal!** 🚀

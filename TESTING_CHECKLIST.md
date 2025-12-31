# Production Testing Checklist

After running the seed script, verify all fixes and features are working correctly.

---

## 🎯 Test 1: Database Seed Verification

### Run the seed:
```bash
cd backend
npm run prisma:seed
```

### Expected Output:
```
🌱 Starting seed...
✅ Created admin user: admin@example.com
✅ Created sample users
📦 Creating components...
  ✅ Hero Banner (STABLE)
  ✅ CTA Button (STABLE)
  ... (16 more)
🎉 Seed completed successfully!
```

### Verify in Prisma Studio:
```bash
npx prisma studio
```

**Check**:
- [ ] 18 components in Component table
- [ ] 3 users (admin, designer, developer)
- [ ] 2 fragments
- [ ] 2 patterns
- [ ] 1 sync log

---

## 🔧 Test 2: Bug Fixes Verification

### Bug #1: Route Order Conflict (CRITICAL)

**Test**: Access component by slug
```bash
curl http://localhost:4000/api/components/slug/hero-banner
```

**Expected**: Returns hero-banner component details (not 404)

**File**: `backend/src/routes/components.routes.ts:61-66`

- [ ] PASS: Slug route works
- [ ] PASS: ID route still works (`/api/components/{uuid}`)

---

### Bug #2: Invalid Prisma Query (CRITICAL)

**Test**: Filter components by tags
```bash
curl "http://localhost:4000/api/components?tags=marketing"
```

**Expected**: Returns components tagged with "marketing"

**File**: `backend/src/services/component.service.ts:39-42`

- [ ] PASS: Tag filtering works
- [ ] PASS: Multiple tags work (`tags=marketing,layout`)
- [ ] PASS: Returns correct components

---

### Bug #3: React Hook Infinite Loop (HIGH)

**Test**: Open browser and type in search box

**Expected**: No console errors, smooth typing

**File**: `frontend/src/components/catalog/SearchBar.tsx:12-23`

- [ ] PASS: No infinite re-renders
- [ ] PASS: Debounce works (300ms delay)
- [ ] PASS: Search results update correctly

---

### Bug #4: localStorage SSR Issue (HIGH)

**Test**: Refresh the page

**Expected**: No SSR errors in console

**File**: `frontend/src/lib/api.ts:14-20`

- [ ] PASS: No "localStorage is not defined" error
- [ ] PASS: Page loads correctly
- [ ] PASS: Authentication still works

---

### Bug #5: Joi Validation Schema (MEDIUM)

**Test**: Update a component via API
```bash
curl -X PUT http://localhost:4000/api/components/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

**Expected**: Update succeeds

**File**: `backend/src/routes/components.routes.ts:59-73`

- [ ] PASS: Partial updates work
- [ ] PASS: Validation errors are clear
- [ ] PASS: All fields optional in update

---

### Bug #6 & #8: Prisma Serverless Pattern (MEDIUM)

**Test**: Run sync service
```bash
cd sync-service
npx tsx WikiSyncTimer/index.ts
```

**Expected**: No connection pool errors

**File**: `sync-service/WikiSyncTimer/index.ts:14-23`

- [ ] PASS: Singleton pattern works
- [ ] PASS: Warm starts reuse connection
- [ ] PASS: No disconnect errors

---

### Bug #7: Prisma Error Handling (MEDIUM)

**Test**: Update non-existent component
```bash
curl -X PUT http://localhost:4000/api/components/non-existent-id \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
```

**Expected**: Returns 404 with clear message

**File**: `backend/src/services/component.service.ts:124-133`

- [ ] PASS: Returns 404 status
- [ ] PASS: Error message: "Component not found"
- [ ] PASS: No unhandled Prisma errors

---

### Bug #9: CORS Preflight (MEDIUM)

**Test**: Check CORS headers
```bash
curl -I -X OPTIONS http://localhost:4000/api/components \
  -H "Origin: http://localhost:3000"
```

**Expected**: Correct CORS headers

**File**: `backend/src/server.ts:34-41`

- [ ] PASS: Access-Control-Allow-Origin present
- [ ] PASS: Access-Control-Allow-Methods includes GET, POST, PUT, DELETE
- [ ] PASS: Access-Control-Allow-Headers includes Authorization
- [ ] PASS: Access-Control-Max-Age set to 86400

---

### Bug #10: Environment Validation (LOW)

**Test**: Run sync service without env vars
```bash
cd sync-service
AZURE_DEVOPS_ORG= npx tsx WikiSyncTimer/index.ts
```

**Expected**: Clear error about missing variables

**File**: `sync-service/WikiSyncTimer/index.ts:25-32`

- [ ] PASS: Lists missing variables
- [ ] PASS: Fails before attempting connection
- [ ] PASS: Error message is clear

---

### Bug #11: State Sync in SearchBar (LOW)

**Test**:
1. Type search term
2. Apply filter
3. Click "Clear filters"

**Expected**: Search box clears

**File**: `frontend/src/components/catalog/SearchBar.tsx:7-11`

- [ ] PASS: Search box syncs with prop
- [ ] PASS: Clear filters resets search
- [ ] PASS: External updates reflected

---

### Bug #12: Error Boundary (LOW)

**Test**: Trigger an error in React (throw in component)

**Expected**: Error boundary catches and shows error page

**File**: `frontend/src/components/ErrorBoundary.tsx:1-40`

- [ ] PASS: Error boundary catches errors
- [ ] PASS: Shows error message
- [ ] PASS: Refresh button works
- [ ] PASS: Logs error to console

---

## 🎨 Test 3: Component Display

### Test: Browse Components Page

**Open**: http://localhost:3000

**Expected Components (18 total)**:

#### Basic Components (15)
- [ ] Hero Banner
- [ ] CTA Button
- [ ] Card
- [ ] Navigation Header
- [ ] Accordion
- [ ] Tabs
- [ ] Form Field
- [ ] Image
- [ ] Video Player
- [ ] Breadcrumb
- [ ] Footer
- [ ] Text Block
- [ ] Carousel (EXPERIMENTAL)
- [ ] Modal
- [ ] Alert

#### Advanced Components (3)
- [ ] Teaser
- [ ] Section Container
- [ ] Content List

---

### Test: Component Details

**Click on**: Teaser component

**Expected**:
- [ ] Title: "Teaser"
- [ ] Description visible
- [ ] Tags: content, marketing, promotion, core-component, responsive, author-editable
- [ ] Status: STABLE
- [ ] Owner: Creative Development
- [ ] Figma links (3): All displayed
- [ ] Figma embed: First link embedded
- [ ] AEM metadata: Dialog schema, limitations shown
- [ ] Tabs: Developer, Designer, Documentation

---

### Test: Search

**Type**: "hero"

**Expected**:
- [ ] Hero Banner appears
- [ ] Teaser appears (has "hero" variant)
- [ ] Other components hidden
- [ ] Results update as you type (debounced)

---

### Test: Filter by Status

**Check**: STABLE checkbox

**Expected**:
- [ ] 17 components shown (all except Carousel)
- [ ] Count updates

**Check**: EXPERIMENTAL checkbox

**Expected**:
- [ ] 1 component shown (Carousel)

---

### Test: Filter by Tags

**Click**: "core-component" tag

**Expected**:
- [ ] 3 components shown (Teaser, Section Container, Content List)
- [ ] All tagged with "core-component"

---

### Test: Filter by Team

**Select**: "Creative Development"

**Expected**:
- [ ] 3 advanced components shown
- [ ] All owned by Creative Development team

---

## 🔐 Test 4: Authentication (Dev Mode)

### Test: Dev Auth Bypass

**Check backend logs**:
```
⚠️  Development mode: Using mock authentication (Azure AD not configured)
🚨 Configure Azure AD before deploying to production!
✅ Created development admin user: dev@localhost
```

**Expected**:
- [ ] Warning logs present
- [ ] No Azure AD errors
- [ ] API requests work without token
- [ ] User: dev@localhost (ADMIN role)

---

### Test: User Creation

**Check Prisma Studio**: User table

**Expected users**:
- [ ] dev@localhost (ADMIN) - development user
- [ ] admin@example.com (ADMIN) - seed user
- [ ] designer@example.com (CONTRIBUTOR)
- [ ] developer@example.com (DOC_OWNER)

---

## 📊 Test 5: Figma Integration

### Test: Figma Links Display

**Open**: Any component detail page

**Expected**:
- [ ] Figma links section visible
- [ ] "Open in Figma" buttons work
- [ ] Links open in new tab
- [ ] Full URL displayed

---

### Test: Figma Embed

**Open**: Hero Banner component

**Expected**:
- [ ] Embedded iframe present
- [ ] Shows Figma file preview
- [ ] Note: May not load if Figma file is private/example

---

## 🚀 Test 6: Performance

### Test: Page Load

**Refresh**: http://localhost:3000

**Expected**:
- [ ] Loads in < 3 seconds
- [ ] No console errors
- [ ] No network errors
- [ ] Images load (placeholders)

---

### Test: Search Performance

**Type**: Random search term

**Expected**:
- [ ] Debounced (300ms delay)
- [ ] No lag
- [ ] Smooth typing
- [ ] Quick results

---

### Test: API Response Time

```bash
time curl http://localhost:4000/api/components
```

**Expected**:
- [ ] Response < 500ms
- [ ] Returns all 18 components
- [ ] Proper pagination

---

## 🎯 Test 7: Edge Cases

### Test: Empty Search

**Type**: "zzzzzzz"

**Expected**:
- [ ] "No components found" message
- [ ] "Clear filters" button visible
- [ ] No errors

---

### Test: Invalid Component ID

```bash
curl http://localhost:4000/api/components/invalid-id
```

**Expected**:
- [ ] 404 status
- [ ] Clear error message
- [ ] No crash

---

### Test: Large Tag List

**Select**: Multiple tags

**Expected**:
- [ ] Filters combine correctly (OR logic)
- [ ] Performance remains good
- [ ] Results accurate

---

## ✅ Final Verification

### All Systems Check

- [ ] **Backend**: Running without errors
- [ ] **Frontend**: Running without errors
- [ ] **Database**: Contains 18 components
- [ ] **Authentication**: Dev mode working
- [ ] **Components**: All 18 display correctly
- [ ] **Search**: Works with debounce
- [ ] **Filters**: Status, tags, team all work
- [ ] **Details**: Component pages load
- [ ] **Figma**: Links and embeds present
- [ ] **Bug Fixes**: All 12 verified
- [ ] **Performance**: Fast and responsive
- [ ] **No Console Errors**: Clean browser console
- [ ] **No Server Errors**: Clean server logs

---

## 🐛 If Tests Fail

### Components Not Showing

**Check**:
1. Seed script ran successfully
2. Database has 18 components
3. Backend is running
4. No console errors

**Fix**: Re-run seed script

---

### 401 Unauthorized Errors

**Check**:
1. `.env` file exists in backend
2. `NODE_ENV=development`
3. Backend logs show dev mode warnings

**Fix**: See DEPLOYMENT_NOTES.md

---

### Filters Not Working

**Check**:
1. Frontend making API calls
2. Network tab shows requests
3. No CORS errors

**Fix**: Check CORS config in `backend/src/server.ts`

---

### Search Not Working

**Check**:
1. No infinite loop errors
2. SearchBar component loaded
3. onChange callback firing

**Fix**: Check Bug #3 fix in SearchBar.tsx

---

## 📝 Test Report Template

```
Date: ___________
Tester: ___________

DATABASE SEED: ☐ PASS ☐ FAIL
BUG FIXES (12): ☐ PASS ☐ FAIL
COMPONENT DISPLAY: ☐ PASS ☐ FAIL
AUTHENTICATION: ☐ PASS ☐ FAIL
FIGMA INTEGRATION: ☐ PASS ☐ FAIL
PERFORMANCE: ☐ PASS ☐ FAIL
EDGE CASES: ☐ PASS ☐ FAIL

ISSUES FOUND:
1. _________________________
2. _________________________

OVERALL: ☐ READY FOR USE ☐ NEEDS FIXES
```

---

**Run through this checklist after seeding the database!** ✅

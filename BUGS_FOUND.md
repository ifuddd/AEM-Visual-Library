# Bug Report - AEM Visual Portal

## Critical Bugs (Must Fix)

### 🔴 Bug #1: Route Order Conflict in Components Routes
**File:** `backend/src/routes/components.routes.ts`
**Lines:** 113-136
**Severity:** CRITICAL

**Issue:**
The route `GET /api/components/:id` (line 113) is defined BEFORE `GET /api/components/slug/:slug` (line 136). Express matches routes in order, so requests to `/api/components/slug/hero-banner` will be caught by the `/:id` route, treating "slug" as the component ID.

**Impact:**
- Frontend cannot fetch components by slug
- Component detail page will break
- 404 errors when navigating to `/component/[slug]`

**Fix:**
Move the `/slug/:slug` route BEFORE the `/:id` route:
```typescript
// Move this route before /:id
router.get('/slug/:slug', authenticate, async (req, res) => { ... });

// Then define /:id route
router.get('/:id', authenticate, async (req, res) => { ... });
```

---

### 🔴 Bug #2: Invalid Prisma Query for Tags Filter
**File:** `backend/src/services/component.service.ts`
**Lines:** 38-42
**Severity:** CRITICAL

**Issue:**
The code uses `array_contains` operator which doesn't exist in Prisma for JSON fields:
```typescript
where.tags = {
  array_contains: filters.tags,
} as any;
```

**Impact:**
- Tag filtering will fail at runtime
- Database errors when using filters
- Search functionality broken

**Fix:**
For PostgreSQL with JSON fields, use raw query or change approach:
```typescript
// Option 1: Use Prisma's json operators
if (filters.tags && filters.tags.length > 0) {
  where.tags = {
    path: '$',
    array_contains: filters.tags
  };
}

// Option 2: Better - use raw SQL for complex JSON queries
const components = await prisma.$queryRaw`
  SELECT * FROM "Component"
  WHERE tags::jsonb ?| ARRAY[${filters.tags.join(',')}]
`;
```

**Alternative Fix:**
Change Prisma schema to use native array type instead of JSON:
```prisma
tags  String[]  // Instead of Json
```

---

### 🟡 Bug #3: React Hook Dependency Issue in SearchBar
**File:** `frontend/src/components/catalog/SearchBar.tsx`
**Lines:** 14-20
**Severity:** HIGH

**Issue:**
The `useEffect` includes `onChange` in dependencies, which is recreated on every parent render, causing infinite re-renders:
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    onChange(localValue);
  }, 300);
  return () => clearTimeout(timer);
}, [localValue, onChange]); // ❌ onChange causes infinite loop
```

**Impact:**
- Infinite re-renders when typing in search
- Performance degradation
- Excessive API calls

**Fix:**
Use `useCallback` in parent or remove `onChange` from dependencies:
```typescript
// Option 1: Remove from deps (use ESLint disable if needed)
useEffect(() => {
  const timer = setTimeout(() => {
    onChange(localValue);
  }, 300);
  return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [localValue]);

// Option 2: Use useCallback in parent component (catalog/page.tsx)
const handleFilterChange = useCallback((newFilters: ComponentFilters) => {
  setFilters(newFilters);
  setPage(1);
}, []);
```

---

### 🟡 Bug #4: localStorage Access During SSR
**File:** `frontend/src/lib/api.ts`
**Lines:** 21-27
**Severity:** HIGH

**Issue:**
The axios interceptor accesses `localStorage` which doesn't exist during server-side rendering in Next.js:
```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // ❌ Fails on server
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Impact:**
- API calls fail during SSR
- Hydration errors
- Authentication broken on initial page load

**Fix:**
Check if running in browser:
```typescript
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

---

### 🟡 Bug #5: Joi Schema .fork() Syntax Issue
**File:** `backend/src/routes/components.routes.ts`
**Line:** 182
**Severity:** MEDIUM

**Issue:**
The `.fork()` method syntax is complex and may not work as intended:
```typescript
validate({
  body: componentInputSchema.fork(
    Object.keys(componentInputSchema.describe().keys),
    (schema) => schema.optional()
  )
})
```

**Impact:**
- Validation may fail
- Update endpoint might reject valid requests
- Hard to debug validation errors

**Fix:**
Create a separate update schema:
```typescript
const componentUpdateSchema = Joi.object({
  slug: Joi.string().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  // ... all fields as optional
});

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.DOC_OWNER, UserRole.ADMIN),
  validate({ body: componentUpdateSchema }),
  async (req, res) => { ... }
);
```

---

### 🟡 Bug #6: Prisma Client in Serverless Function
**File:** `sync-service/WikiSyncTimer/index.ts`
**Line:** 13
**Severity:** MEDIUM

**Issue:**
Prisma client is instantiated globally in serverless function:
```typescript
const prisma = new PrismaClient();
```

**Impact:**
- Connection pooling issues in Azure Functions
- Potential connection leaks
- Cold start performance degradation
- Database connection limits exceeded

**Fix:**
Use singleton pattern with connection management:
```typescript
let prisma: PrismaClient;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// In the function:
const timerTrigger: AzureFunction = async function (context: Context) {
  const client = getPrismaClient();
  try {
    // Use client...
  } finally {
    // Don't disconnect in serverless - reuse connection
  }
};
```

Better approach - use Prisma Data Proxy or connection pooling.

---

## Medium Priority Bugs

### 🟠 Bug #7: Missing Error Handler for Prisma Not Found
**File:** `backend/src/services/component.service.ts`
**Lines:** 109-113
**Severity:** MEDIUM

**Issue:**
The `updateComponent` method doesn't handle the case where the component doesn't exist. Prisma will throw `RecordNotFound` error which won't be caught properly.

**Fix:**
```typescript
async updateComponent(id: string, input: Partial<ComponentInput>): Promise<Component> {
  try {
    const component = await prisma.component.update({
      where: { id },
      data: { ... }
    });
    return this.mapToComponent(component);
  } catch (error: any) {
    if (error.code === 'P2025') { // Prisma RecordNotFound
      throw new ApiError('Component not found', 404, 'NOT_FOUND');
    }
    throw error;
  }
}
```

---

### 🟠 Bug #8: Missing Prisma Disconnect in Sync Function
**File:** `sync-service/WikiSyncTimer/index.ts`
**Line:** 79
**Severity:** MEDIUM

**Issue:**
The `prisma.$disconnect()` is called in `finally` block, but if the function is reused (warm start), the connection is closed and subsequent calls will fail.

**Fix:**
Don't disconnect in serverless functions - let connection be reused:
```typescript
} finally {
  // Don't disconnect - keep connection warm for reuse
  // await prisma.$disconnect();
}
```

---

### 🟠 Bug #9: Missing CORS Preflight Handling
**File:** `backend/src/server.ts`
**Lines:** 26-29
**Severity:** MEDIUM

**Issue:**
CORS is configured but doesn't explicitly handle OPTIONS preflight requests for complex requests (with Authorization headers).

**Fix:**
Add explicit OPTIONS handling or verify CORS options:
```typescript
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## Low Priority Issues

### 🟢 Bug #10: Missing Input Validation in Sync Service
**File:** `sync-service/WikiSyncTimer/index.ts`
**Severity:** LOW

**Issue:**
No validation that required environment variables are set. Function will fail at runtime if config is missing.

**Fix:**
Add startup validation:
```typescript
function validateConfig() {
  const required = ['AZURE_DEVOPS_ORG', 'AZURE_DEVOPS_PROJECT', 'AZURE_DEVOPS_PAT'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
```

---

### 🟢 Bug #11: No Loading State Sync
**File:** `frontend/src/components/catalog/SearchBar.tsx`
**Severity:** LOW

**Issue:**
When `value` prop changes from parent, local state doesn't sync. If parent resets filters, search bar won't clear.

**Fix:**
Add effect to sync with prop:
```typescript
useEffect(() => {
  setLocalValue(value);
}, [value]);
```

---

### 🟢 Bug #12: Missing Error Boundary
**Files:** All frontend components
**Severity:** LOW

**Issue:**
No error boundaries in React app. If any component crashes, entire app white screens.

**Fix:**
Add error boundary in `frontend/src/app/layout.tsx`:
```typescript
'use client';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <pre className="text-sm text-red-600">{error.message}</pre>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## Additional Issues to Consider

### Missing Features / TODOs:
1. **No rate limiting** on API endpoints
2. **No request logging** for security audit
3. **Missing API response caching** (Redis/memory cache)
4. **No database indexes verification** (should run EXPLAIN on queries)
5. **Missing TypeScript strict null checks** in some places
6. **No retry logic** for Azure DevOps API failures
7. **Missing comprehensive error messages** for users
8. **No telemetry/metrics** collection
9. **Missing health check** for database connection
10. **No graceful degradation** if Wiki is unavailable

---

## Summary

**Critical Bugs:** 2
**High Priority:** 2
**Medium Priority:** 5
**Low Priority:** 3

**Recommended Fix Order:**
1. Bug #1 (Route order) - Breaks core functionality
2. Bug #2 (Tags filter) - Breaks search
3. Bug #4 (localStorage SSR) - Breaks auth
4. Bug #3 (React hook) - Performance issue
5. Bug #5, #6, #7 (Validation & DB)
6. Bug #8, #9 (Connection management)
7. Bugs #10-12 (Polish & resilience)

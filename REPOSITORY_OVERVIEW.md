# AEM Visual Library - Comprehensive Repository Overview

## 1. PROJECT OVERVIEW

**Project Name:** AEM Visual Portal
**Description:** A visual, designer-friendly portal that maps Adobe Experience Manager (AEM) components, fragments, and patterns to developer documentation stored in Azure DevOps Wiki.

**Repository Structure:** Monorepo with 4 main packages:
- Frontend (Next.js 14)
- Backend (Express.js with Node.js)
- Sync Service (Azure Functions)
- Shared (Common TypeScript types)

---

## 2. OVERALL PROJECT LAYOUT

```
AEM-Visual-Library/
├── frontend/                 # Next.js web application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── catalog/     # Component catalog page
│   │   │   └── component/[slug]/  # Component detail page
│   │   ├── components/      # React components
│   │   │   ├── catalog/     # SearchBar, FilterPanel, ComponentCard, Pagination
│   │   │   ├── detail/      # ComponentTabs, PreviewTab, DesignerTab, etc.
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Providers.tsx
│   │   └── lib/
│   │       └── api.ts       # API client with axios
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── postcss.config.js
│
├── backend/                 # Express API server
│   ├── src/
│   │   ├── server.ts        # Express app setup
│   │   ├── routes/          # API route handlers
│   │   │   ├── components.routes.ts   # Component CRUD & search
│   │   │   ├── contributions.routes.ts # Contribution requests
│   │   │   ├── wiki.routes.ts         # Wiki content fetching
│   │   │   └── admin.routes.ts        # Admin endpoints
│   │   ├── services/        # Business logic
│   │   │   ├── component.service.ts
│   │   │   ├── azureDevOps.service.ts
│   │   │   ├── contribution.service.ts
│   │   │   └── storage.service.ts
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── errorHandler.ts
│   │   ├── db/
│   │   │   └── prisma.ts
│   │   ├── config/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── sync-service/            # Azure Functions for wiki sync
│   ├── WikiSyncTimer/       # Timer-triggered function
│   │   └── index.ts         # Main sync logic
│   ├── package.json
│   └── function.json
│
├── shared/                  # Shared TypeScript types
│   ├── src/
│   │   ├── types/
│   │   │   ├── component.ts     # Component interfaces
│   │   │   ├── fragment.ts      # Fragment interfaces
│   │   │   ├── pattern.ts       # Pattern interfaces
│   │   │   ├── sync.ts          # Sync & Wiki frontmatter
│   │   │   ├── contribution.ts  # Contribution types
│   │   │   ├── user.ts          # User & auth types
│   │   │   └── index.ts         # Type exports
│   │   └── index.ts
│   └── package.json
│
├── docs/                    # Documentation
│   ├── WIKI_TEMPLATE.md
│   ├── SETUP.md
│   └── DEPLOYMENT.md
│
├── package.json            # Monorepo root
├── README.md
├── CONTRIBUTING.md
├── BUGS_FOUND.md           # Known issues documentation
└── AEM library.md          # Product requirements doc
```

---

## 3. DATABASE SCHEMA (Prisma)

### Key Models:

#### **Component Model**
```
- id (UUID, primary key)
- slug (String, unique) - URL-friendly identifier
- title (String)
- description (Text)
- tags (String[]) - Array of tags
- status (Enum: STABLE, EXPERIMENTAL, DEPRECATED)
- ownerEmail, ownerTeam (String)
- repoLink, azureWikiPath, azureWikiUrl (String)
- figmaLinks (String[]) - Array of Figma design links
- aemComponentPath (String)
- aemDialogSchema (JSON)
- aemAllowedChildren (String[])
- aemTemplateConstraints (JSON)
- aemLimitations (String[])
- thumbnailUrl, screenshotAuthorUrl, screenshotPublishedUrl (String)
- lastSyncedAt, updatedAt, createdAt (DateTime)
- lastUpdatedBy (String)
- lastUpdatedSource (Enum: AZURE, MANUAL)
- Relations: contributionRequests[], patternComponents[]
- Indexes: slug, status, ownerTeam
```

#### **Fragment Model**
```
- id (UUID, primary key)
- slug (String, unique)
- type (Enum: CONTENT_FRAGMENT, EXPERIENCE_FRAGMENT)
- title (String)
- description (Text)
- schema (JSON) - JSON schema for fragment structure
- variations (JSON) - Array of variations
- sampleData (JSON)
- tags (String[])
- azureWikiPath, azureWikiUrl (String)
- createdAt, updatedAt (DateTime)
- Indexes: slug, type
```

#### **Pattern Model**
```
- id (UUID, primary key)
- slug (String, unique)
- title (String)
- description (Text)
- usageGuidance (Text)
- thumbnailUrl (String)
- tags (String[])
- createdAt, updatedAt (DateTime)
- Relations: components (PatternComponent[])
- Indexes: slug
```

#### **PatternComponent Model (Join Table)**
```
- id (UUID, primary key)
- patternId (String, foreign key)
- componentId (String, foreign key)
- order (Int) - Component order in pattern
- Unique constraint: [patternId, componentId]
```

#### **SyncLog Model**
```
- id (UUID, primary key)
- syncStartedAt (DateTime)
- syncCompletedAt (DateTime, nullable)
- status (Enum: SUCCESS, PARTIAL, FAILED)
- pagesProcessed (Int)
- pagesFailed (Int)
- errorLog (JSON) - Array of error objects
- createdAt (DateTime)
- Indexes: syncStartedAt, status
```

#### **ContributionRequest Model**
```
- id (UUID, primary key)
- createdByEmail, createdByName (String)
- requestType (Enum: NEW_COMPONENT, UPDATE_SCREENSHOT, FIX_METADATA, OTHER)
- componentId (String, nullable, foreign key)
- payload (JSON) - Flexible data for different request types
- status (Enum: PENDING, APPROVED, REJECTED, COMPLETED)
- reviewerEmail, reviewerNotes (String, nullable)
- devopsWorkItemId (String, nullable)
- createdAt, updatedAt (DateTime)
- Relations: component (Component, nullable)
- Indexes: status, createdByEmail, componentId
```

#### **User Model**
```
- azureAdOid (String, primary key) - Azure AD Object ID
- email (String, unique)
- displayName (String)
- role (Enum: VIEWER, CONTRIBUTOR, DOC_OWNER, ADMIN)
- lastLoginAt (DateTime, nullable)
- createdAt, updatedAt (DateTime)
- Indexes: email, role
```

**Database:** PostgreSQL 14+

---

## 4. COMPONENT STRUCTURE & FIELDS

### Component Interface (from shared types):

```typescript
interface Component {
  id: string;
  slug: string;                    // Unique URL-friendly identifier
  title: string;
  description: string;
  tags: string[];                  // Tags for filtering
  status: ComponentStatus;         // stable | experimental | deprecated
  ownerEmail?: string;             // Contact for questions
  ownerTeam?: string;              // Team responsible
  repoLink?: string;               // Link to code repository
  azureWikiPath?: string;          // Wiki page path
  azureWikiUrl?: string;           // Full Wiki URL
  figmaLinks?: string[];           // Figma design file links
  
  // AEM-specific metadata
  aemMetadata?: {
    componentPath: string;         // /apps/project/components/hero
    dialogSchema?: Record<string, any>;  // Dialog JSON schema
    allowedChildren?: string[];    // Child component names
    templateConstraints?: Record<string, any>;
    limitations?: string[];        // Known limitations
  };
  
  // Visual assets
  visualAssets?: {
    thumbnailUrl?: string;         // List view thumbnail
    screenshotAuthorUrl?: string;  // Authoring view screenshot
    screenshotPublishedUrl?: string; // Published view screenshot
  };
  
  // Update tracking
  lastUpdate?: {
    source: 'azure' | 'manual';
    date: Date;
    author: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Component Creation Input:
```typescript
interface ComponentInput {
  slug: string;                    // Required, unique
  title: string;                   // Required
  description: string;             // Required
  tags?: string[];
  status?: ComponentStatus;        // Defaults to STABLE
  ownerEmail?: string;
  ownerTeam?: string;
  repoLink?: string;
  azureWikiPath?: string;
  azureWikiUrl?: string;
  figmaLinks?: string[];           // Key for Figma integration
  aemMetadata?: AEMMetadata;
  visualAssets?: VisualAssets;
}
```

---

## 5. API ENDPOINTS

### Components API

```
GET /api/components
  Query params: search, tags[], status[], ownerTeam, page, pageSize
  Auth: Required (Viewer+)
  Returns: PaginatedResponse<Component>

GET /api/components/tags
  Auth: Required
  Returns: string[]

GET /api/components/teams
  Auth: Required
  Returns: string[]

GET /api/components/slug/:slug
  Auth: Required
  Returns: Component

GET /api/components/:id
  Auth: Required
  Returns: Component

POST /api/components
  Auth: Required (Doc Owner, Admin)
  Body: ComponentInput
  Returns: Component

PUT /api/components/:id
  Auth: Required (Doc Owner, Admin)
  Body: Partial<ComponentInput>
  Returns: Component

DELETE /api/components/:id
  Auth: Required (Admin only)
  Returns: { message: string }
```

### Wiki API

```
GET /api/wiki/content
  Query: path (required)
  Auth: Required
  Returns: { content: string }
```

### Contribution API

```
GET /api/contributions
  Query: page, pageSize, status
  Auth: Required (Doc Owner, Admin)
  Returns: PaginatedResponse<ContributionRequest>

GET /api/contributions/my
  Auth: Required
  Returns: PaginatedResponse<ContributionRequest>

GET /api/contributions/:id
  Auth: Required
  Returns: ContributionRequest

POST /api/contributions
  Auth: Required (Contributor+)
  Body: ContributionRequestInput
  Returns: ContributionRequest

PUT /api/contributions/:id/review
  Auth: Required (Doc Owner, Admin)
  Body: { status: APPROVED | REJECTED, reviewerNotes?: string }
  Returns: ContributionRequest

DELETE /api/contributions/:id
  Auth: Required (Admin)
```

### Admin API

```
GET /api/admin/stats
  Auth: Required (Doc Owner, Admin)
  Returns: {
    totalComponents, totalFragments, totalPatterns, totalUsers,
    pendingContributions, recentSyncs
  }

GET /api/admin/sync-logs
  Query: page, pageSize
  Auth: Required (Doc Owner, Admin)
  Returns: PaginatedResponse<SyncLog>

GET /api/admin/users
  Auth: Required (Admin)
  Returns: User[]

PUT /api/admin/users/:id/role
  Auth: Required (Admin)
  Body: { role: UserRole }
  Returns: User
```

---

## 6. FIGMA INTEGRATION

### Current Implementation:

**Figma Fields in Component Model:**
- `figmaLinks: String[]` - Array of Figma design URLs

**Frontend Display (DesignerTab):**
- Shows list of Figma links with clickable "Open in Figma" buttons
- Displays full Figma URLs
- Attempts to embed Figma preview using Figma's embed endpoint:
  ```
  https://www.figma.com/embed?embed_host=share&url={encodedUrl}
  ```
- Shows design guidelines text section

**Backend Support:**
- Figma links are stored and returned with component data
- No direct Figma API integration currently (read-only from Wiki)
- Links can be added/updated via component creation/update endpoints

**Wiki Frontmatter Support:**
```yaml
figma_links:
  - https://figma.com/file/abc123/ComponentName
  - https://figma.com/file/def456/VariationsPage
```

**Limitations:**
- No automatic sync from Figma
- No Figma plugin integration
- No two-way mapping between Figma components and portal entries
- Manual link maintenance required
- Embed may not work with all Figma URLs (requires public share link)

---

## 7. SYNC SERVICE (Azure Functions)

**File:** `sync-service/WikiSyncTimer/index.ts`
**Trigger:** Timer trigger (runs every 6 hours in production)

**Process Flow:**

1. **Fetch Wiki Pages**
   - Calls Azure DevOps Wiki REST API
   - Flattens hierarchical page tree
   - Retrieves all pages in wiki

2. **Parse Markdown Frontmatter**
   - Uses `gray-matter` to parse YAML frontmatter
   - Extracts metadata from wiki pages

3. **Map to Entities**
   - Detects `component_id`, `fragment_id`, or `pattern_id` in frontmatter
   - Skips pages without IDs

4. **Upsert to Database**
   - Uses Prisma `upsert` to create or update records
   - Preserves existing data if wiki doesn't provide values

5. **Track Sync Status**
   - Logs success/failure to SyncLog table
   - Records error details for debugging

**Supported Wiki Frontmatter:**
```yaml
---
component_id: hero-banner          # Required for components
fragment_id: card-content          # Required for fragments
pattern_id: header-footer-pattern  # Required for patterns

title: Hero Banner
description: Large top-of-page banner
status: stable
owner_team: Marketing Platform
owner_email: team@example.com
tags: [layout, marketing, author-editable]

# Figma links
figma_links:
  - https://figma.com/file/abc/Hero

# AEM metadata
aem_component_path: /apps/project/components/hero
aem_allowed_children: [teaser, cta]
aem_dialog_schema: { "fields": {...} }
aem_template_constraints: {}
aem_limitations: ["No video support", "Image ratio fixed 16:9"]

# Fragment-specific
type: content_fragment          # content_fragment or experience_fragment
schema: { "type": "object", ... }
variations:
  - name: Default
    description: Standard card
  - name: Featured
    description: Highlighted card
---
```

**Configuration (Environment Variables):**
```
DATABASE_URL=postgresql://...
AZURE_DEVOPS_ORG=your-org
AZURE_DEVOPS_PROJECT=your-project
AZURE_DEVOPS_WIKI_ID=wiki-id
AZURE_DEVOPS_PAT=personal-access-token
```

---

## 8. EXISTING SEED DATA & EXAMPLES

**No seed data files found** in the repository. Database is empty on initial setup.

**Wiki Template Available:** `docs/WIKI_TEMPLATE.md`
Provides a template for creating component documentation pages in Azure DevOps Wiki.

**Example Frontmatter in README:** Shows expected structure for wiki pages

---

## 9. TECHNOLOGY STACK

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** TailwindCSS 3
- **State Management:** React Query (TanStack)
- **Auth:** Azure MSAL (Microsoft Authentication Library)
- **HTTP Client:** Axios
- **Markdown Rendering:** react-markdown with sanitization
- **Components:** Radix UI (dialog, tabs, select, dropdown)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL 14+
- **Auth:** JWT via Azure AD
- **Validation:** Joi
- **HTTP Client:** Axios
- **Logging:** Winston
- **Security:** Helmet, CORS
- **Markdown Parsing:** gray-matter

### Sync Service
- **Runtime:** Azure Functions (Node.js)
- **ORM:** Prisma
- **HTTP Client:** Axios
- **Markdown Parsing:** gray-matter

### Shared Types
- **Language:** TypeScript
- **No runtime dependencies** (types only)

### Deployment
- **Frontend:** Azure Static Web Apps
- **Backend:** Azure App Service / Container Apps
- **Database:** Azure Database for PostgreSQL
- **Storage:** Azure Blob Storage
- **Sync:** Azure Functions
- **Secrets:** Azure Key Vault
- **CI/CD:** Azure DevOps Pipelines

---

## 10. AUTHENTICATION & AUTHORIZATION

### Authentication Method
- **Azure AD (OAuth 2.0)** via MSAL

### User Roles (RBAC)
1. **Viewer** - Read-only access to catalog
2. **Contributor** - Can submit contribution requests
3. **Doc Owner** - Can approve contributions, trigger syncs, manage components
4. **Admin** - Full access including user management

### Protected Routes
```
Frontend: All routes require authentication
  - Authentication happens in Providers.tsx
  - Azure MSAL handles login flow
  - Redirects to login if not authenticated

Backend: Uses authenticate middleware
  - Validates JWT token from Azure AD
  - Decodes and verifies token
  - Sets user context on request
  - Some endpoints require authorize() middleware for role checks
```

---

## 11. FRONTEND FEATURES

### Pages
1. **Home** (`/`) - Landing page
2. **Catalog** (`/catalog`) - Component list with search & filters
3. **Component Detail** (`/component/[slug]`) - Detailed component view

### Catalog Features
- **Search:** Full-text search by title/description
- **Filters:**
  - Tags (multi-select)
  - Status (Stable, Experimental, Deprecated)
  - Owner Team
- **Pagination:** 20 items per page
- **Component Cards:**
  - Thumbnail image
  - Title, description, status badge
  - Tags (shows first 3, "+X more")
  - Owner team info

### Component Detail Tabs
1. **Preview Tab** - Screenshots (author, published views)
2. **Designer Tab** - Figma design links and embedded preview
3. **Authoring Tab** - Content author guidance
4. **Implementation Tab** - Dev implementation details
5. **History Tab** - Update history and changelog

### Contribution Workflow
- Users can create contribution requests
- Requests routed to Doc Owners
- Reviewers can approve/reject with notes
- Creates Azure DevOps work items

---

## 12. KEY IMPLEMENTATION DETAILS

### Component Lifecycle
1. **Creation:**
   - Manual creation via API by Doc Owner/Admin
   - Or sync from Azure DevOps Wiki

2. **Updates:**
   - Manual updates via API
   - Sync from Wiki (upsert preserves fields)

3. **Deletion:**
   - Admin-only via API
   - Cascades to PatternComponent relationships

### Search Implementation
- Service layer uses Prisma filters
- Supports multiple filter types:
  - Full-text search (title/description)
  - Tag matching (hasSome operator)
  - Status filtering
  - Owner team filtering
- Case-insensitive search
- Paginated results (sorted by updatedAt desc)

### Frontend Data Fetching
- React Query for client-side caching
- Query keys: `['components', filters, page]`
- Automatic refetch on filter/page change
- Loading skeletons during fetch
- Error boundaries for failures

---

## 13. KNOWN BUGS & ISSUES

**Critical Bugs (from BUGS_FOUND.md):**

1. **Route Order Conflict** - `/slug/:slug` defined after `/:id` route
   - Breaks component detail page fetching by slug
   
2. **Invalid Prisma Query** - `array_contains` doesn't exist in Prisma
   - Tag filtering will fail at runtime
   - Already partially fixed in current code (uses `hasSome`)

3. **React Hook Dependencies** - `onChange` in SearchBar dependencies
   - Causes infinite re-renders when typing

4. **localStorage in SSR** - Axios interceptor accesses localStorage on server
   - Breaks API auth during server-side rendering

5. **Joi Schema Fork** - Complex `.fork()` syntax for validation
   - May not work as intended

6. **Prisma Client in Serverless** - Connection pooling issues
   - Singleton pattern implemented correctly

**Medium & Low Priority Issues:**
- Missing Prisma error handling in some cases
- No rate limiting
- No caching strategy
- Missing comprehensive error messages
- No telemetry/metrics

See `BUGS_FOUND.md` for full details and fixes.

---

## 14. DEPLOYMENT & OPERATIONS

### Database Setup
```bash
npm run prisma:migrate    # Run migrations
npm run prisma:generate   # Generate Prisma client
npm run prisma:studio     # GUI for DB management
```

### Development
```bash
npm run dev              # Run frontend + backend concurrently
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm run dev:sync         # Sync service local runtime
```

### Build & Deployment
```bash
npm run build            # Build all packages
npm run build:frontend   # Frontend only
npm run build:backend    # Backend only
npm run build:sync       # Sync service only
```

### Environment Variables Required

**Backend (`backend/.env`):**
- DATABASE_URL
- AZURE_AD_TENANT_ID, AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET
- AZURE_DEVOPS_ORG, AZURE_DEVOPS_PROJECT, AZURE_DEVOPS_PAT
- AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_KEY
- PORT, NODE_ENV, CORS_ORIGIN

**Frontend (`frontend/.env.local`):**
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_AZURE_AD_CLIENT_ID
- NEXT_PUBLIC_AZURE_AD_TENANT_ID

---

## 15. FILE SUMMARY

**Key Files by Purpose:**

| Purpose | File |
|---------|------|
| Database Schema | `/backend/prisma/schema.prisma` |
| Component API Routes | `/backend/src/routes/components.routes.ts` |
| Component Service | `/backend/src/services/component.service.ts` |
| Sync Logic | `/sync-service/WikiSyncTimer/index.ts` |
| Frontend API Client | `/frontend/src/lib/api.ts` |
| Component Catalog Page | `/frontend/src/app/catalog/page.tsx` |
| Component Detail Page | `/frontend/src/app/component/[slug]/page.tsx` |
| Shared Types | `/shared/src/types/*.ts` |
| Azure DevOps Service | `/backend/src/services/azureDevOps.service.ts` |
| Contribution Routes | `/backend/src/routes/contributions.routes.ts` |

---

## 16. SUMMARY

This is a well-structured monorepo for a component library portal that integrates with Azure DevOps Wiki and visualizes AEM components with Figma design links. The architecture supports:

- ✅ Multi-tenant component catalog with rich metadata
- ✅ Azure DevOps Wiki integration via REST API
- ✅ Scheduled sync service for automated updates
- ✅ Role-based access control
- ✅ Contribution workflows
- ✅ Figma design link storage and display
- ✅ Comprehensive component metadata (AEM, visual assets, ownership)

**Key Areas for Enhancement:**
- Figma two-way sync capabilities
- Advanced search with Elasticsearch
- Visual regression testing
- More detailed contribution workflows
- Analytics dashboard
- Enhanced error handling and logging

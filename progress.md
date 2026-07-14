# AEM Visual Portal — Development Progress

**Last Updated:** 2026-07-14
**Branch:** `claude/plan-aem-library-01NwUfar18HqXNwKgK6wfgmD`
**Latest Commit:** `64e4a52` — Unify Component Variants with Interaction States layout in Usage Guide tab
**Server:** `cd frontend && npm run dev` → http://localhost:3000

---

## Project Overview

AEM Visual Portal is a component library and documentation system for DXO (Digital Experience Operations) authors working with Adobe Experience Manager. It gives each AEM component a single home for visual documentation, authoring guidance, and design specs — replacing scattered notes across ADO, Figma, and wikis.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · React Query
**Data:** In-memory mock data (18 components, API routes built into Next.js)
**No external backend needed** — fully standalone, runs with `npm run dev`

---

## What We've Built (Cumulative)

### Foundation
- Next.js app with embedded API routes (`/api/components/*`)
- 18 AEM components in mock data with full metadata
- Catalog page with grid/list toggle and localStorage persistence
- Search and owner-team filter
- Simplified status system: **READY** (green) and **IN_REVIEW** (amber)

### Professional Portal UX
- **Inline editing throughout** — no separate edit mode
- Save/discard workflow with unsaved-changes detection and `beforeunload` warning
- Thumbnail upload with local file storage (`/public/uploads/thumbnails/`)
- Lottie animation on successful save
- Azure DevOps Work Item link field (chip display when set)
- Figma link with embedded iframe preview (Design Specs tab)
- Rich text editor for usage guidelines (Tiptap)
- Component create modal

### Design System Template Alignment
- Extended `ComponentVariant` type with optional `stateImages` (default/hover/focus/disabled/active)
- `VariantsSection` accordion layout — collapsible rows with chevron toggle; expanded body shows 320×180 state image tiles in horizontal scroll row, or single "Variant Image" tile; edit mode supports both single-image and state-image upload with toggle
- CTA Button mock data fully documented: 4 variants with state images, dialog schema, authoring notes, limitations, Figma link

### Component Detail — 3 Tabs

**Overview tab**
- Component thumbnail (drag & drop or file picker upload)
- ADO Tickets section (link AEM work items)
- Component Variants section (collapsible) — accordion display + full CRUD

**Design Specs tab**
- Figma link input + embedded iframe preview
- Design specs rich text editor

**Usage Guide tab** (structured doc layout)
- Component Properties — editable AEM dialog schema table
- Component Variants — same accordion as Overview
- When NOT to Use — LimitationsEditor (inline add/edit/delete)

### Key File Structure

```
frontend/src/
├── app/
│   ├── api/components/
│   │   ├── route.ts                     # GET /api/components
│   │   ├── slug/[slug]/route.ts         # GET + PATCH /api/components/slug/:slug
│   │   ├── tags/route.ts
│   │   └── teams/route.ts
│   ├── catalog/page.tsx                 # Catalog with grid/list/search/filter
│   └── component/[slug]/page.tsx        # Detail page — all state + save logic
├── components/
│   ├── catalog/
│   │   ├── ComponentCard.tsx
│   │   ├── ComponentListItem.tsx
│   │   ├── FilterPanel.tsx
│   │   └── ViewToggle.tsx
│   └── detail/
│       ├── ComponentTabs.tsx
│       ├── OverviewTab.tsx
│       ├── DesignSpecsTab.tsx
│       ├── UsageGuideTab.tsx
│       ├── VariantsSection.tsx          # Accordion CRUD with state image support
│       ├── ComponentPropertiesTable.tsx # Editable AEM dialog schema table
│       ├── LimitationsEditor.tsx        # Inline limitations editor
│       ├── RichTextEditor.tsx
│       ├── ThumbnailUpload.tsx
│       └── CollapsibleSection.tsx
└── data/mockComponents.ts               # 18 components, in-memory
```

---

## Current State

### What's Working
- Server runs at http://localhost:3000
- 18 components accessible in the catalog
- All editing fields functional: title, description, status, figma link, thumbnail, variants (including per-state images), limitations, dialog schema, authoring notes, design specs notes, ADO link
- Save triggers PATCH to `/api/components/slug/:slug` with full payload
- Unsaved changes tracked; save button enables only when changes exist
- TypeScript: `npx tsc --noEmit` passes with no errors (after rebuilding shared dist)

---

## Next Steps

### Priority 1 — Real Screenshots
- Current: color-coded placeholder URLs via `/api/placeholder/`
- Needed: actual component screenshots from AEM or Figma
- Approach: swap `imageUrl` / `stateImages` values in `mockComponents.ts`

### Priority 2 — More Components Documented
Only CTA Button has full variants + state images + complete notes. 17 others need:
- Variants with images and descriptions
- Limitations
- Dialog schema

### Priority 3 — Usage Guidelines Rich Text
The rich text editor (Tiptap) for authoring notes was removed from the Usage Guide restructure. It should be re-added as a fourth section at the bottom of the Usage Guide tab.

### Medium Priority
- **Component path display** — make the AEM path more prominent / copyable
- **Export / print view** — print-optimised one-pager per component

### Longer Term
- **Persistent storage** — edits currently reset on server restart; `/backend` has a PostgreSQL + Prisma schema ready
- **Azure AD authentication** — dev mode bypass is in place; production needs Azure AD app registration
- **Azure Wiki sync** — `sync-service/` has an Azure Functions skeleton ready

---

## Running the Project

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

TypeScript check (rebuild shared first if types are missing):
```bash
cd shared && npm run build
cd ../frontend && npx tsc --noEmit
```

---

## Recent Commits

```
64e4a52  Unify Component Variants with Interaction States layout in Usage Guide tab
4f5afeb  Fix duplicate dialogSchema prop in ComponentTabs JSX call
683b386  Restructure Design Specs & Usage Guide tabs with structured docs layout
1f4f036  Fix thumbnail upload 500 on Vercel — store base64 directly
237ee9c  Fix images not showing on catalog and detail pages
33405b5  Add state image upload editing to variant editor
bbe4aad  Make Usage Guide tab fully editable with limitations and dialog schema editors
7aab40e  Add state image matrix support to reflect design system template
5bda259  Fix thumbnail upload to use local file storage
047533b  Fix thumbnail image display with unified ComponentImage component
```

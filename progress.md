# AEM Visual Portal — Development Progress

**Last Updated:** 2026-07-08
**Branch:** `claude/plan-aem-library-01NwUfar18HqXNwKgK6wfgmD`
**Latest Commit:** `bbe4aad` — Make Usage Guide tab fully editable
**Server:** Running at http://localhost:3000

---

## Project Overview

AEM Visual Portal is a component library and documentation system for DXO (Digital Experience Operations) authors working with Adobe Experience Manager. It provides a searchable catalog of AEM components with visual documentation, authoring guidance, and design specs.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · React Query
**Data:** In-memory mock data (18 components, API routes built into Next.js)
**No external backend needed** — fully standalone

---

## What We've Accomplished (Cumulative)

### Foundation (Earlier Sessions)

- Next.js app with embedded API routes (`/api/components/*`)
- 18 AEM components in mock data with full metadata
- Catalog page with grid/list toggle and localStorage persistence
- Search, status filter, owner team filter
- Component detail pages with 3 tabs: Overview, Design Specs, Usage Guide
- Simplified status system: READY (green) and IN_REVIEW (amber)
- Tags removed from cards for cleaner interface

### Professional Portal UX (Recent)

- Inline editing throughout — no separate edit mode, edit fields are always accessible
- Save/discard workflow with unsaved changes detection and `beforeunload` warning
- Thumbnail upload with local file storage (`/public/uploads/thumbnails/`)
- Lottie animation on successful save
- Azure DevOps Work Item link field
- Figma link with embedded iframe preview (Design Specs tab)
- Rich text editor for usage guidelines (Tiptap-based)

### Design System Template Alignment (This Session — Part 1)

**Goal:** Reflect the Button Documentation template from the Figma design system.

- Extended `ComponentVariant` type with optional `stateImages` (default/hover/focus/disabled/active)
- Created `StateImageMatrix` component — 2×2 grid showing all states for a variant
- Updated `VariantsSection` to conditionally render state matrix vs. single image
- CTA Button mock data completely rewritten to match Figma template:
  - 4 variants: Primary, Secondary, Tertiary, Ghost
  - Each variant has state images (default/hover/focus/disabled)
  - Comprehensive authoring notes with HTML content
  - Design specs notes
  - Full AEM dialog schema (text, link, variant, size, openInNewTab, icon)
  - 5 limitations documented
  - Figma link pointing to actual template

### Usage Guide Tab — Fully Editable (This Session — Part 2)

All 4 sections of the Usage Guide tab are now editable:

| Section | Status |
|---|---|
| Available Styling Options (variants) | ✅ Editable (was already editable, in VariantsSection) |
| When NOT to Use (limitations) | ✅ Editable — LimitationsEditor |
| Usage Guidelines (rich text) | ✅ Editable (was already editable, RichTextEditor) |
| Dialog Fields Reference (dialogSchema) | ✅ Editable — DialogSchemaEditor (new) |

**New components:**
- `LimitationsEditor.tsx` — inline add/edit/delete for limitations array, Ctrl+Enter/Esc keyboard shortcuts
- `DialogSchemaEditor.tsx` — field-by-field editor for AEM dialog schema (name, type, required, maxlength, options, rootPath)

**State management:**
- `dialogSchema` state added to `page.tsx`
- Included in unsaved changes tracking
- Included in save payload (`aemMetadata.dialogSchema`)
- API route already handles nested `aemMetadata` → flattens to storage format

---

## Current State

### What's Working

- Server running at http://localhost:3000
- 18 components accessible in the catalog
- CTA Button fully documented with state image matrices per variant
- All editing fields functional: title, description, status, figma link, thumbnail, variants, limitations, dialog schema, authoring notes, design specs notes, Azure DevOps link
- Save triggers PATCH to `/api/components/slug/:slug` with full payload
- Unsaved changes tracked; save button enables only when changes exist

### Component Detail Tab Structure

**Overview tab:**
- Thumbnail upload (drag & drop or file picker)
- Variants section with state image matrix display
- Azure DevOps Work Item link

**Design Specs tab:**
- Figma link field with embedded iframe preview
- Design specs rich text editor

**Usage Guide tab:**
- Available Styling Options (variants — read display, edit in Overview)
- When NOT to Use (limitations — fully editable)
- Usage Guidelines (rich text — fully editable)
- Dialog Fields Reference (dialog schema — fully editable)

### File Structure (Key Files)

```
frontend/src/
├── app/
│   ├── api/components/
│   │   ├── route.ts                     # GET /api/components
│   │   ├── slug/[slug]/route.ts         # GET + PATCH /api/components/slug/:slug
│   │   ├── tags/route.ts
│   │   └── teams/route.ts
│   └── component/[slug]/page.tsx        # Detail page — all state + save logic
├── components/detail/
│   ├── ComponentTabs.tsx                # Tab switcher
│   ├── OverviewTab.tsx
│   ├── DesignSpecsTab.tsx
│   ├── UsageGuideTab.tsx                # 4-section usage guide
│   ├── VariantsSection.tsx              # Variant editor with state matrix display
│   ├── StateImageMatrix.tsx             # 2×2 state image grid (NEW)
│   ├── LimitationsEditor.tsx            # Inline limitations editor (NEW)
│   ├── DialogSchemaEditor.tsx           # AEM dialog field editor (NEW)
│   ├── RichTextEditor.tsx
│   └── ThumbnailUpload.tsx
└── data/mockComponents.ts               # 18 components, in-memory
```

---

## Next Steps

### High Priority

1. **Real screenshots instead of placeholder images**
   - Current: color-coded placeholder URLs via `/api/placeholder/`
   - Needed: actual component screenshots from AEM or Figma
   - Approach: swap `imageUrl` / `stateImages` values in `mockComponents.ts`

2. **State image editing in variant editor**
   - Currently, `VariantsSection` shows state images in view mode but has no edit UI for them
   - Add state image upload inputs to the variant edit form (one per state: default/hover/focus/disabled)
   - Follow same file-upload pattern as ThumbnailUpload

3. **More components documented like CTA Button**
   - Only CTA Button has full variants + state images + complete authoring notes
   - Hero Banner has basic variants but no state images and sparse notes
   - Other 16 components have no variants, notes, or dialog schema at all
   - Systematic effort needed to fill in component data

### Medium Priority

4. **Tags system** — removed from catalog but may be useful for filtering; could re-add as a lightweight optional field on components

5. **Component path display** — the AEM component path (`/apps/myproject/components/cta-button`) is shown in the header area but could be more prominent / copyable

6. **Export / print view** — authors sometimes need a printable one-pager for a component; a print-optimised route could help

### Longer Term

7. **Persistent storage** — currently all edits are in-memory and reset on server restart; connecting to a database (PostgreSQL + Prisma schema already exists in `/backend`) would make edits durable

8. **Azure AD authentication** — dev mode bypass is in place; production would need Azure AD app registration configured

9. **Azure Wiki sync** — `sync-service/` directory has an Azure Functions skeleton ready to pull documentation from Azure DevOps Wiki

---

## Recent Commits

```
bbe4aad  Make Usage Guide tab fully editable with limitations and dialog schema editors
7aab40e  Add state image matrix support to reflect design system template
55cfdc4  Fix .gitignore to properly ignore frontend uploads directory
5bda259  Fix thumbnail upload to use local file storage
047533b  Fix thumbnail image display with unified ComponentImage component
1b32979  Update .env.example to use frontend API routes
192853b  Remove Dialog Schema Editor and make styling options fully editable
e6c20ab  Make Usage Guide tab fully editable
756bf8b  Enhance Usage Guide tab for DXO authors
```

---

## Running the Project

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

TypeScript check:
```bash
cd frontend && npx tsc --noEmit
# → No errors
```

Test the CTA Button component for the most complete example:
http://localhost:3000/component/cta-button → Usage Guide tab → scroll to see all 4 editable sections

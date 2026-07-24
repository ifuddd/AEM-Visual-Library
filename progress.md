# AEM Visual Portal — Development Progress

**Last Updated:** 2026-07-24
**Branch:** `claude/plan-aem-library-01NwUfar18HqXNwKgK6wfgmD`
**Latest Commit:** `e46e703` — Trim storybook to Hero Banner and CTA Button only
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

---

## ✨ Visual Library (Storybook) — Completed 2026-07-15

A full Storybook-style interactive component browser at `/storybook`, accessible from the "Visual Library" button in the catalog nav. Authors can preview AEM components with live controls in a sandboxed canvas — without needing to touch AEM.

### Architecture

```
frontend/src/
├── app/storybook/page.tsx              # Route entry — wraps layout in <Suspense>
├── lib/storybook/
│   ├── types.ts                        # ControlDefinition, StoryDefinition, ComponentStories, StorybookUIState
│   ├── storiesRegistry.ts              # 12 ComponentStories entries, DEFAULT_STORY_ID
│   └── utils.ts                        # findStoryById, buildInitialControlValues, buildStoryId
└── components/storybook/
    ├── StorybookTopBar.tsx             # Logo, back-to-catalog link, keyboard shortcut hints
    ├── StorybookSidebar.tsx            # Collapsible component tree, search filter
    ├── StorybookCanvas.tsx             # Viewport/background/zoom toolbar + preview render
    ├── AddonsPanel.tsx                 # 260px docked panel, Controls / Docs / AEM tabs
    ├── StorybookLayout.tsx             # Orchestrator — state, URL sync, keyboard shortcuts
    ├── addons/
    │   ├── ControlsPanel.tsx           # Table of live controls (text/boolean/select/number/color)
    │   ├── DocsPanel.tsx               # Component docs, story chips, authoring notes, links
    │   └── AemPanel.tsx                # AEM component path, allowed children, limitations
    └── previews/
        ├── HeroBannerPreview.tsx       # Gradient hero with overlay, alignment, CTA controls
        ├── CtaButtonPreview.tsx        # All 4 variants with active-state highlighting
        ├── CardPreview.tsx             # Vertical/horizontal layout, image toggle
        └── GenericPreview.tsx          # Inline previews for 9 other components; styled fallback
```

### Components in the Registry (2)

> **Note:** Originally grew to 17 registered components (see QA results below, run when there were 12). On 2026-07-24 the registry was deliberately trimmed down to just the components with real Figma designs behind them — see [Figma Integration](#figma-integration--livedesign-mode-2026-07-24) below for why and what's next.

| Slug | Status | Stories | Controls | Figma |
|------|--------|---------|----------|-------|
| hero-banner | READY | 4 | title, subtitle, alignment, overlay, ctaText, bgColor | ✅ Real design linked |
| cta-button | READY | 4 | variant, size, text, disabled, fullWidth | ⏳ Awaiting URL |

### Features

| Feature | Details |
|---------|---------|
| Live controls | All 5 control types (text / boolean / select / number / color), reset button |
| Viewport switching | Mobile 375px / Tablet 768px / Desktop 100% with smooth transitions |
| Background switching | Light / Dark / Transparent |
| Zoom | 50%–150% in 10% steps |
| URL sync | `?path=/story/<slug>--<storyId>` — shareable deep links |
| Keyboard shortcuts | `S` = toggle sidebar, `A` = toggle addons panel |
| Sidebar search | Instant filter across component names and story names |
| Collapsible groups | Per-component expand/collapse in sidebar |
| Docs tab | Status badge, stories list, authoring notes HTML, Figma + ADO links |
| AEM tab | Component path in monospace code block, allowed children, limitations |

### QA Results (2026-07-15)

Playwright browser automation suite across 8 test categories:

| Category | Tests | Result |
|----------|-------|--------|
| SB — Storybook load | 8 | ✅ All pass |
| NAV — Sidebar navigation | 7 | ✅ All pass |
| CTRL — Controls panel | 6 | ✅ All pass |
| VP — Viewport switching | 3 | ✅ All pass |
| BG — Background switching | 3 | ✅ All pass |
| ZOOM — Zoom controls | 3 | ✅ All pass |
| KBD — Keyboard shortcuts | 3 | ✅ All pass |
| LINK — Back to catalog link | 2 | ✅ All pass |
| **Total** | **35** | **35 pass / 0 fail** |

---

## Figma Integration — Live/Design Mode (2026-07-24)

The storybook previews were all React-built approximations — good for showing interactive states, but not a faithful match to the real designs. The user has real components in a Figma file ("✨ Design System for AEM v2 ✨") and wants those visible directly in the storybook. This session added that capability and then intentionally cut scope to match what's real today.

### What changed

**1. Live / Design mode toggle** — `StorybookCanvas.tsx` toolbar now has a pill switch:
- **Live** (default) — the existing interactive React preview, controls fully functional
- **Design** — embeds the real Figma frame in an iframe via the existing `getFigmaEmbedUrl()` util (`lib/figmaUtils.ts` — the same one `DesignSpecsTab` already used on the component detail page, no new utility code written)
- Viewport / background / zoom controls grey out in Design mode (they don't apply to a Figma iframe)
- A `FigmaEmptyState` renders when a component has no Figma URL configured yet, with inline guidance on where to add one

**2. Type additions** (`lib/storybook/types.ts`):
- `StoryDefinition.figmaNodeUrl?: string` — per-story frame URL (e.g. a "Dark" variant can point at a different Figma frame than "Default")
- `StorybookUIState.previewMode: 'live' | 'figma'` — persists across story navigation within a session

**3. URL resolution order:** `story.figmaNodeUrl` → `component.figmaUrl` → empty state.

**4. Hero Banner wired to the real design** — `figmaUrl` in `storiesRegistry.ts` now points at the real "Design System for AEM v2" Figma file (node-id `6035-74582`), replacing the old `figma.com/file/example/...` placeholder.

**5. Registry trimmed 17 → 2** — per explicit user request, all components without a real Figma link were removed to keep the storybook honest about what's actually backed by a design: `card`, `navigation-header`, `accordion`, `tabs`, `form-field`, `alert`, `image`, `video-player`, `teaser`, `breadcrumb`, `carousel`, `modal`, `section-container`, `content-list`, `text-block`. Only **Hero Banner** and **CTA Button** remain. `previews/CardPreview.tsx` and `previews/GenericPreview.tsx` were deleted as dead code (nothing referenced them after the trim). If any of the removed components come back with a real Figma URL, their old placeholder preview code is recoverable from commit `6432890` rather than needing to be rewritten from scratch.

### Commits this round
```
6432890  Add 5 missing components to Visual Library storybook (later reverted by trim below)
032de28  Add Live/Design mode toggle to Visual Library storybook
cbb79d2  Wire real Figma URL for Hero Banner in storybook registry
e46e703  Trim storybook to Hero Banner and CTA Button only
```

---

### Key File Structure

```
frontend/src/
├── app/
│   ├── api/components/
│   │   ├── route.ts                     # GET /api/components
│   │   ├── slug/[slug]/route.ts         # GET + PATCH /api/components/slug/:slug
│   │   ├── tags/route.ts
│   │   └── teams/route.ts
│   ├── catalog/page.tsx                 # Catalog with grid/list/search/filter + "Visual Library" nav
│   ├── storybook/page.tsx               # Visual Library entry (Suspense wrapper)
│   └── component/[slug]/page.tsx        # Detail page — all state + save logic
├── components/
│   ├── catalog/
│   │   ├── ComponentCard.tsx
│   │   ├── ComponentListItem.tsx
│   │   ├── FilterPanel.tsx
│   │   └── ViewToggle.tsx
│   ├── detail/
│   │   ├── ComponentTabs.tsx
│   │   ├── OverviewTab.tsx
│   │   ├── DesignSpecsTab.tsx
│   │   ├── UsageGuideTab.tsx
│   │   ├── VariantsSection.tsx
│   │   ├── ComponentPropertiesTable.tsx
│   │   ├── LimitationsEditor.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── ThumbnailUpload.tsx
│   │   └── CollapsibleSection.tsx
│   └── storybook/                       # ← NEW
│       ├── StorybookTopBar.tsx
│       ├── StorybookSidebar.tsx
│       ├── StorybookCanvas.tsx
│       ├── AddonsPanel.tsx
│       ├── StorybookLayout.tsx
│       ├── addons/
│       │   ├── ControlsPanel.tsx
│       │   ├── DocsPanel.tsx
│       │   └── AemPanel.tsx
│       └── previews/
│           ├── HeroBannerPreview.tsx
│           └── CtaButtonPreview.tsx
├── lib/storybook/                        # ← NEW
│   ├── types.ts
│   ├── storiesRegistry.ts
│   └── utils.ts
└── data/mockComponents.ts               # 18 components, in-memory
```

---

## Current State

### What's Working
- Server runs at http://localhost:3000
- **`/catalog`** — 18 components, grid/list view, search, filter, "Visual Library" nav button
- **`/storybook`** — interactive Visual Library with 2 components (Hero Banner, CTA Button), Live/Design mode toggle, live controls, viewport/background/zoom, URL sync, keyboard shortcuts. Hero Banner's Design mode shows the real Figma frame; CTA Button's Design mode shows the empty state until a Figma URL is supplied
- **`/component/[slug]`** — full detail page with Overview / Design Specs / Usage Guide tabs
- All editing fields functional: title, description, status, figma link, thumbnail, variants, limitations, dialog schema, authoring notes, design specs notes, ADO link
- Save triggers PATCH to `/api/components/slug/:slug` with full payload
- Unsaved changes tracked; save button enables only when changes exist
- TypeScript: `npx tsc --noEmit` passes with no errors

---

## Next Steps

### Priority 1 — Get Real Figma URLs for Remaining Components
The Live/Design toggle and empty-state UX are built; only Hero Banner has a real Figma URL wired in. Next:
- Get a Figma frame URL for **CTA Button** (same pattern as Hero Banner: open the frame in Figma, copy the browser URL, paste it — `figmaUrl` for the whole component or `figmaNodeUrl` per story for variant-level precision)
- Decide which of the 15 removed components (`card`, `navigation-header`, `accordion`, `tabs`, `form-field`, `alert`, `image`, `video-player`, `teaser`, `breadcrumb`, `carousel`, `modal`, `section-container`, `content-list`, `text-block`) should come back — re-add only once each has a real design; old preview code is recoverable from commit `6432890`

### Priority 2 — Sync Registry with Catalog Mock Data
The `storiesRegistry.ts` is maintained separately from `data/mockComponents.ts`. Unify them:
- Derive `ComponentStories` entries directly from `mockComponents.ts` at build time, or
- Add a registry field to `mockComponents.ts` and auto-generate the sidebar from it

### Priority 3 — More Mock Data
Only CTA Button has full variants + state images + complete notes. As components are re-added (Priority 1), they'll need:
- Variants with images and descriptions
- Limitations
- Dialog schema

### Priority 4 — Re-add Authoring Notes Rich Text Editor
The Tiptap rich text editor for authoring notes was removed during the Usage Guide restructure. It should be re-added as a fourth section at the bottom of the Usage Guide tab.

### Medium Priority
- **Component path display** — make the AEM path more prominent / copyable in the catalog card and detail page
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
# Catalog:        http://localhost:3000/catalog
# Visual Library: http://localhost:3000/storybook
```

TypeScript check (rebuild shared first if types are missing):
```bash
cd shared && npm run build
cd ../frontend && npx tsc --noEmit
```

---

## Recent Commits

```
e46e703  Trim storybook to Hero Banner and CTA Button only
cbb79d2  Wire real Figma URL for Hero Banner in storybook registry
032de28  Add Live/Design mode toggle to Visual Library storybook
6432890  Add 5 missing components to Visual Library storybook
6815441  Update progress.md with Visual Library feature summary and QA results
a7644a2  Add comprehensive QA test suite for Visual Library Storybook feature
f3e0a36  Add Visual Library (Storybook) — interactive AEM component browser at /storybook
64e4a52  Unify Component Variants with Interaction States layout in Usage Guide tab
4f5afeb  Fix duplicate dialogSchema prop in ComponentTabs JSX call
683b386  Restructure Design Specs & Usage Guide tabs with structured docs layout
```

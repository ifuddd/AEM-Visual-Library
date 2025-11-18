# AEM Visual Portal — Product Requirements Document (PRD)

> **Purpose:** A visual, designer-friendly portal that maps Adobe Experience Manager (AEM) components, fragments and authoring constraints to developer documentation stored in Azure DevOps Wiki. The portal serves designers, front‑end developers, and content authors — reducing confusion (content vs experience fragments, dialogs, variations), improving design→dev handoffs, and enabling collaborative contributions.

---

# 1. Overview

## 1.1 Goals

- Provide a **visual-first catalogue** of AEM building blocks (components, content fragments, experience fragments, templates, variations).
- Map **design artifacts (Figma / Sketch)** to the **AEM implementation** (dialog fields, HTL paths, JSON schemas, allowed child components).
- Integrate and surface **Azure DevOps Wiki** documentation without duplicating source-of-truth.
- Allow **designers** to browse, discover, and assemble patterns while understanding AEM constraints.
- Allow **developers** to keep authoritative docs in Azure DevOps while exposing structured content to the portal.
- Support **contribution workflows** from both designers and developers with traceable approvals and versioning.

## 1.2 Success metrics

- Reduction in design→dev clarification tickets by **40%** within 6 months of rollout.
- 90% of active UI components documented in the portal within 3 months.
- Average task completion time for designers to find the correct AEM component < **2 minutes**.
- > 80% contributor satisfaction (survey) for documentation update flows.

---

# 2. Target users & personas

- **Product Designer:** Needs visual examples, do/don't, Figma mapping, and indication of AEM constraints.
- **Frontend Developer / AEM Developer:** Needs implementation details, dialog schema, HTL snippets, repo links, code examples.
- **Content Author / Marketer:** Needs authoring previews and notes on editable fields and permissions.
- **Docs Maintainer / DevOps:** Responsible for keeping Azure DevOps Wiki authoritative and synchronizing content.

---

# 3. Scope and features

> **MVP (Phase 1)** — read‑only visual portal with Azure DevOps Wiki integration and component catalogue.

## 3.1 Core features (MVP)

- **Component Catalogue**: Card view (thumbnail, short description, tags) with search and filters (type, status, authorable, fragments).
- **Component Detail Page**: Tabs for *Preview (visual)*, *Designer View (Figma)*, *AEM Author Dialog (annotated screenshot/JSON)*, *Dev View (paths + snippets + Azure Wiki)*, *Limitations & Notes*.
- **Azure DevOps Wiki Embed**: Pull Markdown pages via Azure DevOps REST API; render as styled HTML in portal.
- **Mapping Panel**: Figma frame links / image + AEM component mapping (one-to-many support).
- **Search & Filters**: Full text, tag filters (e.g., content-fragment, experience-fragment, variation, author-editable), and status filters (stable, experimental, deprecated).
- **Authentication**: Single Sign-On (Azure AD) — read access to Azure DevOps content respecting permissions.
- **Contribution Request Form**: Designers can request new component docs or screenshots (creates a Git issue or DevOps work item routed to docs owner).
- **Metadata**: Show "last updated" with source (Azure commit/author), component status, owner, and links to AEM repo/pipeline.

## 3.2 Phase 2 (sync + structured model)

- **Scheduled Sync**: Background job to pull Wiki markdown, parse headings/frontmatter, and store structured content in the portal DB or headless CMS.
- **Two‑way contribution** (optional): Allow portal users to propose visual updates which generate PRs or Wiki edits (Git-backed Wiki recommended).
- **Interactive Playground**: Live sandbox allowing toggling component properties to preview variations.
- **Versioning & Changelog**: Visual changelog when AEM components update (diffs and screenshots).
- **Role-based Editing**: Designer contributors can upload images / Figma links; devs can edit doc source or accept contributions.

## 3.3 Phase 3 (automation & governance)

- **Automated Visual Regression**: Snapshot AEM component renderings (or storybook) and run visual tests on deploy.
- **Figma Sync**: Two-way sync with a Figma plugin or scheduled export that maps frames/components to portal entries.
- **Analytics Dashboard**: Usage metrics (most-viewed components, broken links, outdated docs).
- **Content Fragment / Experience Fragment Browser**: Structured previews of fragments (schema viewer + sample render data).

---

# 4. Information architecture & data model

## 4.1 High level pages

- Home / Overview
- Foundations (AEM concepts: CF vs XF vs Component vs Dialog)
- Catalog (components, fragments, patterns)
- Component Detail
- Patterns & Templates
- Contribution & Governance
- Admin (sync status, logs, audit)

## 4.2 Core data model (entities)

- **Component**
  - id, title, description, tags, status, owner, repo_link, azure_wiki_link
  - visual_assets: [thumbnail, screenshot_author, screenshot_published]
  - figma_link(s), figma_frame_id
  - aem_metadata: {component_path, allowed_children, dialog_schema_json, template_constraints}
  - last_updated: {source: azure, date, author}
- **Fragment** (CF/XF)
  - id, type (content/experience), schema, variations[], sample_data
- **Pattern**: list of component ids + usage guidance
- **SyncLog**: timestamp, source_page, status, error
- **ContributionRequest**: created_by, payload, status, linked_work_item

---

# 5. Architecture & technologies

> The architecture should be modular, secure, and support incremental rollout.

## 5.1 Suggested high-level architecture

```
[Azure DevOps Wiki (Markdown / Git-backed)]
            │
            ▼
   Sync Service (Azure Function / Node job)  ---> Headless CMS or Portal DB
            │                                         │
            ▼                                         ▼
   Portal Backend (API) ----------------------> Portal Frontend (Next.js/React)
            │                                         │
            ▼                                         ▼
      Auth (Azure AD / OAuth2)                    Figma embeds / image assets
```

## 5.2 Recommended technology stack

- **Frontend**: React with Next.js (SSG/ISR for pages) or Vite+React for an SPA.
  - UI: TailwindCSS (or design system library). Use Framer Motion for micro‑interactions.
- **Backend / API**: Node.js (Express / Fastify) or .NET Core (if org prefers Microsoft stack). Use a small GraphQL layer or REST API.
- **Data store**: Postgres (primary structured data) or a headless CMS (Sanity / Contentful / Strapi) if content editors are required.
- **Sync Service**: Azure Functions or an Azure DevOps Pipeline task that pulls wiki content via Azure DevOps REST API.
- **Authentication / SSO**: Azure Active Directory (OAuth2 / OpenID Connect).
- **Assets & Media**: Azure Blob Storage or Cloud CDN for screenshots and previews.
- **Search**: ElasticSearch or Azure Cognitive Search for full-text and tag filtering.
- **CI/CD**: Azure DevOps Pipelines for backend/frontend builds, tests, and deployments.
- **Visual testing**: Percy or Playwright + snapshot tests.
- **Monitoring & Logging**: Azure Monitor / Application Insights; Sentry for frontend runtime errors.

---

# 6. Security & compliance

## 6.1 Authentication & access control

- Use **Azure AD SSO** for authentication. Portal must honour the same access scope as Azure DevOps: users only see Wiki content they have permission to read.
- Role‑based access control (RBAC) within portal: Viewer, Contributor (designers), Doc Owner (devs), Admin.
- Admin APIs protected with scope-restricted service principals.

## 6.2 Secrets & credentials

- Store secrets (Azure DevOps PAT, storage keys) in **Azure Key Vault**.
- Sync service runs with a service principal limited to required scopes.

## 6.3 Data protection & storage

- All data in transit must use **HTTPS/TLS 1.2+**.
- Sensitive metadata (internal repo paths, credentials) should not be exposed to non-authorized users.
- Audit logs of who accessed or changed portal content for compliance.

## 6.4 Network & infrastructure

- Deploy backend services into **private subnets** where possible.
- Expose only required endpoints to the internet via an API Gateway or App Service with WAF (Azure Application Gateway).

## 6.5 Compliance considerations

- Ensure any design/author content complies with organizational policies (e.g., PII handling). If content fragments can include PII, add warnings and additional access controls.

---

# 7. Integration details

## 7.1 Azure DevOps Wiki integration (read-first approach)

- **Method A (quick win)**: Use Azure DevOps Wiki REST API to fetch Markdown pages on-demand. Render via `react-markdown` with a sane sanitizer.
- **Method B (structured)**: Use a scheduled Azure Function to fetch markdown, parse frontmatter/headings into structured fields, and save to portal DB.
- **Choice recommendation**: Start with Method A for MVP; implement Method B in Phase 2 for advanced filtering and metadata.

## 7.2 Pull vs Push

- Start with **pull-based** sync from the Wiki. Avoid portal writing directly to Wiki in MVP to keep single source of truth.
- For two-way contribution, prefer **Git-backed Wiki** (files in a repo). Portal proposals can create PRs to the documentation repo (automated PR creation via API) for developer review.

## 7.3 Figma integration

- Store Figma links and image thumbnails in component entries.
- Optionally build a small Figma plugin or scheduled export that maps frames to portal entries and uploads thumbnails to blob storage.

## 7.4 AEM integration

- Expose AEM component metadata where possible (component path, dialog JSON). If accessible, fetch via AEM’s API or have devs attach the metadata in the Azure Wiki frontmatter.

---

# 8. UX / Design requirements

- **Visual-first**: Large thumbnails, preview canvases, and toggleable author vs published views.
- **Tab structure** on component detail pages: Preview | Designer | Authoring | Implementation | History
- **Accessibility (a11y)**: WCAG 2.1 AA compliance for the portal UI.
- **Responsive**: Work across desktop and tablet (designers typically use desktop).
- **Search-first**: Prominent search bar that searches component titles, tags, and wiki content.
- **Status & constraints**: Prominently show limitation badges (e.g., "Author-only", "No XF support", "Mobile-only").

---

# 9. Non‑functional requirements

- **Performance**: Component list loads within 300ms for cached pages. Detail pages load within 500ms (with SSR/ISR where possible).
- **Scalability**: Should handle 1,000+ component records and 10k monthly active users.
- **Availability**: 99.9% uptime SLA for internal users.
- **Maintainability**: Clean separation of sync logic and rendering; automated pipeline for deployments.
- **Localization**: Support for future multi‑language content (docs only initially).

---

# 10. Testing & QA

- **Unit tests** for sync parsers and API endpoints.
- **Integration tests** for Azure DevOps API interactions, auth flows (Azure AD), and storage.
- **End-to-end tests** (Playwright) for key workflows: search, view component, open Azure Wiki link, contribution request.
- **Visual regression** tests (Percy / Playwright snapshots) for representative components.
- **Security tests**: SAST scans for backend code, dependency scans, and penetration testing for public endpoints.

---

# 11. Deployment & operations

- **CI/CD**: Azure DevOps Pipelines build & deploy frontend and backend. Infrastructure as code using ARM templates or Terraform.
- **Environments**: dev, staging (connected to a test Azure DevOps project), production.
- **Backups**: DB nightly backups; asset storage lifecycle rules.
- **Monitoring**: Application Insights + alerting for sync failures, high error rates, or auth errors.

---

# 12. Governance & contribution workflow

- **Source of truth**: Azure DevOps Wiki (or Git-backed wiki) for technical docs; portal is the visual presentation layer.
- **Contribution template**: Markdown template with required fields (component id, short description, dialog schema, figma link, screenshots, known limitations).
- **Review flow**: Designer submits ContributionRequest → Doc owner (AEM dev) reviews → Accepts (updates Wiki) or requests changes.
- **Ownership**: Each component must have an owning team and contact metadata.

---

# 13. Roadmap & milestone plan

- **Month 0–1 (Discovery & design)**: Stakeholder interviews, inventory mapping, wireframes, data model.
- **Month 2–3 (MVP build)**: Catalog + Component detail pages + Azure DevOps Wiki read-only embed + Azure AD SSO.
- **Month 4–5 (Phase 2)**: Sync service, structured data model, improved search, Contribution forms → create work items.
- **Month 6–8 (Phase 3)**: Figma sync, visual regression, two-way PR workflow, analytics dashboard.

---

# 14. Acceptance criteria

- MVP portal displays a searchable catalog of components and the component detail page renders content from Azure DevOps Wiki for each linked component.
- Users can authenticate with Azure AD and only see wiki pages they have access to.
- Component detail pages include at least: preview image, designer link (Figma), aem_metadata fields, and a direct link to Azure DevOps Wiki.
- Sync job (Phase 2) runs successfully and populates structured fields for at least 80% of components.

---

# 15. Risks & mitigations

- **Risk**: Wiki content is unstructured and inconsistent.
  - *Mitigation*: Create and distribute a Markdown doc template; implement a parser with resilient fallbacks; run a manual curation sprint.
- **Risk**: Permission issues when accessing private Azure DevOps content.
  - *Mitigation*: Use Azure AD SSO and service principals with minimal scopes; test with mirrored test project.
- **Risk**: Designers want live editing inside portal.
  - *Mitigation*: Offer contribution requests and propose PRs rather than direct edits during MVP; revisit two-way editing in Phase 2.

---

# 16. Appendix: Example API / Integration details

### 16.1 Example: Azure DevOps Wiki (REST) - get page

```
GET https://dev.azure.com/{organization}/{project}/_apis/wiki/wikis/{wikiIdentifier}/pages?path={path}&api-version=6.0
Authorization: Bearer <PAT or OAuth token>
```

### 16.2 Example: Proposed component detail JSON (portal internal)

```json
{
  "id": "hero-banner",
  "title": "Hero Banner",
  "description": "Large top-of-page banner with image, headline and CTA",
  "tags": ["layout", "marketing", "author-editable"],
  "figma_link": "https://www.figma.com/file/...",
  "aem_metadata": {
    "component_path": "/apps/project/components/hero",
    "dialog_schema_json": { /* small sample */ },
    "allowed_children": ["teaser", "cta"],
    "limitations": ["no video in authoring dialog", "image ratio fixed to 16:9"]
  },
  "azure_wiki_link": "https://dev.azure.com/.../wiki/hero-banner",
  "last_updated": {
    "source": "azure",
    "date": "2025-10-20T10:12:00Z",
    "author": "dev@example.com"
  }
}
```

---

# Next steps

- Review this PRD and confirm scope for MVP.
- Approve technology stack (React/Next.js + Azure Functions + Postgres/Headless CMS) or request alternatives.
- Run a 2‑week discovery: inventory existing Azure DevOps Wiki pages and map 20 high‑value components as sample data.

---

*Document prepared by product/UX. For tie‑in with engineering, please provide preferred backend language (.NET/Node) and any corporate security requirements to finalize deployment design.*


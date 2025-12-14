# Example Components Guide

This guide explains how to populate your AEM Visual Portal with example components and data.

## Overview

The repository includes:
1. **Seed Script** (`backend/prisma/seed.ts`) - Populates database with 15 example components
2. **Example Wiki Pages** (`docs/example-wiki-pages/`) - Sample Azure DevOps Wiki markdown files
3. **Two Integration Methods** - Database seed or Wiki sync

---

## Quick Start

### Option 1: Seed Database Directly (Fastest)

This method directly populates the PostgreSQL database with example components.

#### Prerequisites
- PostgreSQL database running
- Environment variables configured
- Prisma migrations completed

#### Steps

1. **Set up database** (if not already done):
   ```bash
   cd backend

   # Copy environment template
   cp .env.example .env

   # Edit .env and configure DATABASE_URL
   nano .env
   ```

2. **Run migrations**:
   ```bash
   npm run prisma:migrate
   ```

3. **Run seed script**:
   ```bash
   npm run prisma:seed
   ```

4. **Verify data**:
   ```bash
   npm run prisma:studio
   ```
   Open http://localhost:5555 to browse the data.

#### What Gets Created

The seed script creates:

- **3 Users**:
  - Admin User (`admin@example.com`) - ADMIN role
  - Sarah Designer (`designer@example.com`) - CONTRIBUTOR role
  - John Developer (`developer@example.com`) - DOC_OWNER role

- **15 Components**:
  1. Hero Banner (STABLE)
  2. CTA Button (STABLE)
  3. Card (STABLE)
  4. Navigation Header (STABLE)
  5. Accordion (STABLE)
  6. Tabs (STABLE)
  7. Form Field (STABLE)
  8. Image (STABLE)
  9. Video Player (STABLE)
  10. Breadcrumb (STABLE)
  11. Footer (STABLE)
  12. Text Block (STABLE)
  13. Carousel (EXPERIMENTAL)
  14. Modal (STABLE)
  15. Alert (STABLE)

- **2 Fragments**:
  - Article Content Fragment
  - Product Experience Fragment

- **2 Patterns**:
  - Landing Page Hero Section
  - Article Page Layout

- **1 Sync Log**:
  - Sample successful sync log

---

### Option 2: Sync from Azure DevOps Wiki (Realistic)

This method demonstrates the real-world workflow where components are documented in Azure DevOps Wiki and synced to the portal.

#### Prerequisites
- Azure DevOps organization and project
- Azure DevOps Wiki enabled
- Personal Access Token (PAT) with Wiki read permissions
- Azure Function or scheduled task for sync service

#### Steps

1. **Upload Wiki Pages to Azure DevOps**:

   Navigate to your Azure DevOps project:
   ```
   https://dev.azure.com/{organization}/{project}/_wiki
   ```

   Create a new Wiki or use existing one, then upload the example pages from `docs/example-wiki-pages/`:
   - `Hero-Banner.md`
   - `CTA-Button.md`
   - `Card.md`

   **Important**: Ensure the YAML frontmatter is preserved (the content between `---` markers).

2. **Configure Environment Variables**:

   In `backend/.env`:
   ```bash
   # Azure DevOps
   AZURE_DEVOPS_ORG=your-organization
   AZURE_DEVOPS_PROJECT=your-project
   AZURE_DEVOPS_WIKI_ID=your-wiki-id  # Found in Wiki URL
   AZURE_DEVOPS_PAT=your-personal-access-token
   ```

3. **Deploy Sync Service**:

   Deploy the Azure Function in `sync-service/`:
   ```bash
   cd sync-service
   npm install
   npm run build

   # Deploy to Azure Functions
   func azure functionapp publish <YOUR_FUNCTION_APP_NAME>
   ```

4. **Manual Trigger** (for testing):

   You can manually trigger the sync by calling the function:
   ```bash
   curl -X POST https://<function-app>.azurewebsites.net/api/WikiSyncTimer
   ```

5. **Verify Sync**:

   Check the sync logs:
   ```bash
   # In backend directory
   npm run prisma:studio
   ```

   Navigate to `SyncLog` table to see sync results.

---

## Component Details

### Components Included in Seed Data

#### Layout Components
- **Hero Banner** - Large page headers with image, title, and CTAs
- **Navigation Header** - Main site navigation
- **Footer** - Site-wide footer
- **Breadcrumb** - Navigational breadcrumbs
- **Card** - Flexible content cards

#### Interactive Components
- **CTA Button** - Call-to-action buttons
- **Accordion** - Expandable content sections
- **Tabs** - Tabbed content
- **Modal** - Dialog overlays
- **Carousel** - Image/content sliders
- **Form Field** - Input fields with validation

#### Content Components
- **Text Block** - Rich text content
- **Image** - Responsive images
- **Video Player** - Video embed
- **Alert** - Notification banners

### Component Metadata

Each component includes:

- ✅ **Basic Info**: Title, description, slug
- ✅ **Status**: STABLE or EXPERIMENTAL
- ✅ **Ownership**: Team and email contact
- ✅ **Tags**: Searchable keywords
- ✅ **Figma Links**: Design file URLs
- ✅ **AEM Metadata**:
  - Component path
  - Dialog schema (JSON)
  - Allowed children
  - Template constraints
  - Known limitations
- ✅ **Visual Assets**: Placeholder image URLs
- ✅ **Repository Links**: GitHub links
- ✅ **Wiki Links**: Azure DevOps Wiki paths

---

## Customizing Example Data

### Modifying the Seed Script

Edit `backend/prisma/seed.ts` to customize:

#### 1. Change Component Data

```typescript
{
  slug: 'my-component',
  title: 'My Component',
  description: 'Custom component description',
  tags: ['custom', 'tag'],
  status: ComponentStatus.STABLE,
  ownerEmail: 'team@mycompany.com',
  ownerTeam: 'My Team',
  // ... more fields
}
```

#### 2. Add New Components

```typescript
const components = [
  // ... existing components
  {
    slug: 'new-component',
    title: 'New Component',
    description: 'A brand new component',
    tags: ['new'],
    status: ComponentStatus.EXPERIMENTAL,
    ownerEmail: 'dev@example.com',
    ownerTeam: 'Development',
    figmaLinks: ['https://figma.com/file/...'],
    aemComponentPath: '/apps/myproject/components/new-component',
    // ... other fields
  },
];
```

#### 3. Update Visual Assets

Replace placeholder URLs with real images:

```typescript
thumbnailUrl: 'https://yourcdn.com/thumbnails/component.png',
screenshotAuthorUrl: 'https://yourcdn.com/screenshots/author.png',
screenshotPublishedUrl: 'https://yourcdn.com/screenshots/published.png',
```

#### 4. Re-run Seed

```bash
cd backend
npm run prisma:seed
```

The script uses `upsert`, so it will update existing components or create new ones based on the `slug`.

---

## Creating Wiki Pages

### Wiki Page Template

Use this structure for new wiki pages:

```markdown
---
component_id: unique-slug
title: Component Display Name
description: Short description (1-2 sentences)
status: stable  # or experimental, deprecated
owner_team: Team Name
owner_email: team@example.com
figma_links:
  - https://www.figma.com/file/abc123/...
aem_component_path: /apps/myproject/components/slug
aem_allowed_children:
  - child-component-1
  - child-component-2
aem_dialog_schema:
  fieldName:
    type: textfield
    required: true
  anotherField:
    type: select
    options: [option1, option2]
aem_template_constraints:
  allowedParents:
    - container
  maxItems: 1
aem_limitations:
  - Limitation 1
  - Limitation 2
tags:
  - tag1
  - tag2
  - tag3
---

# Component Title

## Overview
Component description and purpose...

## When to Use
When to use this component...

## Authoring Instructions
How content authors should use this component...

## Technical Implementation
HTL code, CSS, JavaScript details...

## Examples
Real-world examples...

## Related Components
Links to related components...
```

### Frontmatter Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `component_id` | string | Yes | Unique slug (used as database key) |
| `title` | string | Yes | Display name |
| `description` | string | Yes | Short description |
| `status` | enum | Yes | `stable`, `experimental`, or `deprecated` |
| `owner_team` | string | Yes | Responsible team name |
| `owner_email` | string | No | Team contact email |
| `figma_links` | array | No | Figma design file URLs |
| `aem_component_path` | string | No | AEM component resource path |
| `aem_allowed_children` | array | No | List of allowed child components |
| `aem_dialog_schema` | object | No | Dialog field definitions (JSON) |
| `aem_template_constraints` | object | No | Template usage restrictions |
| `aem_limitations` | array | No | Known limitations |
| `tags` | array | No | Searchable tags |

---

## Figma Integration

### Adding Figma Links

#### In Seed Script

```typescript
figmaLinks: [
  'https://www.figma.com/file/abc123/Design-System?node-id=100-200',
  'https://www.figma.com/file/abc123/Design-System?node-id=100-250',
],
```

#### In Wiki Pages

```yaml
figma_links:
  - https://www.figma.com/file/abc123/Design-System?node-id=100-200
  - https://www.figma.com/file/def456/Component-Specs?node-id=300-400
```

### Getting Figma Links

1. Open your Figma file
2. Select the frame/component
3. Right-click → "Copy link"
4. Paste the full URL

**Link Format**:
```
https://www.figma.com/file/{FILE_KEY}/{FILE_NAME}?node-id={NODE_ID}
```

### Figma Embed

The portal automatically embeds the first Figma link in the Designer tab. For the embed to work:

- ✅ File must be publicly accessible or shared with viewers
- ✅ Link must be to a specific frame (include `node-id`)
- ✅ Use full `figma.com/file/...` URL format

See [`FIGMA_INTEGRATION_ANALYSIS.md`](./FIGMA_INTEGRATION_ANALYSIS.md) for advanced integration options.

---

## Troubleshooting

### Seed Script Fails

**Error**: `P1001: Can't reach database server`
- **Solution**: Check DATABASE_URL in `.env`, ensure PostgreSQL is running

**Error**: `Unique constraint failed on fields: (slug)`
- **Solution**: A component with that slug already exists. Change the slug or the script will update the existing one.

**Error**: `Invalid prisma.component.create() invocation`
- **Solution**: Check that all required fields are provided and have correct types

### Wiki Sync Not Working

**Issue**: Components not appearing after sync
- **Check**: YAML frontmatter is valid (proper indentation, no tabs)
- **Check**: Azure DevOps PAT has Wiki read permissions
- **Check**: Sync service environment variables are correct
- **Check**: Sync logs in database for error details

**Issue**: Figma links not syncing
- **Check**: Links are in array format in frontmatter:
  ```yaml
  figma_links:
    - https://figma.com/...
    - https://figma.com/...
  ```

### Image Placeholders

The seed script uses `placehold.co` for placeholder images. These are public and temporary.

**For production**:
1. Upload real component screenshots to Azure Blob Storage
2. Update URLs in seed script or Wiki frontmatter
3. Re-run seed or sync

---

## Data Management

### Reset Database

To start fresh:

```bash
cd backend

# Reset database (WARNING: Deletes all data!)
npm run prisma:migrate reset

# Re-run seed
npm run prisma:seed
```

### Update Existing Components

The seed script uses `upsert`, so you can:

1. Edit component data in `backend/prisma/seed.ts`
2. Re-run: `npm run prisma:seed`
3. Existing components (matching slug) will be updated

### Export Data

To export current database data:

```bash
cd backend

# Open Prisma Studio
npm run prisma:studio

# Or use pg_dump for PostgreSQL
pg_dump -U postgres aem_portal > backup.sql
```

---

## Next Steps

### After Seeding Data

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Browse Components**:
   - Open http://localhost:3000
   - Log in with Azure AD
   - Browse the component catalog

4. **Test Search & Filters**:
   - Search by keyword
   - Filter by status
   - Filter by tags
   - Filter by team

### Customization

1. **Replace Placeholder Content**:
   - Update component descriptions
   - Add real screenshots
   - Replace Figma links with your design system

2. **Add Your Components**:
   - Follow the wiki template
   - Document your actual AEM components
   - Set up sync service for automatic updates

3. **Configure Teams**:
   - Update owner teams to match your organization
   - Set up proper RBAC roles
   - Configure Azure AD groups

---

## Example Data Statistics

| Type | Count | Description |
|------|-------|-------------|
| Components | 15 | STABLE (14) + EXPERIMENTAL (1) |
| Fragments | 2 | Content (1) + Experience (1) |
| Patterns | 2 | Composition patterns |
| Users | 3 | Admin, Designer, Developer |
| Tags | 25+ | Searchable metadata |
| Sync Logs | 1 | Sample successful sync |

### Components by Category

- **Layout**: 5 (Hero, Navigation, Footer, Breadcrumb, Card)
- **Interactive**: 6 (Button, Accordion, Tabs, Modal, Carousel, Form Field)
- **Content**: 4 (Text, Image, Video, Alert)

### Components by Status

- **STABLE**: 14 components
- **EXPERIMENTAL**: 1 component (Carousel)
- **DEPRECATED**: 0 components

---

## Real-World Usage Tips

1. **Start Small**: Begin with 3-5 core components, then expand
2. **Document Incrementally**: Add components as you build them
3. **Keep Wiki Updated**: Treat Wiki as single source of truth
4. **Use Tags Wisely**: Consistent tagging improves discoverability
5. **Add Screenshots**: Visual references are crucial for adoption
6. **Link to Figma**: Design-to-code alignment is key
7. **Set Ownership**: Clear ownership ensures maintenance

---

## Resources

- **Seed Script**: `backend/prisma/seed.ts`
- **Example Wiki Pages**: `docs/example-wiki-pages/`
- **Wiki Template**: `docs/WIKI_TEMPLATE.md`
- **Figma Integration Guide**: `FIGMA_INTEGRATION_ANALYSIS.md`
- **Repository Overview**: `REPOSITORY_OVERVIEW.md`
- **Prisma Schema**: `backend/prisma/schema.prisma`

---

## Support

For questions about example components or seed data:

1. Check this guide first
2. Review the seed script code
3. Consult Prisma documentation
4. Check Azure DevOps Wiki API docs

**Happy building! 🚀**

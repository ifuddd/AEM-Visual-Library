# Figma Integration Analysis

## Current State: Basic Manual Integration ✅

The AEM Visual Portal currently supports **basic Figma integration** through manual link storage and display. Here's what's implemented:

### ✅ What's Working

#### 1. **Data Storage** (`backend/prisma/schema.prisma:43`)
```prisma
model Component {
  // ...
  figmaLinks    String[] @default([])
  // ...
}
```
- `figmaLinks` field stores multiple Figma URLs as a string array
- Supports multiple design files per component
- Properly indexed and queryable

#### 2. **Wiki Sync Integration** (`docs/WIKI_TEMPLATE.md:15-16`)
```yaml
figma_links:
  - https://www.figma.com/file/abc123/Component-Library?node-id=1234
```
- Azure DevOps Wiki pages can include Figma links in YAML frontmatter
- Sync service automatically reads and stores these links
- Updates happen every 6 hours via Azure Function

#### 3. **Frontend Display** (`frontend/src/components/detail/DesignerTab.tsx`)
- **Link Display**: Shows all Figma links with clickable buttons
- **Embedded Preview**: Automatically embeds first Figma file using iframe
- **Figma Icon**: Proper Figma branding with SVG icon
- **Responsive Layout**: Clean, user-friendly interface

```tsx
<iframe
  src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaLinks[0])}`}
  className="w-full h-full"
  allowFullScreen
/>
```

#### 4. **API Support** (`backend/src/routes/components.routes.ts`)
- Create/update components with Figma links via REST API
- Validation through Joi schemas
- Full CRUD operations supported

---

## ❌ What's NOT Implemented

### 1. **Figma API Integration**
- **No authentication** with Figma API
- **No automatic sync** from Figma to portal
- **No webhook** support for Figma file updates
- **No metadata extraction** (node names, versions, component properties)

### 2. **Figma Plugin**
- No custom Figma plugin to push/sync data
- No two-way synchronization
- No "Publish to Portal" button in Figma

### 3. **Advanced Features**
- No version history tracking from Figma
- No automatic thumbnail generation from Figma frames
- No design token extraction
- No component property mapping
- No collaboration features (comments, annotations)
- No design-to-code diffing

### 4. **Automation**
- Manual process to add Figma links
- No automatic discovery of new Figma components
- No validation of Figma link accessibility
- No broken link detection

---

## 🔧 Making the System "Figma Integration Ready"

### ✅ Already Ready For:

1. **Basic Design Documentation**
   - Store and display Figma design links ✅
   - Link components to their design files ✅
   - Embed Figma previews in the portal ✅

2. **Manual Workflow**
   - Designers add Figma links to Wiki pages ✅
   - Links sync automatically to portal ✅
   - Developers can view designs in context ✅

3. **Design System Consumption**
   - View Figma design system components ✅
   - Link AEM components to Figma components ✅
   - Reference designs during development ✅

### 🚧 What You'd Need For Advanced Integration:

#### Phase 1: Figma API Integration (2-3 weeks)
```typescript
// Example implementation needed:
interface FigmaService {
  // Authenticate with Figma API
  authenticate(apiToken: string): Promise<void>;

  // Fetch file metadata
  getFile(fileKey: string): Promise<FigmaFile>;

  // Extract components from file
  getComponents(fileKey: string): Promise<FigmaComponent[]>;

  // Generate thumbnails
  getImageUrls(fileKey: string, nodeIds: string[]): Promise<Map<string, string>>;

  // Subscribe to webhooks
  registerWebhook(fileKey: string, webhookUrl: string): Promise<void>;
}
```

**Required:**
- Figma Personal Access Token or OAuth integration
- Figma REST API client
- Webhook endpoint to receive Figma updates
- Background job to sync Figma metadata

**Files to Create:**
- `backend/src/services/figma.service.ts` - Figma API client
- `backend/src/routes/figma.routes.ts` - Webhook endpoints
- `backend/src/jobs/figma-sync.job.ts` - Scheduled sync job
- `backend/prisma/schema.prisma` - Add Figma metadata models

#### Phase 2: Figma Plugin Development (3-4 weeks)
```typescript
// Figma plugin to publish components to portal
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'publish-component') {
    const selection = figma.currentPage.selection[0];

    // Extract component metadata
    const metadata = {
      name: selection.name,
      description: selection.description,
      properties: extractProperties(selection),
      thumbnail: await selection.exportAsync({ format: 'PNG' }),
    };

    // Send to AEM Portal API
    await fetch('https://portal.example.com/api/components', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(metadata),
    });
  }
};
```

**Required:**
- Figma Plugin UI with React
- Authentication flow from plugin to portal
- Component selection and metadata extraction
- Image export and upload
- Bidirectional sync status

**Files to Create:**
- `figma-plugin/` - New package
- `figma-plugin/manifest.json` - Plugin config
- `figma-plugin/code.ts` - Plugin logic
- `figma-plugin/ui.html` - Plugin UI

#### Phase 3: Advanced Features (4-6 weeks)
- **Version Tracking**: Track Figma file versions, show change history
- **Design Tokens**: Extract and sync colors, typography, spacing
- **Component Variants**: Map Figma variants to AEM component variations
- **Auto-thumbnails**: Generate component thumbnails from Figma frames
- **Diff View**: Show design vs. implementation differences
- **Design QA**: Automated checks for design consistency

---

## 📋 Integration Readiness Checklist

### ✅ Ready Now (Manual Integration)
- [x] Store Figma links in database
- [x] Display Figma links in UI
- [x] Embed Figma files in preview
- [x] Include Figma links in Wiki sync
- [x] API endpoints for CRUD operations
- [x] Frontend components for viewing designs

### ⚠️ Partially Ready (Needs Configuration)
- [ ] Figma API token/OAuth setup
- [ ] Webhook endpoint configuration
- [ ] CORS configuration for Figma embed
- [ ] Link validation (check if Figma file is accessible)
- [ ] Broken link detection

### ❌ Not Ready (Requires Development)
- [ ] Figma API service layer
- [ ] Automatic metadata extraction
- [ ] Figma plugin development
- [ ] Two-way sync capabilities
- [ ] Version history tracking
- [ ] Design token extraction
- [ ] Thumbnail auto-generation from Figma
- [ ] Webhook handling for Figma updates
- [ ] Component property mapping
- [ ] Design-to-code diffing

---

## 🎯 Recommendations

### For Current Usage (Immediate - 0 weeks)
**You can start using the system RIGHT NOW for:**
1. Linking components to Figma designs manually
2. Viewing Figma files embedded in the portal
3. Storing multiple Figma links per component
4. Syncing Figma links from Wiki pages

**How to use:**
```yaml
# In Azure DevOps Wiki page frontmatter:
figma_links:
  - https://www.figma.com/file/abc123/Design-System?node-id=1234
  - https://www.figma.com/file/def456/Component-Specs?node-id=5678
```

### For Enhanced Integration (Short-term - 2-4 weeks)
1. **Add Figma API Service**
   - Implement basic Figma API client
   - Fetch file metadata and thumbnails
   - Validate links are accessible
   - Auto-generate thumbnails from Figma frames

2. **Improve UI/UX**
   - Add link validation indicators
   - Show Figma file/frame names
   - Display last updated timestamp from Figma
   - Add "Copy Figma Link" buttons

3. **Add Monitoring**
   - Detect broken Figma links
   - Alert when Figma files are deleted/moved
   - Track Figma file version changes

### For Full Integration (Long-term - 3-6 months)
1. **Develop Figma Plugin**
   - One-click publish from Figma to portal
   - Bidirectional sync
   - Component mapping

2. **Advanced Features**
   - Design token extraction
   - Version history
   - Design QA tools

---

## 🔗 Figma Embed Limitations

### Current Implementation
The embed works for **public Figma files** or files shared with proper permissions:

```typescript
// Embed URL format:
https://www.figma.com/embed?embed_host=share&url={FIGMA_FILE_URL}
```

### Known Issues
1. **Authentication**: Embedded files must be publicly accessible or shared
2. **Private Files**: Won't embed if viewer lacks permissions
3. **Iframe Restrictions**: Some browsers block third-party cookies
4. **Performance**: Large files may load slowly in iframe

### Workarounds
- Use Figma's "Share" → "Get embed code" for complex embedding needs
- Consider using Figma's thumbnail API for static previews
- Implement fallback to "Open in Figma" button if embed fails

---

## 📚 Resources for Advanced Integration

### Figma API Documentation
- [Figma REST API](https://www.figma.com/developers/api)
- [Figma Webhooks](https://www.figma.com/developers/api#webhooks)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)

### Useful Figma API Endpoints
```
GET https://api.figma.com/v1/files/:file_key
GET https://api.figma.com/v1/files/:file_key/components
GET https://api.figma.com/v1/images/:file_key
POST https://api.figma.com/v2/webhooks
```

### Example Figma API Token Setup
```bash
# Add to .env
FIGMA_API_TOKEN=figd_xxxxxxxxxxxxxxxxxxxx
FIGMA_WEBHOOK_SECRET=xxxxxxxxxxxxx
```

---

## ✅ Summary: Is the System Ready for Figma Integration?

### Answer: **YES** for basic integration, **NO** for advanced features

**What works today:**
- ✅ Manual linking of Figma files to components
- ✅ Displaying and embedding Figma designs
- ✅ Storing multiple Figma links per component
- ✅ Auto-sync from Wiki pages to portal

**What you can do immediately:**
1. Add Figma links to component Wiki pages
2. View Figma designs in the portal
3. Embed Figma files for review
4. Link design system to code components

**What requires additional work:**
1. ❌ Automatic Figma API sync
2. ❌ Figma plugin for two-way sync
3. ❌ Version history tracking
4. ❌ Design token extraction
5. ❌ Auto-generated thumbnails from Figma

**Bottom line:** The system is **production-ready for manual Figma integration** but would need 2-6 months of additional development for automated, bidirectional Figma API integration.

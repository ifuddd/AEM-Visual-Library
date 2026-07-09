# Example Wiki Pages

This directory contains sample Azure DevOps Wiki pages for AEM components. These pages demonstrate the proper format and structure for component documentation that will be synced to the AEM Visual Portal.

## Contents

| File | Component | Status | Description |
|------|-----------|--------|-------------|
| `Hero-Banner.md` | Hero Banner | Stable | Large page header with image and CTAs |
| `CTA-Button.md` | CTA Button | Stable | Call-to-action button component |
| `Card.md` | Card | Stable | Flexible content card component |

## How to Use

### Option 1: Upload to Azure DevOps Wiki

1. Navigate to your Azure DevOps Wiki:
   ```
   https://dev.azure.com/{organization}/{project}/_wiki
   ```

2. Create a new Wiki or navigate to existing one

3. Create a folder structure for components:
   ```
   Wiki/
   ├── Components/
   │   ├── Hero-Banner.md
   │   ├── CTA-Button.md
   │   └── Card.md
   ```

4. Copy and paste the content from these files

5. **Important**: Ensure the YAML frontmatter (content between `---` markers) is preserved exactly as shown

6. Configure the sync service with your Azure DevOps credentials

7. The sync service will automatically parse these pages and create/update components in the portal

### Option 2: Use as Templates

1. Copy one of these files as a template:
   ```bash
   cp Hero-Banner.md My-New-Component.md
   ```

2. Edit the frontmatter fields:
   - Change `component_id` to a unique slug
   - Update `title`, `description`, etc.
   - Modify `figma_links`, `aem_component_path`, etc.

3. Update the markdown content to match your component

4. Upload to Azure DevOps Wiki

### Option 3: Reference for Seed Script

These files match the components created by the seed script (`backend/prisma/seed.ts`). You can use them as reference when customizing the seed data.

## Frontmatter Structure

Each wiki page must include YAML frontmatter at the top:

```yaml
---
component_id: unique-slug          # Required: Unique identifier
title: Component Display Name      # Required: Human-readable name
description: Short description     # Required: 1-2 sentence summary
status: stable                     # Required: stable/experimental/deprecated
owner_team: Team Name              # Required: Owning team
owner_email: team@example.com      # Optional: Contact email
figma_links:                       # Optional: Array of Figma URLs
  - https://www.figma.com/file/...
aem_component_path: /apps/...      # Optional: AEM resource path
aem_allowed_children:              # Optional: Allowed child components
  - child-component-1
aem_dialog_schema:                 # Optional: Dialog field definitions
  fieldName:
    type: textfield
    required: true
aem_template_constraints:          # Optional: Template restrictions
  allowedParents:
    - container
aem_limitations:                   # Optional: Known limitations
  - Limitation description
tags:                              # Optional: Searchable tags
  - tag1
  - tag2
---
```

## Key Points

### ✅ Do's

- ✅ Keep `component_id` unique and URL-friendly (lowercase, hyphens)
- ✅ Use valid YAML syntax (proper indentation, no tabs)
- ✅ Include all required fields
- ✅ Keep descriptions concise (1-2 sentences)
- ✅ Use full Figma URLs with `node-id` parameter
- ✅ Follow the markdown content structure shown in examples

### ❌ Don'ts

- ❌ Don't use tabs in YAML (use 2 spaces for indentation)
- ❌ Don't forget the closing `---` after frontmatter
- ❌ Don't include HTML in frontmatter fields
- ❌ Don't use duplicate `component_id` values
- ❌ Don't skip required fields

## Sync Service Behavior

When the sync service runs (every 6 hours by default):

1. **Fetches** all wiki pages from Azure DevOps
2. **Parses** the YAML frontmatter using `gray-matter`
3. **Validates** required fields
4. **Upserts** components to the database (creates if new, updates if exists)
5. **Logs** sync results to the `SyncLog` table

**Matching Logic**: Components are matched by `component_id` (slug). If a component with that slug exists, it will be updated. Otherwise, a new component is created.

## Customization Guide

### Adding Figma Links

Replace the example Figma URLs with your actual design files:

```yaml
figma_links:
  - https://www.figma.com/file/abc123/Your-Design-System?node-id=123-456
  - https://www.figma.com/file/def789/Component-Specs?node-id=789-012
```

**How to get Figma links**:
1. Open Figma file
2. Select frame/component
3. Right-click → "Copy link"
4. Paste in frontmatter

### Updating AEM Metadata

Modify the AEM-specific fields to match your project:

```yaml
aem_component_path: /apps/yourproject/components/component-name
aem_allowed_children:
  - your-child-component
aem_dialog_schema:
  yourField:
    type: textfield
    required: true
  yourSelectField:
    type: select
    options: [option1, option2, option3]
```

### Adding Custom Fields

While these fields are the standard set, you can add additional information in the markdown content. The sync service currently only parses the frontmatter fields listed above.

## Validation

Before uploading to Azure DevOps, validate your YAML:

### Online Tools
- [YAML Lint](http://www.yamllint.com/)
- [JSON to YAML](https://www.json2yaml.com/) (useful for converting JSON schemas)

### Command Line
```bash
# If you have yamllint installed
yamllint Hero-Banner.md
```

### Node.js
```javascript
const matter = require('gray-matter');
const fs = require('fs');

const content = fs.readFileSync('Hero-Banner.md', 'utf8');
const { data } = matter(content);
console.log(data); // Parsed frontmatter
```

## Troubleshooting

### Issue: Component not syncing

**Check**:
1. YAML frontmatter is valid (use YAML linter)
2. All required fields are present (`component_id`, `title`, `description`, `status`, `owner_team`)
3. Indentation uses spaces, not tabs
4. Closing `---` is present
5. Sync service has access to the Wiki (check PAT permissions)

### Issue: Figma links not working

**Check**:
1. Links are in array format (even for single link):
   ```yaml
   figma_links:
     - https://...
   ```
2. Links include the full URL with protocol (`https://`)
3. Links include `node-id` parameter for specific frames

### Issue: Dialog schema not parsing

**Check**:
1. YAML structure is valid (proper nesting)
2. Field definitions use correct syntax
3. No special characters without quotes

**Example valid schema**:
```yaml
aem_dialog_schema:
  title:
    type: textfield
    required: true
    maxlength: 100
  variant:
    type: select
    options: [primary, secondary, tertiary]
```

## Next Steps

1. **Review** the example files to understand the structure
2. **Customize** the content for your components
3. **Upload** to Azure DevOps Wiki
4. **Configure** sync service with your Azure DevOps credentials
5. **Test** by manually triggering a sync
6. **Verify** components appear in the portal

## Related Documentation

- **Wiki Template**: `../WIKI_TEMPLATE.md` - Detailed template with guidelines
- **Example Components Guide**: `../EXAMPLE_COMPONENTS_GUIDE.md` - How to use seed data
- **Figma Integration**: `../../FIGMA_INTEGRATION_ANALYSIS.md` - Figma integration details
- **Sync Service**: `../../sync-service/` - Sync service implementation

## Support

For questions about wiki page format or sync issues:

1. Review the [Wiki Template](../WIKI_TEMPLATE.md)
2. Check the [Example Components Guide](../EXAMPLE_COMPONENTS_GUIDE.md)
3. Verify YAML syntax with a linter
4. Review sync service logs in database (`SyncLog` table)

---

**Note**: These are example files with placeholder data (emails, Figma links, images). Replace with your actual component information before using in production.

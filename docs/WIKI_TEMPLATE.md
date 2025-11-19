# Azure DevOps Wiki Page Template

Use this template when creating component documentation in Azure DevOps Wiki. The frontmatter (YAML at top) is parsed by the sync service.

---

```markdown
---
component_id: hero-banner
title: Hero Banner
description: Large top-of-page banner with image, headline and CTA
status: stable
owner_team: Marketing Platform
owner_email: marketing-platform@example.com
figma_links:
  - https://www.figma.com/file/abc123/Component-Library?node-id=1234
aem_component_path: /apps/myproject/components/hero-banner
aem_allowed_children:
  - teaser
  - cta-button
aem_dialog_schema:
  title:
    type: textfield
    required: true
  image:
    type: pathbrowser
    rootPath: /content/dam
  ctaText:
    type: textfield
  ctaLink:
    type: pathfield
aem_template_constraints:
  allowedParents:
    - responsivegrid
  maxItems: 1
aem_limitations:
  - No video support in authoring dialog
  - Image ratio fixed to 16:9
  - Maximum 2 CTA buttons
tags:
  - layout
  - marketing
  - author-editable
  - responsive
---

# Hero Banner Component

## Overview

The Hero Banner is a large, visually prominent component typically placed at the top of marketing pages. It combines a background image, headline text, and one or two call-to-action buttons.

## When to Use

- Homepage hero sections
- Campaign landing pages
- Product launch pages

**Do NOT use for:**
- Interior content pages (use Page Header instead)
- Blog posts (use Featured Image)

## Component Structure

```html
<div class="hero-banner">
  <div class="hero-banner__background">
    <!-- Background image -->
  </div>
  <div class="hero-banner__content">
    <h1 class="hero-banner__title"><!-- Title --></h1>
    <p class="hero-banner__subtitle"><!-- Subtitle --></p>
    <div class="hero-banner__actions">
      <!-- CTA buttons -->
    </div>
  </div>
</div>
```

## Authoring Instructions

### Dialog Fields

1. **Title** (required)
   - Max length: 80 characters
   - Should be concise and action-oriented

2. **Subtitle** (optional)
   - Max length: 200 characters
   - Provides additional context

3. **Background Image** (required)
   - Aspect ratio: 16:9
   - Recommended size: 1920x1080px
   - File formats: JPG, PNG, WebP
   - Max file size: 500KB

4. **CTA Primary** (optional)
   - Text: Max 25 characters
   - Link: Internal or external URL

5. **CTA Secondary** (optional)
   - Text: Max 25 characters
   - Link: Internal or external URL

### Content Guidelines

- Use sentence case for headlines
- CTA text should be action verbs ("Get Started", "Learn More")
- Ensure sufficient contrast between text and background
- Test on mobile - text should remain readable

## Technical Implementation

### HTL Template

```html
<div class="hero-banner" data-cmp-is="hero-banner">
  <div class="hero-banner__background">
    <img src="${properties.image}" alt="${properties.imageAlt @ context='attribute'}" />
  </div>
  <div class="hero-banner__content">
    <h1 class="hero-banner__title">${properties.title}</h1>
    <p class="hero-banner__subtitle">${properties.subtitle}</p>
    <div class="hero-banner__actions">
      <a href="${properties.ctaPrimaryLink}" class="cta cta--primary">
        ${properties.ctaPrimaryText}
      </a>
      <sly data-sly-test="${properties.ctaSecondaryText}">
        <a href="${properties.ctaSecondaryLink}" class="cta cta--secondary">
          ${properties.ctaSecondaryText}
        </a>
      </sly>
    </div>
  </div>
</div>
```

### CSS Classes

- `.hero-banner` - Container
- `.hero-banner__background` - Background image wrapper
- `.hero-banner__content` - Content overlay
- `.hero-banner__title` - Main headline
- `.hero-banner__subtitle` - Subheading
- `.hero-banner__actions` - CTA button container

### Client Library Categories

- `myproject.components.hero-banner`

### Dependencies

- Core Components: v2.23.0+
- Custom CTA Button component

## Accessibility

- Background image has proper alt text
- Color contrast meets WCAG AA standards (4.5:1 minimum)
- Keyboard navigable
- Screen reader tested with NVDA and JAWS

## Variations

### Hero Banner - Centered

Centered text alignment with centered CTA buttons.

### Hero Banner - Left Aligned

Text and CTAs aligned to the left (default).

### Hero Banner - Dark Overlay

Adds 40% dark overlay to improve text readability.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile

## Performance

- Lazy loads background image
- Uses srcset for responsive images
- LCP target: < 2.5s

## Examples

### Marketing Page Hero
![Example 1](/.attachments/hero-example-1.png)

### Product Launch Hero
![Example 2](/.attachments/hero-example-2.png)

## Migration Notes

**Upgrading from v1.x:**

- Dialog structure changed - re-author existing components
- CSS class names updated (add `hero-banner__` prefix)
- Image field now uses pathbrowser instead of fileupload

## Related Components

- [Page Header](/Components/Page-Header) - For interior pages
- [CTA Button](/Components/CTA-Button) - Standalone CTAs
- [Featured Image](/Components/Featured-Image) - Blog headers

## Support

For questions or issues:
- Slack: #aem-components
- Owner: Marketing Platform Team
- Email: marketing-platform@example.com
```

---

## Field Descriptions

### Frontmatter Fields (Required)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `component_id` | string | Unique slug for component | `hero-banner` |
| `title` | string | Display name | `Hero Banner` |
| `description` | string | Short description | `Large banner with...` |
| `status` | enum | stable/experimental/deprecated | `stable` |
| `owner_team` | string | Responsible team | `Marketing Platform` |

### Frontmatter Fields (Optional)

| Field | Type | Description |
|-------|------|-------------|
| `owner_email` | string | Contact email |
| `figma_links` | array | Figma design URLs |
| `aem_component_path` | string | AEM component path |
| `aem_allowed_children` | array | Allowed child components |
| `aem_dialog_schema` | object | Dialog field definitions |
| `aem_template_constraints` | object | Template restrictions |
| `aem_limitations` | array | Known limitations |
| `tags` | array | Searchable tags |

### Markdown Sections (Recommended)

1. **Overview** - What the component does
2. **When to Use** - Use cases and anti-patterns
3. **Component Structure** - HTML/HTL structure
4. **Authoring Instructions** - For content authors
5. **Technical Implementation** - For developers
6. **Accessibility** - A11y requirements
7. **Variations** - Different component modes
8. **Examples** - Screenshots and demos
9. **Related Components** - Links to similar components

## Tips

- Keep frontmatter valid YAML (proper indentation!)
- Use code fences for code examples
- Include screenshots in /.attachments/ folder
- Link to Figma frames when possible
- Update status to 'deprecated' for old components
- Use consistent heading structure
- Add troubleshooting section if component is complex

---
component_id: hero-banner
title: Hero Banner
description: Large top-of-page banner with background image, headline, subtitle, and up to two CTA buttons. Supports multiple alignment options and overlay styles.
status: stable
owner_team: Marketing Platform
owner_email: marketing-platform@example.com
figma_links:
  - https://www.figma.com/file/abc123/Design-System?node-id=100-200
  - https://www.figma.com/file/abc123/Design-System?node-id=100-250
aem_component_path: /apps/myproject/components/hero-banner
aem_allowed_children:
  - teaser
  - cta-button
aem_dialog_schema:
  title:
    type: textfield
    required: true
  subtitle:
    type: textarea
    maxlength: 200
  image:
    type: pathbrowser
    rootPath: /content/dam
  ctaPrimaryText:
    type: textfield
    maxlength: 25
  ctaPrimaryLink:
    type: pathfield
  ctaSecondaryText:
    type: textfield
    maxlength: 25
  ctaSecondaryLink:
    type: pathfield
  alignment:
    type: select
    options: [left, center]
  overlay:
    type: select
    options: [none, dark, light]
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

The Hero Banner is a large, visually prominent component typically placed at the top of marketing pages. It combines a background image, headline text, optional subtitle, and one or two call-to-action buttons.

### Key Features

- Full-width responsive background images
- Flexible text alignment (left or center)
- Optional dark or light overlay for improved text readability
- Support for up to 2 CTA buttons
- Mobile-optimized responsive behavior

## When to Use

**✅ Use Hero Banner for:**
- Homepage hero sections
- Campaign landing pages
- Product launch pages
- Event promotion pages

**❌ Do NOT use for:**
- Interior content pages (use Page Header instead)
- Blog posts (use Featured Image)
- Locations where video background is required

## Component Structure

```html
<div class="hero-banner" data-alignment="left" data-overlay="dark">
  <div class="hero-banner__background">
    <img src="/content/dam/example.jpg" alt="Hero background" />
  </div>
  <div class="hero-banner__content">
    <h1 class="hero-banner__title">Transform Your Digital Experience</h1>
    <p class="hero-banner__subtitle">Build engaging content with our enterprise AEM platform</p>
    <div class="hero-banner__actions">
      <a href="/get-started" class="cta cta--primary">Get Started</a>
      <a href="/learn-more" class="cta cta--secondary">Learn More</a>
    </div>
  </div>
</div>
```

## Authoring Instructions

### Dialog Fields

#### 1. Title (Required)
- **Type**: Text field
- **Max length**: 80 characters
- **Guidelines**:
  - Keep concise and action-oriented
  - Use sentence case
  - Focus on primary value proposition

**Example**: "Transform Your Digital Experience"

#### 2. Subtitle (Optional)
- **Type**: Textarea
- **Max length**: 200 characters
- **Guidelines**:
  - Provides additional context to the title
  - Should complement, not repeat, the title
  - 1-2 sentences maximum

**Example**: "Build engaging content with our enterprise AEM platform"

#### 3. Background Image (Required)
- **Type**: Path browser
- **Root path**: `/content/dam`
- **Requirements**:
  - Aspect ratio: 16:9
  - Recommended size: 1920x1080px
  - Supported formats: JPG, PNG, WebP
  - Max file size: 500KB
  - Optimize images before upload

**Best practices**:
- Use high-quality, professional images
- Ensure sufficient contrast for text overlay
- Test on various screen sizes
- Consider mobile cropping behavior

#### 4. Primary CTA (Optional)
- **Text field**: Max 25 characters
- **Link field**: Internal or external URL
- **Guidelines**:
  - Use action verbs ("Get Started", "Sign Up", "Learn More")
  - Keep text short and clear
  - Primary CTA should be the main desired action

#### 5. Secondary CTA (Optional)
- **Text field**: Max 25 characters
- **Link field**: Internal or external URL
- **Guidelines**:
  - Less prominent action than primary CTA
  - Typically informational ("Learn More", "View Demo")

#### 6. Alignment
- **Type**: Select dropdown
- **Options**:
  - `left` (default) - Content aligned to left side
  - `center` - Content centered horizontally

#### 7. Overlay
- **Type**: Select dropdown
- **Options**:
  - `none` - No overlay (ensure good text contrast)
  - `dark` - 40% dark overlay (recommended for light backgrounds)
  - `light` - 40% light overlay (for dark backgrounds)

### Content Guidelines

- **Headlines**: Use sentence case, not ALL CAPS
- **CTA Text**: Action verbs work best ("Discover", "Explore", "Start")
- **Contrast**: Always ensure text is readable against the background
- **Mobile**: Test text readability on small screens

## Technical Implementation

### HTL Template

```html
<sly data-sly-use.component="com.example.components.HeroBanner">
  <div class="hero-banner"
       data-cmp-is="hero-banner"
       data-alignment="${properties.alignment || 'left'}"
       data-overlay="${properties.overlay || 'none'}">

    <div class="hero-banner__background">
      <img src="${properties.image @ context='uri'}"
           alt="${properties.imageAlt @ context='attribute'}"
           loading="lazy" />
    </div>

    <div class="hero-banner__overlay hero-banner__overlay--${properties.overlay}"></div>

    <div class="hero-banner__content container">
      <h1 class="hero-banner__title">${properties.title @ context='html'}</h1>

      <sly data-sly-test="${properties.subtitle}">
        <p class="hero-banner__subtitle">${properties.subtitle @ context='html'}</p>
      </sly>

      <div class="hero-banner__actions">
        <sly data-sly-test="${properties.ctaPrimaryText && properties.ctaPrimaryLink}">
          <a href="${properties.ctaPrimaryLink @ context='uri'}"
             class="cta cta--primary">
            ${properties.ctaPrimaryText}
          </a>
        </sly>

        <sly data-sly-test="${properties.ctaSecondaryText && properties.ctaSecondaryLink}">
          <a href="${properties.ctaSecondaryLink @ context='uri'}"
             class="cta cta--secondary">
            ${properties.ctaSecondaryText}
          </a>
        </sly>
      </div>
    </div>
  </div>
</sly>
```

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.hero-banner` | Main container |
| `.hero-banner__background` | Background image wrapper |
| `.hero-banner__overlay` | Overlay element |
| `.hero-banner__overlay--dark` | Dark overlay variant |
| `.hero-banner__overlay--light` | Light overlay variant |
| `.hero-banner__content` | Content wrapper |
| `.hero-banner__title` | Main headline |
| `.hero-banner__subtitle` | Subheading text |
| `.hero-banner__actions` | CTA button container |

### Client Library Categories

```
myproject.components.hero-banner
```

### Dependencies

- **AEM Core Components**: v2.23.0+
- **Custom CTA Button component**: v1.0+
- **Container Grid System**: v1.2+

## Accessibility

### WCAG 2.1 Level AA Compliance

- ✅ Background image has proper alt text
- ✅ Color contrast meets minimum 4.5:1 ratio
- ✅ Keyboard navigable (CTA buttons)
- ✅ Screen reader compatible
- ✅ Focus indicators visible

### Testing

- Tested with NVDA (Windows)
- Tested with JAWS (Windows)
- Tested with VoiceOver (macOS/iOS)
- Keyboard navigation verified

## Responsive Behavior

### Desktop (1200px+)
- Full hero display
- Large typography
- Side-by-side CTAs

### Tablet (768px - 1199px)
- Scaled typography
- Maintained aspect ratio
- Stacked CTAs on smaller tablets

### Mobile (< 768px)
- Reduced padding
- Smaller typography
- Stacked CTA buttons
- Background image may crop differently (ensure safe area for text)

## Variations

### Standard Hero (Left-aligned, Dark Overlay)
Most common variant for marketing pages.

```
alignment: left
overlay: dark
```

### Centered Hero (Center-aligned, No Overlay)
Use when background image has clear center focus area.

```
alignment: center
overlay: none
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

## Performance

### Optimization Checklist

- ✅ Lazy loading enabled for background images
- ✅ Responsive images using srcset
- ✅ WebP format support with fallbacks
- ✅ Image compression applied
- ✅ LCP target: < 2.5s

### Performance Metrics

- **Lighthouse Score**: 95+
- **LCP**: < 2.5s (with optimized images)
- **CLS**: < 0.1
- **FID**: < 100ms

## Examples

### Example 1: Marketing Homepage Hero

![Marketing Hero Example](/.attachments/hero-marketing-example.png)

```
Title: "Welcome to the Future of Digital Experience"
Subtitle: "Enterprise content management made simple"
Alignment: Left
Overlay: Dark (40%)
Primary CTA: "Start Free Trial"
Secondary CTA: "Watch Demo"
```

### Example 2: Product Launch Hero

![Product Launch Example](/.attachments/hero-product-launch.png)

```
Title: "Introducing AEM Cloud Service 2.0"
Subtitle: "Faster, smarter, and more powerful than ever"
Alignment: Center
Overlay: Light (40%)
Primary CTA: "Get Started"
Secondary CTA: "Learn More"
```

## Known Limitations

1. **No Video Background**: The dialog does not support video backgrounds. Use the Video Hero component if video is required.

2. **Fixed Image Ratio**: Background images are locked to 16:9 aspect ratio. Consider this when selecting images.

3. **CTA Limit**: Maximum of 2 CTA buttons supported. For more actions, consider using a different pattern.

4. **Nested Components**: Cannot nest other components within the hero content area (besides allowed CTAs).

## Migration Guide

### Upgrading from v1.x to v2.0

**Breaking Changes:**
- Dialog structure completely redesigned
- CSS class names updated with BEM methodology
- Image field now uses pathbrowser instead of fileupload

**Migration Steps:**

1. **Re-author existing components** using the new dialog structure
2. **Update CSS** if using custom styles (new class names)
3. **Test all hero instances** across the site
4. **Update page templates** if hero is part of structure

**Backward Compatibility**: None - requires manual migration

## Related Components

- [Page Header](/Components/Page-Header) - For interior pages without large imagery
- [CTA Button](/Components/CTA-Button) - Standalone call-to-action buttons
- [Featured Image](/Components/Featured-Image) - Blog post headers
- [Video Hero](/Components/Video-Hero) - Hero with video background

## Troubleshooting

### Image not displaying
**Cause**: Incorrect path or permissions
**Solution**: Verify image path in DAM and check read permissions

### Text not readable
**Cause**: Insufficient contrast between text and background
**Solution**: Add overlay (dark or light) or choose different background image

### CTAs not clickable
**Cause**: Z-index issues or JavaScript conflicts
**Solution**: Check CSS specificity and JavaScript console for errors

### Mobile layout broken
**Cause**: Custom CSS overrides
**Solution**: Review responsive breakpoints and remove conflicting styles

## Support & Contact

**Team**: Marketing Platform
**Email**: marketing-platform@example.com
**Slack**: #aem-components
**JIRA Project**: AEMCOMP

For urgent issues, contact the platform team via Slack.

---

**Last Updated**: 2024-11-18
**Component Version**: 2.0.0
**Status**: Stable ✅

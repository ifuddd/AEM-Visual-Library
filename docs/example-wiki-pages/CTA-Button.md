---
component_id: cta-button
title: CTA Button
description: Call-to-action button component with multiple style variants (primary, secondary, tertiary, ghost) and size options. Supports internal and external links.
status: stable
owner_team: Design System
owner_email: design-system@example.com
figma_links:
  - https://www.figma.com/file/abc123/Design-System?node-id=200-300
aem_component_path: /apps/myproject/components/cta-button
aem_dialog_schema:
  text:
    type: textfield
    required: true
    maxlength: 30
  link:
    type: pathfield
    required: true
  variant:
    type: select
    options: [primary, secondary, tertiary, ghost]
  size:
    type: select
    options: [small, medium, large]
  openInNewTab:
    type: checkbox
  icon:
    type: select
    options: [none, arrow-right, download, external]
aem_limitations:
  - No custom icon upload support
tags:
  - action
  - interactive
  - author-editable
  - atomic
---

# CTA Button Component

## Overview

The CTA (Call-to-Action) Button is a fundamental interactive component used throughout the site to drive user actions. It provides consistent styling, accessibility, and behavior across all touchpoints.

### Key Features

- 4 visual variants (primary, secondary, tertiary, ghost)
- 3 size options (small, medium, large)
- Optional icons (arrow-right, download, external)
- Responsive and touch-friendly
- WCAG 2.1 AA compliant
- Keyboard accessible

## When to Use

**✅ Use CTA Button for:**
- Primary actions (sign up, download, submit)
- Secondary actions (learn more, cancel)
- Navigation to key pages
- Form submissions
- Downloads and external links

**❌ Do NOT use for:**
- Text links within paragraphs (use standard link)
- Navigation menus (use navigation component)
- Inline actions within tables (use action icons)

## Variants

### Primary
High-emphasis button for the most important action on the page.

**Use when**: This is the primary action you want users to take.

```html
<a href="/sign-up" class="cta cta--primary cta--medium">
  Sign Up Now
</a>
```

### Secondary
Medium-emphasis button for important but not primary actions.

**Use when**: Supporting a primary action or standalone important actions.

```html
<a href="/learn-more" class="cta cta--secondary cta--medium">
  Learn More
</a>
```

### Tertiary
Low-emphasis button for less critical actions.

**Use when**: Multiple actions are available and you need hierarchy.

```html
<a href="/view-details" class="cta cta--tertiary cta--medium">
  View Details
</a>
```

### Ghost
Minimal button with transparent background.

**Use when**: On colored backgrounds or when maximum subtlety is needed.

```html
<a href="/cancel" class="cta cta--ghost cta--medium">
  Cancel
</a>
```

## Authoring Instructions

### Dialog Fields

#### 1. Button Text (Required)
- **Max length**: 30 characters
- **Guidelines**:
  - Use action verbs
  - Be concise and clear
  - Avoid articles (a, an, the)

**Examples**:
- ✅ "Get Started"
- ✅ "Download Now"
- ✅ "Learn More"
- ❌ "Click Here"
- ❌ "Submit"

#### 2. Link (Required)
- **Type**: Path field or external URL
- **Guidelines**:
  - Use internal paths when possible (`/content/site/page`)
  - External links should be full URLs (`https://example.com`)

#### 3. Variant
- **Primary**: Main action (solid, high contrast)
- **Secondary**: Supporting action (outlined)
- **Tertiary**: Less important action (text-based)
- **Ghost**: Minimal styling (transparent)

#### 4. Size
- **Small**: Compact areas, mobile, less emphasis
- **Medium**: Default size for most uses
- **Large**: Hero sections, high-emphasis areas

#### 5. Open in New Tab
- **Checkbox**: Check to open link in new tab/window
- **Use for**: External links, PDFs, long-form content

#### 6. Icon
- **None**: No icon (default)
- **Arrow Right**: Forward action, next steps
- **Download**: File downloads
- **External**: External links

## Technical Implementation

### HTL Template

```html
<sly data-sly-use.cta="com.example.components.CTAButton">
  <a href="${properties.link @ context='uri'}"
     class="cta cta--${properties.variant || 'primary'} cta--${properties.size || 'medium'}"
     data-cmp-is="cta-button"
     target="${properties.openInNewTab ? '_blank' : '_self'}"
     rel="${properties.openInNewTab ? 'noopener noreferrer' : ''}">

    <span class="cta__text">${properties.text @ context='text'}</span>

    <sly data-sly-test="${properties.icon && properties.icon != 'none'}">
      <svg class="cta__icon cta__icon--${properties.icon}" aria-hidden="true">
        <use xlink:href="#icon-${properties.icon}"></use>
      </svg>
    </sly>
  </a>
</sly>
```

### CSS Structure

```scss
.cta {
  // Base styles
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  // Focus styles
  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  // Variants
  &--primary {
    background-color: var(--color-primary);
    color: white;

    &:hover {
      background-color: var(--color-primary-dark);
    }
  }

  &--secondary {
    background-color: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);

    &:hover {
      background-color: var(--color-primary-light);
    }
  }

  // Sizes
  &--small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  &--large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
}
```

## Accessibility

### WCAG 2.1 Compliance

- ✅ Minimum contrast ratio 4.5:1 (text)
- ✅ Minimum contrast ratio 3:1 (UI elements)
- ✅ Minimum target size 44x44px (touch)
- ✅ Keyboard accessible (Tab navigation)
- ✅ Focus indicators visible
- ✅ Screen reader compatible

### ARIA Attributes

```html
<!-- For icon-only buttons -->
<a href="/download" class="cta" aria-label="Download PDF">
  <svg aria-hidden="true">...</svg>
</a>

<!-- For external links -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
  <span class="sr-only">(opens in new tab)</span>
</a>
```

## Responsive Behavior

- **Desktop**: Full size as configured
- **Tablet**: May adjust to full-width in some layouts
- **Mobile**: Often full-width for easier touch interaction

## Examples

### Primary Action
```
Text: "Get Started"
Link: /sign-up
Variant: Primary
Size: Large
Icon: Arrow Right
```

### Download Link
```
Text: "Download PDF"
Link: /content/dam/resources/guide.pdf
Variant: Secondary
Size: Medium
Icon: Download
Open in New Tab: Yes
```

### External Link
```
Text: "Visit Documentation"
Link: https://docs.example.com
Variant: Secondary
Size: Medium
Icon: External
Open in New Tab: Yes
```

## Related Components

- [Hero Banner](/Components/Hero-Banner) - Uses CTA buttons
- [Card](/Components/Card) - Often includes CTA button
- [Form Field](/Components/Form-Field) - Submit buttons

## Support

**Team**: Design System
**Email**: design-system@example.com
**Slack**: #design-system

---

**Last Updated**: 2024-11-18
**Component Version**: 1.5.0
**Status**: Stable ✅

---
component_id: card
title: Card
description: Flexible card component for displaying content with optional image, title, description, and CTA. Supports horizontal and vertical layouts with multiple style variants.
status: stable
owner_team: Content Platform
owner_email: content-platform@example.com
figma_links:
  - https://www.figma.com/file/abc123/Design-System?node-id=300-400
  - https://www.figma.com/file/abc123/Design-System?node-id=300-450
aem_component_path: /apps/myproject/components/card
aem_dialog_schema:
  image:
    type: pathbrowser
    rootPath: /content/dam
  imageAlt:
    type: textfield
  title:
    type: textfield
    required: true
    maxlength: 100
  description:
    type: textarea
    maxlength: 300
  ctaText:
    type: textfield
    maxlength: 25
  ctaLink:
    type: pathfield
  layout:
    type: select
    options: [vertical, horizontal]
  variant:
    type: select
    options: [default, elevated, outlined]
aem_limitations:
  - Horizontal layout requires minimum 768px width
tags:
  - layout
  - content
  - author-editable
  - responsive
---

# Card Component

## Overview

The Card component is a versatile container for displaying related content in a visually grouped format. Cards are one of the most flexible components in the system and can be used for a wide variety of content types.

### Key Features

- Flexible layouts (vertical/horizontal)
- Optional image with aspect ratio control
- Title, description, and CTA support
- Multiple visual variants
- Responsive behavior
- Touch-friendly on mobile

## When to Use

**✅ Use Card for:**
- Blog post previews
- Product listings
- Team member profiles
- Feature highlights
- News items
- Resource links

**❌ Do NOT use for:**
- Simple text content (use Text Block)
- Navigation menus (use Navigation)
- Large hero content (use Hero Banner)

## Layouts

### Vertical (Default)
Image on top, content below. Best for grids and equal-height layouts.

```
┌─────────────┐
│    Image    │
├─────────────┤
│ Title       │
│ Description │
│ [CTA]       │
└─────────────┘
```

**Use when:**
- Displaying cards in a grid (2, 3, or 4 columns)
- Mobile-first design
- Equal card heights desired

### Horizontal
Image on left, content on right. Best for list views and featured content.

```
┌────────┬──────────┐
│        │ Title    │
│ Image  │ Descript │
│        │ [CTA]    │
└────────┴──────────┘
```

**Use when:**
- Displaying single-column lists
- Desktop-focused layouts
- More detailed content needed

## Variants

### Default
Flat card with subtle border.

**Use when:** Standard content presentation in light backgrounds.

### Elevated
Card with shadow for depth.

**Use when:** Cards need to stand out from background, layered interfaces.

### Outlined
Strong border, no background.

**Use when:** On colored backgrounds, emphasis on structure.

## Authoring Instructions

### Dialog Fields

#### 1. Image (Optional)
- **Type**: Path browser
- **Root path**: `/content/dam`
- **Guidelines**:
  - Recommended size: 800x600px (vertical), 600x400px (horizontal)
  - Formats: JPG, PNG, WebP
  - Max size: 300KB
  - Use descriptive alt text

#### 2. Image Alt Text
- **Required if image is provided**
- **Guidelines**:
  - Describe the image content
  - Keep concise (under 125 characters)
  - Don't repeat title
  - Use empty string for decorative images

#### 3. Title (Required)
- **Max length**: 100 characters
- **Guidelines**:
  - Clear and descriptive
  - Use sentence case
  - Front-load important words

**Examples**:
- ✅ "Getting Started with AEM as a Cloud Service"
- ✅ "5 Tips for Content Authors"
- ❌ "Click here for more information"

#### 4. Description (Optional)
- **Type**: Textarea
- **Max length**: 300 characters
- **Guidelines**:
  - 2-3 sentences
  - Provide context beyond title
  - Don't duplicate CTA text

#### 5. CTA Text (Optional)
- **Max length**: 25 characters
- **Guidelines**:
  - Action-oriented
  - Clear destination
  - Not required if entire card is clickable

#### 6. CTA Link (Optional)
- **Type**: Path field or URL
- **Guidelines**:
  - Link to relevant page or resource
  - Use internal paths when possible

#### 7. Layout
- **Vertical**: Stacked layout (default)
- **Horizontal**: Side-by-side layout

#### 8. Variant
- **Default**: Subtle border
- **Elevated**: Drop shadow
- **Outlined**: Strong border

### Content Guidelines

- **Be consistent**: Use similar card structures across a section
- **Avoid clutter**: Don't fill every field if not necessary
- **Test responsive**: Check how cards adapt on mobile
- **Image optional**: Cards work fine without images

## Technical Implementation

### HTL Template

```html
<sly data-sly-use.card="com.example.components.Card">
  <article class="card card--${properties.layout || 'vertical'} card--${properties.variant || 'default'}"
           data-cmp-is="card">

    <sly data-sly-test="${properties.image}">
      <div class="card__image">
        <img src="${properties.image @ context='uri'}"
             alt="${properties.imageAlt @ context='attribute'}"
             loading="lazy" />
      </div>
    </sly>

    <div class="card__content">
      <h3 class="card__title">${properties.title @ context='html'}</h3>

      <sly data-sly-test="${properties.description}">
        <p class="card__description">${properties.description @ context='html'}</p>
      </sly>

      <sly data-sly-test="${properties.ctaText && properties.ctaLink}">
        <div class="card__action">
          <a href="${properties.ctaLink @ context='uri'}" class="card__cta">
            ${properties.ctaText}
            <svg class="card__cta-icon" aria-hidden="true">
              <use xlink:href="#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
      </sly>
    </div>
  </article>
</sly>
```

### CSS Structure

```scss
.card {
  display: flex;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s;

  // Layouts
  &--vertical {
    flex-direction: column;
  }

  &--horizontal {
    flex-direction: row;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .card__image {
      flex: 0 0 40%;
    }

    .card__content {
      flex: 1;
    }
  }

  // Variants
  &--default {
    background: white;
    border: 1px solid #e5e7eb;
  }

  &--elevated {
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

    &:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
  }

  &--outlined {
    background: transparent;
    border: 2px solid #d1d5db;
  }

  &__image {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    padding: 1.5rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  &__description {
    color: #6b7280;
    margin-bottom: 1rem;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #2563eb;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
```

## Accessibility

- ✅ Semantic HTML (`<article>`, `<h3>`)
- ✅ Proper heading hierarchy
- ✅ Alt text for images
- ✅ Keyboard accessible links
- ✅ Focus indicators
- ✅ ARIA labels when needed

## Responsive Behavior

### Desktop (1200px+)
- Horizontal cards maintain side-by-side layout
- Vertical cards in multi-column grids

### Tablet (768px - 1199px)
- 2-column grids typical
- Horizontal cards remain horizontal

### Mobile (< 768px)
- Full-width single column
- Horizontal cards become vertical
- Larger touch targets

## Grid Examples

### 3-Column Grid (Desktop)

```html
<div class="card-grid card-grid--3col">
  <sly data-sly-repeat="${items}">
    <div data-sly-resource="${item @ resourceType='components/card'}"></div>
  </sly>
</div>
```

### List View (Horizontal Cards)

```html
<div class="card-list">
  <sly data-sly-repeat="${items}">
    <div data-sly-resource="${item @ resourceType='components/card'}"></div>
  </sly>
</div>
```

## Examples

### Blog Post Card

```
Image: /content/dam/blog/post-thumbnail.jpg
Image Alt: "Developer working on laptop"
Title: "10 AEM Best Practices for 2024"
Description: "Learn the latest techniques for building scalable, performant AEM applications from industry experts."
CTA Text: "Read Article"
CTA Link: /blog/aem-best-practices-2024
Layout: Vertical
Variant: Elevated
```

### Product Card

```
Image: /content/dam/products/product-hero.jpg
Image Alt: "Product packaging"
Title: "AEM as a Cloud Service"
Description: "Enterprise content management in the cloud with automatic scaling and updates."
CTA Text: "Learn More"
CTA Link: /products/aem-cloud
Layout: Horizontal
Variant: Default
```

### Team Member Card

```
Image: /content/dam/team/jane-doe.jpg
Image Alt: "Photo of Jane Doe"
Title: "Jane Doe"
Description: "Senior Product Manager with 10 years of experience in digital transformation."
CTA Text: "View Profile"
CTA Link: /team/jane-doe
Layout: Vertical
Variant: Outlined
```

## Related Components

- [CTA Button](/Components/CTA-Button) - For standalone CTAs
- [Image](/Components/Image) - For standalone images
- [Text Block](/Components/Text-Block) - For text-only content

## Troubleshooting

### Cards have different heights
**Solution**: Use vertical layout in grid. Consider CSS Grid with `align-items: stretch`.

### Horizontal layout breaks on mobile
**Expected**: Horizontal cards automatically become vertical on mobile.

### Image not displaying
**Check**: Image path, permissions, and DAM availability.

## Support

**Team**: Content Platform
**Email**: content-platform@example.com
**Slack**: #content-platform

---

**Last Updated**: 2024-11-18
**Component Version**: 1.0.0
**Status**: Stable ✅

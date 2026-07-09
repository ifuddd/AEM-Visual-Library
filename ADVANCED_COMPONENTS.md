# Advanced AEM Component Templates

Created by: Senior Creative Developer
Date: 2024-12-29
Components: 3 Enterprise-Grade AEM Core Component Inspired Templates

---

## Overview

This document describes three sophisticated Adobe Experience Manager (AEM) components designed with enterprise-level patterns and best practices. These components are inspired by AEM Core Components v2 and demonstrate advanced authoring capabilities, flexible configuration, and production-ready implementation patterns.

---

## 1. Teaser Component

**Path**: `/apps/core/wcm/components/teaser/v2/teaser`
**Category**: Content Promotion
**Complexity**: Advanced
**Status**: STABLE

### Description

The Teaser is a versatile content promotion component that combines imagery, typography, and call-to-action elements into a cohesive, attention-grabbing unit. It's one of the most flexible components in enterprise AEM implementations.

### Key Features

- **Pre-title/Eyebrow** - Optional category or context label
- **Flexible Headlines** - Configurable heading levels (H1-H6) for SEO
- **Rich Text Description** - Support for formatted content with links
- **Image Positioning** - Left, right, top, or background placement
- **Multiple Actions** - Up to 2 CTA links with style variants
- **Visual Variants**:
  - **Default**: Standard side-by-side layout
  - **Hero**: Full-width with large imagery
  - **Promo**: Emphasized call-to-action style
  - **Card**: Contained card layout for grids

### Use Cases

- Product feature promotions
- Service highlights on homepage
- Campaign landing page teasers
- Article/blog post previews
- Event announcements
- Content hub navigation

### Dialog Configuration

```javascript
{
  pretitle: 'NEW FEATURE',           // Eyebrow text
  title: 'Introducing AEM Cloud',    // Main headline
  titleType: 'h2',                   // SEO heading level
  description: '<p>Rich text...</p>', // Formatted description
  image: '/content/dam/feature.jpg',  // Primary image
  imagePosition: 'left',              // Image placement
  actions: [
    { text: 'Learn More', link: '/products', style: 'primary' },
    { text: 'Watch Demo', link: '/demo', style: 'secondary' }
  ],
  variant: 'hero',                    // Visual style
  titleLinkTarget: '/products',       // Make entire teaser clickable
  showTitleLink: true                 // Title as link
}
```

### HTL Implementation Pattern

```html
<sly data-sly-use.teaser="com.adobe.cq.wcm.core.components.models.Teaser">
  <div class="cmp-teaser cmp-teaser--${teaser.variant}">

    <!-- Pre-title -->
    <sly data-sly-test="${teaser.pretitle}">
      <span class="cmp-teaser__pretitle">${teaser.pretitle}</span>
    </sly>

    <!-- Title -->
    <sly data-sly-element="${teaser.titleType || 'h2'}">
      <a href="${teaser.titleLink}" class="cmp-teaser__title-link">
        ${teaser.title}
      </a>
    </sly>

    <!-- Image -->
    <div class="cmp-teaser__image cmp-teaser__image--${teaser.imagePosition}">
      <img src="${teaser.image @ width='800'}" alt="${teaser.imageAlt}">
    </div>

    <!-- Description -->
    <div class="cmp-teaser__description">
      ${teaser.description @ context='html'}
    </div>

    <!-- Actions -->
    <div class="cmp-teaser__action-container">
      <sly data-sly-list.action="${teaser.actions}">
        <a href="${action.link}"
           class="cmp-button cmp-button--${action.style}">
          ${action.text}
        </a>
      </sly>
    </div>

  </div>
</sly>
```

### Technical Notes

- **Performance**: Lazy-load images in non-hero variants
- **SEO**: Dynamic heading levels prevent h1 duplication
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- **Responsive**: Mobile-first CSS with breakpoint adaptations

### Limitations

- Maximum 2 action links (UI/UX best practice)
- Rich text limited to basic formatting (security)
- Background variant requires 1920x1080+ images
- Image aspect ratio controlled by variant

---

## 2. Section Container

**Path**: `/apps/core/wcm/components/container/v2/container`
**Category**: Layout & Structure
**Complexity**: Expert
**Status**: STABLE

### Description

An enterprise-grade layout container providing maximum flexibility for page composition. Supports advanced background options (color, image, video), comprehensive spacing controls, grid configurations, and overlay effects.

### Key Features

- **Layout Modes**:
  - Default: Standard container with max-width
  - Full-width: Edge-to-edge content
  - Contained: Centered with padding
  - Fluid: Responsive to parent

- **Grid System**:
  - 1-12 column configurations
  - Adjustable column gaps
  - Responsive breakpoints

- **Background Options**:
  - Solid colors (with color picker)
  - Images with size/position controls
  - Video backgrounds (MP4)
  - Parallax effects (fixed attachment)

- **Overlay System**:
  - Configurable color and opacity
  - Improves text readability
  - Gradient support

- **Spacing Controls**:
  - Independent padding (top/bottom)
  - Margin controls (top/bottom)
  - 5 size presets (none, small, medium, large, xlarge)
  - Component spacing modes

### Use Cases

- Hero sections with video backgrounds
- Full-width content bands
- Colored sections for visual hierarchy
- Image-based section dividers
- Container for complex grid layouts
- Landing page composition
- Marketing campaign pages

### Dialog Configuration

```javascript
{
  // Layout
  layout: 'full-width',
  gridColumns: '12',
  columnGap: 'medium',

  // Background
  backgroundColor: '#1a1a1a',
  backgroundImage: '/content/dam/hero-bg.jpg',
  backgroundVideo: '/content/dam/videos/hero.mp4',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',  // Parallax

  // Overlay
  overlayEnable: true,
  overlayColor: 'rgba(0,0,0,0.5)',
  overlayOpacity: 50,

  // Spacing
  paddingTop: 'xlarge',
  paddingBottom: 'xlarge',
  marginTop: 'none',
  marginBottom: 'medium',

  // Advanced
  anchorId: 'features-section',
  cssClasses: 'custom-section',
  componentSpacing: 'relaxed'
}
```

### HTL Implementation Pattern

```html
<section
  class="cmp-container ${properties.cssClasses}"
  id="${properties.anchorId}"
  data-cmp-layout="${properties.layout}"
  style="
    background-color: ${properties.backgroundColor};
    padding-top: var(--spacing-${properties.paddingTop});
    padding-bottom: var(--spacing-${properties.paddingBottom});
  ">

  <!-- Background Image -->
  <sly data-sly-test="${properties.backgroundImage}">
    <div class="cmp-container__background-image"
         style="
           background-image: url(${properties.backgroundImage});
           background-size: ${properties.backgroundSize};
           background-position: ${properties.backgroundPosition};
           background-attachment: ${properties.backgroundAttachment};
         "></div>
  </sly>

  <!-- Background Video -->
  <sly data-sly-test="${properties.backgroundVideo}">
    <video class="cmp-container__background-video"
           autoplay muted loop playsinline>
      <source src="${properties.backgroundVideo}" type="video/mp4">
    </video>
  </sly>

  <!-- Overlay -->
  <sly data-sly-test="${properties.overlayEnable}">
    <div class="cmp-container__overlay"
         style="
           background-color: ${properties.overlayColor};
           opacity: ${properties.overlayOpacity / 100};
         "></div>
  </sly>

  <!-- Content -->
  <div class="cmp-container__content">
    <sly data-sly-resource="${'par' @ resourceType='wcm/foundation/components/responsivegrid'}"></sly>
  </div>

</section>
```

### CSS Architecture

```scss
.cmp-container {
  position: relative;
  overflow: hidden;

  // Layout variants
  &[data-cmp-layout="full-width"] {
    width: 100vw;
    margin-left: calc(50% - 50vw);
  }

  &[data-cmp-layout="contained"] {
    max-width: var(--container-max-width);
    margin-left: auto;
    margin-right: auto;
  }

  // Background layers
  &__background-image,
  &__background-video,
  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  &__background-video {
    object-fit: cover;
  }

  &__content {
    position: relative;
    z-index: 1;
  }
}
```

### Technical Notes

- **Performance**: Background videos are muted autoplay only (browser policy)
- **Mobile**: Parallax (fixed attachment) can cause performance issues
- **Nesting**: Maximum 3 levels deep to prevent complexity
- **Video**: MP4 format, 10MB max for performance

### Limitations

- Background video autoplay muted only
- Parallax not recommended for mobile
- Maximum nesting: 3 container levels
- Video format: MP4 only, max 10MB

---

## 3. Content List

**Path**: `/apps/core/wcm/components/list/v4/list`
**Category**: Dynamic Content Aggregation
**Complexity**: Expert
**Status**: STABLE

### Description

An intelligent list component with multiple data source options for content aggregation and curation. Supports dynamic queries, pagination, filtering, and extensive display customization. Essential for blogs, news sections, product catalogs, and content hubs.

### Key Features

- **Data Sources**:
  - **Children**: Auto-populate from child pages
  - **Fixed**: Manually curated page selection
  - **Search**: Full-text search results
  - **Tags**: Tag-based content queries
  - **QueryBuilder**: Advanced JCR/SQL2 queries

- **Query Options**:
  - Child depth control (1-5 levels)
  - Tag matching logic (any/all)
  - Sort by title, modified, published, custom
  - Ascending/descending order
  - Maximum items limit

- **Display Modes**:
  - Default list view
  - Grid layout
  - Card style
  - Compact view

- **Pagination**:
  - Numbered pagination
  - Load more button
  - Infinite scroll
  - Configurable items per page

- **Metadata Display**:
  - Show/hide descriptions
  - Modification dates
  - Linked titles
  - Custom date formats

### Use Cases

- Blog article listings
- News/press releases
- Product catalogs
- Event calendars
- Team member directories
- Resource libraries
- Tag-filtered content hubs
- Related content sections

### Dialog Configuration

```javascript
{
  // Source
  listFrom: 'tags',
  tags: ['product', 'featured'],
  tagsMatch: 'all',

  // Alternative sources:
  // parentPage: '/content/site/blog',  // For children source
  // childDepth: 2,
  // pages: ['/page1', '/page2'],       // For fixed source
  // searchQuery: 'AEM Cloud',          // For search source

  // Display
  orderBy: 'published',
  sortOrder: 'desc',
  maxItems: 20,
  showDescription: true,
  showModificationDate: true,
  linkItems: true,
  displayAs: 'grid',

  // Pagination
  enablePagination: true,
  itemsPerPage: 10,
  paginationStyle: 'numbered',

  // Advanced
  dateFormat: 'MMMM dd, yyyy',
  emptyMessage: 'No items found',
  enableFiltering: true
}
```

### Sling Model Pattern

```java
@Model(adaptables = SlingHttpServletRequest.class)
public class ContentListImpl implements ContentList {

    @ValueMapValue
    private String listFrom;

    @ValueMapValue
    private String[] tags;

    @ValueMapValue
    private String tagsMatch;

    @ValueMapValue
    private int maxItems;

    public List<ListItem> getItems() {
        switch (listFrom) {
            case "children":
                return getChildPages();
            case "tags":
                return getPagesByTags();
            case "search":
                return getSearchResults();
            case "querybuilder":
                return getQueryBuilderResults();
            default:
                return getFixedPages();
        }
    }

    private List<ListItem> getPagesByTags() {
        TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
        RangeIterator<Resource> results = tagManager.find(
            searchRoot,
            tags,
            tagsMatch.equals("all")
        );
        // Process results...
    }
}
```

### HTL Implementation Pattern

```html
<sly data-sly-use.list="com.adobe.cq.wcm.core.components.models.List">

  <div class="cmp-list cmp-list--${list.displayAs}">

    <!-- Filtering UI (if enabled) -->
    <sly data-sly-test="${list.filteringEnabled}">
      <div class="cmp-list__filters">
        <!-- Filter controls -->
      </div>
    </sly>

    <!-- List Items -->
    <sly data-sly-test="${list.items}">
      <ul class="cmp-list__items">
        <li data-sly-list.item="${list.items}"
            class="cmp-list__item">

          <!-- Image (if available) -->
          <sly data-sly-test="${item.image}">
            <img src="${item.image}" alt="${item.title}">
          </sly>

          <!-- Title -->
          <h3 class="cmp-list__item-title">
            <sly data-sly-test="${list.linkItems}">
              <a href="${item.path}.html">${item.title}</a>
            </sly>
            <sly data-sly-test="${!list.linkItems}">
              ${item.title}
            </sly>
          </h3>

          <!-- Description -->
          <sly data-sly-test="${list.showDescription && item.description}">
            <p class="cmp-list__item-description">
              ${item.description}
            </p>
          </sly>

          <!-- Date -->
          <sly data-sly-test="${list.showModificationDate}">
            <time class="cmp-list__item-date">
              ${item.lastModified @ format=list.dateFormat}
            </time>
          </sly>

        </li>
      </ul>
    </sly>

    <!-- Empty State -->
    <sly data-sly-test="${!list.items}">
      <p class="cmp-list__empty">${list.emptyMessage}</p>
    </sly>

    <!-- Pagination -->
    <sly data-sly-test="${list.paginationEnabled}">
      <nav class="cmp-list__pagination">
        <!-- Pagination controls based on style -->
      </nav>
    </sly>

  </div>

</sly>
```

### Query Examples

**Children Pages:**
```
Parent: /content/site/blog
Depth: 1
Result: All direct child pages under /blog
```

**Tag-Based:**
```
Tags: [product, featured]
Match: all
Result: Pages with BOTH tags
```

**Search:**
```
Query: "AEM Cloud"
Search In: /content/site
Result: Full-text search results
```

**QueryBuilder:**
```json
{
  "type": "cq:Page",
  "path": "/content/site/products",
  "property": "jcr:content/category",
  "property.value": "enterprise",
  "orderby": "@jcr:content/publishDate",
  "orderby.sort": "desc"
}
```

### Performance Optimizations

1. **Caching**:
   - Tag queries cached for 5 minutes
   - QueryBuilder results cached with TTL
   - Pagination state cached in session

2. **Lazy Loading**:
   - Load more pagination defers rendering
   - Infinite scroll loads on demand
   - Images lazy-loaded below fold

3. **Query Limits**:
   - Search capped at 100 results
   - Child depth max 5 levels
   - Tag queries optimized with indexes

### Technical Notes

- **QueryBuilder**: Requires JCR/SQL2 knowledge for advanced queries
- **Search**: Full-text search limited to 100 results for performance
- **Children**: Maximum depth of 5 levels to prevent performance issues
- **SEO**: Infinite scroll not recommended for SEO-critical content
- **Caching**: Tag-based queries cached for 5 minutes

### Limitations

- QueryBuilder queries require JCR/SQL2 expertise
- Search source limited to 100 results max
- Child pages maximum depth: 5 levels
- Infinite scroll not SEO-friendly
- Tag-based queries cache for 5 minutes
- Load-more requires JavaScript enabled

---

## Implementation Best Practices

### 1. Teaser Component

**DO**:
- Use semantic heading levels for SEO
- Optimize images before upload
- Limit actions to 2 for clarity
- Test all variants responsively

**DON'T**:
- Nest teasers inside teasers
- Use multiple hero teasers on one page
- Forget alt text for images
- Overload with too much text

### 2. Section Container

**DO**:
- Use overlays for text readability
- Optimize video files (<10MB)
- Test parallax on mobile
- Limit nesting depth

**DON'T**:
- Nest containers more than 3 deep
- Use large video files
- Enable parallax without testing performance
- Forget accessibility for background content

### 3. Content List

**DO**:
- Cache query results appropriately
- Limit items per page for performance
- Provide empty state messaging
- Test pagination styles

**DON'T**:
- Use infinite scroll for critical SEO content
- Set unreasonably high item limits
- Forget to handle empty results
- Use complex QueryBuilder without testing

---

## Testing Checklist

### All Components

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Performance (Lighthouse score)
- [ ] SEO (heading structure, semantic HTML)

### Teaser

- [ ] All 4 variants render correctly
- [ ] Image positions work in all variants
- [ ] Actions link correctly
- [ ] Responsive image sizing

### Section Container

- [ ] Background options work (color, image, video)
- [ ] Overlay applies correctly
- [ ] Spacing presets apply
- [ ] Grid system works
- [ ] Parallax performs well

### Content List

- [ ] All data sources return results
- [ ] Pagination works correctly
- [ ] Empty state displays
- [ ] Sorting applies correctly
- [ ] Filtering works (if enabled)

---

## Support & Resources

**Team**: Creative Development
**Contact**: creative-dev@example.com
**Repository**: [AEM Core Components](https://github.com/example/aem-core-components)
**Documentation**: See individual component wiki pages

**Additional Resources**:
- [AEM Core Components Documentation](https://experienceleague.adobe.com/docs/experience-manager-core-components/)
- [HTL Specification](https://experienceleague.adobe.com/docs/experience-manager-htl/)
- [Sling Models](https://sling.apache.org/documentation/bundles/models.html)

---

**Created**: 2024-12-29
**Version**: 1.0.0
**Components**: 3
**Total Dialog Fields**: 50+
**Lines of Code**: ~2000 (HTL + Java + SCSS)

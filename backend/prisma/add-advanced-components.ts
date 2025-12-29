/**
 * Add Advanced AEM Components to Database
 *
 * This script adds 3 enterprise-grade AEM components created by a senior creative developer.
 * Run with: npx tsx add-advanced-components.ts
 */

import { PrismaClient, ComponentStatus, UpdateSource } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎨 Adding advanced AEM component templates...\n');

  const advancedComponents = [
    // 1. TEASER COMPONENT - Enterprise-grade teaser
    {
      slug: 'teaser',
      title: 'Teaser',
      description: 'Versatile content promotion component combining image, pre-title, title, description, and action links. Supports multiple rendering variants (default, hero, promo, card) with extensive customization options for enterprise content strategies.',
      tags: ['content', 'marketing', 'promotion', 'core-component', 'responsive', 'author-editable'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'creative-dev@example.com',
      ownerTeam: 'Creative Development',
      repoLink: 'https://github.com/example/aem-core-components/tree/main/teaser',
      azureWikiPath: '/Components/Advanced/Teaser',
      azureWikiUrl: 'https://dev.azure.com/example/_wiki/wikis/Components/Advanced/Teaser',
      figmaLinks: [
        'https://www.figma.com/file/abc123/AEM-Core-Components?node-id=1600-2000',
        'https://www.figma.com/file/abc123/AEM-Core-Components?node-id=1600-2100',
        'https://www.figma.com/file/abc123/AEM-Core-Components?node-id=1600-2200',
      ],
      aemComponentPath: '/apps/core/wcm/components/teaser/v2/teaser',
      aemDialogSchema: {
        pretitle: {
          type: 'textfield',
          description: 'Optional pre-title/eyebrow text',
          maxlength: 50,
        },
        title: {
          type: 'textfield',
          required: true,
          description: 'Main headline',
          maxlength: 120,
        },
        titleType: {
          type: 'select',
          options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          default: 'h2',
          description: 'Heading level for SEO',
        },
        description: {
          type: 'richtext',
          maxlength: 500,
          description: 'Rich text description',
        },
        image: {
          type: 'pathbrowser',
          rootPath: '/content/dam',
          description: 'Primary image',
        },
        imageAlt: {
          type: 'textfield',
          description: 'Alt text for accessibility',
        },
        imagePosition: {
          type: 'select',
          options: ['left', 'right', 'top', 'background'],
          default: 'left',
        },
        actions: {
          type: 'multifield',
          description: 'Action links (max 2)',
          fields: {
            text: { type: 'textfield', required: true },
            link: { type: 'pathfield', required: true },
            style: { type: 'select', options: ['primary', 'secondary', 'link'] },
          },
        },
        variant: {
          type: 'select',
          options: ['default', 'hero', 'promo', 'card'],
          default: 'default',
          description: 'Visual style variant',
        },
        titleLinkTarget: {
          type: 'pathfield',
          description: 'Make entire teaser clickable',
        },
        showTitleLink: {
          type: 'checkbox',
          default: true,
          description: 'Show title as link',
        },
      },
      aemAllowedChildren: [],
      aemTemplateConstraints: {
        allowedParents: ['responsivegrid', 'container', 'carousel'],
      },
      aemLimitations: [
        'Maximum 2 action links',
        'Image aspect ratio controlled by variant',
        'Rich text limited to basic formatting (bold, italic, links)',
        'Background image variant requires minimum 1920x1080 image',
      ],
      thumbnailUrl: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Teaser',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/7c3aed/ffffff?text=Teaser+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/6d28d9/ffffff?text=Teaser+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'creative-dev@example.com',
      lastUpdatedSource: UpdateSource.MANUAL,
    },

    // 2. SECTION CONTAINER - Enterprise layout component
    {
      slug: 'section-container',
      title: 'Section Container',
      description: 'Advanced layout container with extensive styling options including background (color, image, video), spacing controls, grid configurations, and overlay effects. Designed for enterprise page composition with maximum flexibility.',
      tags: ['layout', 'container', 'structure', 'responsive', 'grid', 'author-editable'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'creative-dev@example.com',
      ownerTeam: 'Creative Development',
      repoLink: 'https://github.com/example/aem-core-components/tree/main/section-container',
      azureWikiPath: '/Components/Advanced/Section-Container',
      azureWikiUrl: 'https://dev.azure.com/example/_wiki/wikis/Components/Advanced/Section-Container',
      figmaLinks: [
        'https://www.figma.com/file/abc123/AEM-Core-Components?node-id=2000-2500',
        'https://www.figma.com/file/abc123/AEM-Core-Components?node-id=2000-2600',
      ],
      aemComponentPath: '/apps/core/wcm/components/container/v2/container',
      aemDialogSchema: {
        // Layout Tab
        layout: {
          type: 'select',
          options: ['default', 'full-width', 'contained', 'fluid'],
          default: 'default',
          description: 'Container width behavior',
        },
        gridColumns: {
          type: 'select',
          options: ['1', '2', '3', '4', '6', '12'],
          default: '12',
          description: 'Grid column count',
        },
        columnGap: {
          type: 'select',
          options: ['none', 'small', 'medium', 'large'],
          default: 'medium',
        },
        // Background Tab
        backgroundColor: {
          type: 'colorfield',
          description: 'Solid background color',
        },
        backgroundImage: {
          type: 'pathbrowser',
          rootPath: '/content/dam',
          description: 'Background image',
        },
        backgroundVideo: {
          type: 'pathbrowser',
          rootPath: '/content/dam/videos',
          description: 'Background video (MP4)',
        },
        backgroundSize: {
          type: 'select',
          options: ['cover', 'contain', 'auto'],
          default: 'cover',
        },
        backgroundPosition: {
          type: 'select',
          options: ['center', 'top', 'bottom', 'left', 'right'],
          default: 'center',
        },
        backgroundAttachment: {
          type: 'select',
          options: ['scroll', 'fixed', 'local'],
          default: 'scroll',
          description: 'Parallax effect option',
        },
        // Overlay Tab
        overlayEnable: {
          type: 'checkbox',
          description: 'Enable overlay over background',
        },
        overlayColor: {
          type: 'colorfield',
          default: 'rgba(0,0,0,0.5)',
        },
        overlayOpacity: {
          type: 'slider',
          min: 0,
          max: 100,
          default: 50,
        },
        // Spacing Tab
        paddingTop: {
          type: 'select',
          options: ['none', 'small', 'medium', 'large', 'xlarge'],
          default: 'medium',
        },
        paddingBottom: {
          type: 'select',
          options: ['none', 'small', 'medium', 'large', 'xlarge'],
          default: 'medium',
        },
        marginTop: {
          type: 'select',
          options: ['none', 'small', 'medium', 'large', 'xlarge'],
          default: 'none',
        },
        marginBottom: {
          type: 'select',
          options: ['none', 'small', 'medium', 'large', 'xlarge'],
          default: 'none',
        },
        // Advanced Tab
        anchorId: {
          type: 'textfield',
          description: 'ID for anchor links',
        },
        cssClasses: {
          type: 'textfield',
          description: 'Custom CSS classes',
        },
        componentSpacing: {
          type: 'select',
          options: ['compact', 'normal', 'relaxed'],
          default: 'normal',
          description: 'Spacing between child components',
        },
      },
      aemAllowedChildren: [
        'text',
        'image',
        'teaser',
        'title',
        'button',
        'separator',
        'embed',
        'contentfragment',
        'experiencefragment',
        'container',
        'carousel',
        'tabs',
        'accordion',
      ],
      aemTemplateConstraints: {
        allowedParents: ['root', 'responsivegrid', 'container'],
      },
      aemLimitations: [
        'Background video autoplay muted only (browser restrictions)',
        'Parallax effect (fixed attachment) has performance implications on mobile',
        'Maximum nesting depth: 3 levels of containers',
        'Background video format: MP4 only, max 10MB',
      ],
      thumbnailUrl: 'https://placehold.co/400x300/3b82f6/ffffff?text=Section+Container',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/2563eb/ffffff?text=Container+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/1d4ed8/ffffff?text=Container+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'creative-dev@example.com',
      lastUpdatedSource: UpdateSource.MANUAL,
    },

    // 3. CONTENT LIST - Dynamic list component
    {
      slug: 'content-list',
      title: 'Content List',
      description: 'Intelligent list component with multiple data source options (child pages, tag-based queries, static items, search results). Features dynamic rendering, pagination, filtering, and extensive display customization for content aggregation and curation.',
      tags: ['content', 'dynamic', 'query', 'list', 'aggregation', 'author-editable'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'creative-dev@example.com',
      ownerTeam: 'Creative Development',
      repoLink: 'https://github.com/example/aem-core-components/tree/main/content-list',
      azureWikiPath: '/Components/Advanced/Content-List',
      azureWikiUrl: 'https://dev.azure.com/example/_wiki/wikis/Components/Advanced/Content-List',
      figmaLinks: [
        'https://www.figma.com/file/abc123/AEM-Core-Components?node-id=2500-3000',
      ],
      aemComponentPath: '/apps/core/wcm/components/list/v4/list',
      aemDialogSchema: {
        // List Source Tab
        listFrom: {
          type: 'select',
          options: ['children', 'fixed', 'search', 'tags', 'querybuilder'],
          required: true,
          description: 'Content source type',
        },
        parentPage: {
          type: 'pathfield',
          description: 'Parent page for children source',
          showWhen: { listFrom: 'children' },
        },
        childDepth: {
          type: 'number',
          min: 1,
          max: 5,
          default: 1,
          description: 'How many levels deep to include',
          showWhen: { listFrom: 'children' },
        },
        pages: {
          type: 'multipathfield',
          description: 'Select specific pages',
          showWhen: { listFrom: 'fixed' },
        },
        tags: {
          type: 'tagfield',
          multiple: true,
          description: 'Filter by tags',
          showWhen: { listFrom: 'tags' },
        },
        tagsMatch: {
          type: 'select',
          options: ['any', 'all'],
          default: 'any',
          description: 'Tag matching logic',
          showWhen: { listFrom: 'tags' },
        },
        searchQuery: {
          type: 'textfield',
          description: 'Search term',
          showWhen: { listFrom: 'search' },
        },
        searchIn: {
          type: 'pathfield',
          description: 'Search root path',
          showWhen: { listFrom: 'search' },
        },
        queryBuilderQuery: {
          type: 'textarea',
          description: 'QueryBuilder JSON',
          showWhen: { listFrom: 'querybuilder' },
        },
        // Display Tab
        orderBy: {
          type: 'select',
          options: ['title', 'modified', 'published', 'custom'],
          default: 'modified',
        },
        sortOrder: {
          type: 'select',
          options: ['asc', 'desc'],
          default: 'desc',
        },
        maxItems: {
          type: 'number',
          min: 1,
          max: 100,
          default: 10,
          description: 'Maximum items to display',
        },
        showDescription: {
          type: 'checkbox',
          default: true,
        },
        showModificationDate: {
          type: 'checkbox',
          default: false,
        },
        linkItems: {
          type: 'checkbox',
          default: true,
        },
        displayAs: {
          type: 'select',
          options: ['default', 'grid', 'cards', 'compact'],
          default: 'default',
        },
        // Pagination Tab
        enablePagination: {
          type: 'checkbox',
          default: false,
        },
        itemsPerPage: {
          type: 'number',
          default: 10,
          showWhen: { enablePagination: true },
        },
        paginationStyle: {
          type: 'select',
          options: ['numbered', 'load-more', 'infinite-scroll'],
          default: 'numbered',
          showWhen: { enablePagination: true },
        },
        // Advanced Tab
        dateFormat: {
          type: 'textfield',
          default: 'MMMM dd, yyyy',
          description: 'Java SimpleDateFormat pattern',
        },
        emptyMessage: {
          type: 'textfield',
          default: 'No items to display',
        },
        enableFiltering: {
          type: 'checkbox',
          description: 'Show filter options to users',
        },
      },
      aemAllowedChildren: [],
      aemTemplateConstraints: {
        allowedParents: ['responsivegrid', 'container'],
      },
      aemLimitations: [
        'QueryBuilder queries require JCR/SQL2 knowledge',
        'Search source limited to 100 results for performance',
        'Child pages source maximum depth: 5 levels',
        'Infinite scroll not recommended for SEO-critical pages',
        'Tag-based queries cache for 5 minutes',
        'Load-more pagination requires JavaScript enabled',
      ],
      thumbnailUrl: 'https://placehold.co/400x300/10b981/ffffff?text=Content+List',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/059669/ffffff?text=List+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/047857/ffffff?text=List+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'creative-dev@example.com',
      lastUpdatedSource: UpdateSource.MANUAL,
    },
  ];

  console.log('📦 Adding components to database...\n');

  for (const componentData of advancedComponents) {
    const component = await prisma.component.upsert({
      where: { slug: componentData.slug },
      update: componentData,
      create: componentData,
    });
    console.log(`  ✅ ${component.title}`);
    console.log(`     Slug: ${component.slug}`);
    console.log(`     Tags: ${component.tags.join(', ')}`);
    console.log(`     Status: ${component.status}`);
    console.log('');
  }

  console.log('🎉 Successfully added 3 advanced AEM components!');
  console.log('\nComponents added:');
  console.log('  1. Teaser - Versatile content promotion component');
  console.log('  2. Section Container - Advanced layout container with background options');
  console.log('  3. Content List - Dynamic list with multiple data sources');
  console.log('\n✨ Ready to browse in the portal!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error adding components:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

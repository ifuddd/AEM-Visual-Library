import { PrismaClient, ComponentStatus, UserRole, UpdateSource } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      azureAdOid: '00000000-0000-0000-0000-000000000001',
      email: 'admin@example.com',
      displayName: 'Admin User',
      role: UserRole.ADMIN,
      lastLoginAt: new Date(),
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'designer@example.com' },
      update: {},
      create: {
        azureAdOid: '00000000-0000-0000-0000-000000000002',
        email: 'designer@example.com',
        displayName: 'Sarah Designer',
        role: UserRole.CONTRIBUTOR,
      },
    }),
    prisma.user.upsert({
      where: { email: 'developer@example.com' },
      update: {},
      create: {
        azureAdOid: '00000000-0000-0000-0000-000000000003',
        email: 'developer@example.com',
        displayName: 'John Developer',
        role: UserRole.DOC_OWNER,
      },
    }),
  ]);
  console.log('✅ Created sample users');

  // Create example components
  const components = [
    {
      slug: 'hero-banner',
      title: 'Hero Banner',
      description: 'Large top-of-page banner with background image, headline, subtitle, and up to two CTA buttons. Supports multiple alignment options and overlay styles.',
      tags: ['layout', 'marketing', 'author-editable', 'responsive'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'marketing-platform@example.com',
      ownerTeam: 'Marketing Platform',
      repoLink: 'https://github.com/example/aem-components/tree/main/hero-banner',
      azureWikiPath: '/Components/Hero-Banner',
      azureWikiUrl: 'https://dev.azure.com/example/_wiki/wikis/Components/Hero-Banner',
      figmaLinks: [
        'https://www.figma.com/file/abc123/Design-System?node-id=100-200',
        'https://www.figma.com/file/abc123/Design-System?node-id=100-250',
      ],
      aemComponentPath: '/apps/myproject/components/hero-banner',
      aemDialogSchema: {
        title: { type: 'textfield', required: true },
        subtitle: { type: 'textarea', maxlength: 200 },
        image: { type: 'pathbrowser', rootPath: '/content/dam' },
        ctaPrimaryText: { type: 'textfield', maxlength: 25 },
        ctaPrimaryLink: { type: 'pathfield' },
        ctaSecondaryText: { type: 'textfield', maxlength: 25 },
        ctaSecondaryLink: { type: 'pathfield' },
        alignment: { type: 'select', options: ['left', 'center'] },
        overlay: { type: 'select', options: ['none', 'dark', 'light'] },
      },
      aemAllowedChildren: ['teaser', 'cta-button'],
      aemTemplateConstraints: {
        allowedParents: ['responsivegrid'],
        maxItems: 1,
      },
      aemLimitations: [
        'No video support in authoring dialog',
        'Image ratio fixed to 16:9',
        'Maximum 2 CTA buttons',
      ],
      thumbnailUrl: 'https://placehold.co/400x300/2563eb/ffffff?text=Hero+Banner',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/1e40af/ffffff?text=Hero+Author+View',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/1e3a8a/ffffff?text=Hero+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'sarah.designer@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'cta-button',
      title: 'CTA Button',
      description: 'Call-to-action button component with multiple style variants (primary, secondary, tertiary, ghost) and size options. Supports internal and external links.',
      tags: ['action', 'interactive', 'author-editable', 'atomic'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'design-system@example.com',
      ownerTeam: 'Design System',
      repoLink: 'https://github.com/example/aem-components/tree/main/cta-button',
      azureWikiPath: '/Components/CTA-Button',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=200-300'],
      aemComponentPath: '/apps/myproject/components/cta-button',
      aemDialogSchema: {
        text: { type: 'textfield', required: true, maxlength: 30 },
        link: { type: 'pathfield', required: true },
        variant: { type: 'select', options: ['primary', 'secondary', 'tertiary', 'ghost'] },
        size: { type: 'select', options: ['small', 'medium', 'large'] },
        openInNewTab: { type: 'checkbox' },
        icon: { type: 'select', options: ['none', 'arrow-right', 'download', 'external'] },
      },
      aemAllowedChildren: [],
      aemLimitations: ['No custom icon upload support'],
      thumbnailUrl: 'https://placehold.co/400x300/059669/ffffff?text=CTA+Button',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/047857/ffffff?text=Button+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/065f46/ffffff?text=Button+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'john.developer@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'card',
      title: 'Card',
      description: 'Flexible card component for displaying content with optional image, title, description, and CTA. Supports horizontal and vertical layouts with multiple style variants.',
      tags: ['layout', 'content', 'author-editable', 'responsive'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'content-platform@example.com',
      ownerTeam: 'Content Platform',
      repoLink: 'https://github.com/example/aem-components/tree/main/card',
      azureWikiPath: '/Components/Card',
      figmaLinks: [
        'https://www.figma.com/file/abc123/Design-System?node-id=300-400',
        'https://www.figma.com/file/abc123/Design-System?node-id=300-450',
      ],
      aemComponentPath: '/apps/myproject/components/card',
      aemDialogSchema: {
        image: { type: 'pathbrowser', rootPath: '/content/dam' },
        imageAlt: { type: 'textfield' },
        title: { type: 'textfield', required: true, maxlength: 100 },
        description: { type: 'textarea', maxlength: 300 },
        ctaText: { type: 'textfield', maxlength: 25 },
        ctaLink: { type: 'pathfield' },
        layout: { type: 'select', options: ['vertical', 'horizontal'] },
        variant: { type: 'select', options: ['default', 'elevated', 'outlined'] },
      },
      aemAllowedChildren: [],
      aemLimitations: ['Horizontal layout requires minimum 768px width'],
      thumbnailUrl: 'https://placehold.co/400x300/dc2626/ffffff?text=Card',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/b91c1c/ffffff?text=Card+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/991b1b/ffffff?text=Card+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'sarah.designer@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'navigation-header',
      title: 'Navigation Header',
      description: 'Main site navigation header with logo, primary navigation menu, search, and user actions. Includes responsive mobile menu with hamburger toggle.',
      tags: ['navigation', 'layout', 'global', 'responsive'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'platform-team@example.com',
      ownerTeam: 'Platform',
      repoLink: 'https://github.com/example/aem-components/tree/main/navigation-header',
      azureWikiPath: '/Components/Navigation-Header',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=400-500'],
      aemComponentPath: '/apps/myproject/components/navigation-header',
      aemDialogSchema: {
        logo: { type: 'pathbrowser', rootPath: '/content/dam/logos' },
        logoAlt: { type: 'textfield', required: true },
        logoLink: { type: 'pathfield', default: '/content/mysite/en' },
        showSearch: { type: 'checkbox', default: true },
        showUserMenu: { type: 'checkbox', default: true },
        sticky: { type: 'checkbox', default: true },
      },
      aemAllowedChildren: ['navigation-item', 'navigation-dropdown'],
      aemTemplateConstraints: {
        maxItems: 1,
        allowedParents: ['root'],
      },
      aemLimitations: [
        'Maximum 8 top-level navigation items',
        'Nested dropdowns limited to 2 levels',
      ],
      thumbnailUrl: 'https://placehold.co/400x300/7c3aed/ffffff?text=Navigation',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/6d28d9/ffffff?text=Nav+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/5b21b6/ffffff?text=Nav+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'platform@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'accordion',
      title: 'Accordion',
      description: 'Expandable/collapsible content sections. Supports single or multiple open panels, with optional icons and custom styling.',
      tags: ['interactive', 'content', 'author-editable', 'accessible'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'content-platform@example.com',
      ownerTeam: 'Content Platform',
      repoLink: 'https://github.com/example/aem-components/tree/main/accordion',
      azureWikiPath: '/Components/Accordion',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=500-600'],
      aemComponentPath: '/apps/myproject/components/accordion',
      aemDialogSchema: {
        allowMultiple: { type: 'checkbox', default: false },
        expandFirstByDefault: { type: 'checkbox', default: false },
        showIcons: { type: 'checkbox', default: true },
      },
      aemAllowedChildren: ['accordion-item'],
      aemLimitations: ['Maximum 20 accordion items per component'],
      thumbnailUrl: 'https://placehold.co/400x300/ea580c/ffffff?text=Accordion',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/c2410c/ffffff?text=Accordion+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/9a3412/ffffff?text=Accordion+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'john.developer@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'tabs',
      title: 'Tabs',
      description: 'Tabbed content container for organizing related information. Supports horizontal and vertical tab orientations with keyboard navigation.',
      tags: ['interactive', 'content', 'author-editable', 'accessible'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'content-platform@example.com',
      ownerTeam: 'Content Platform',
      repoLink: 'https://github.com/example/aem-components/tree/main/tabs',
      azureWikiPath: '/Components/Tabs',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=600-700'],
      aemComponentPath: '/apps/myproject/components/tabs',
      aemDialogSchema: {
        orientation: { type: 'select', options: ['horizontal', 'vertical'] },
        variant: { type: 'select', options: ['default', 'pills', 'underline'] },
        defaultActiveTab: { type: 'number', default: 0 },
      },
      aemAllowedChildren: ['tab-item'],
      aemLimitations: ['Maximum 10 tabs per component', 'Vertical tabs require minimum 992px width'],
      thumbnailUrl: 'https://placehold.co/400x300/0891b2/ffffff?text=Tabs',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/0e7490/ffffff?text=Tabs+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/155e75/ffffff?text=Tabs+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'sarah.designer@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'form-field',
      title: 'Form Field',
      description: 'Flexible form input component supporting text, email, tel, number, textarea, select, checkbox, and radio inputs. Includes validation and error messaging.',
      tags: ['form', 'interactive', 'author-editable', 'accessible'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'forms-team@example.com',
      ownerTeam: 'Forms',
      repoLink: 'https://github.com/example/aem-components/tree/main/form-field',
      azureWikiPath: '/Components/Form-Field',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=700-800'],
      aemComponentPath: '/apps/myproject/components/form-field',
      aemDialogSchema: {
        fieldType: { type: 'select', options: ['text', 'email', 'tel', 'number', 'textarea', 'select', 'checkbox', 'radio'], required: true },
        label: { type: 'textfield', required: true },
        name: { type: 'textfield', required: true },
        placeholder: { type: 'textfield' },
        helpText: { type: 'textfield' },
        required: { type: 'checkbox' },
        validation: { type: 'textarea' },
      },
      aemAllowedChildren: [],
      aemLimitations: ['Custom regex validation limited to 500 characters'],
      thumbnailUrl: 'https://placehold.co/400x300/65a30d/ffffff?text=Form+Field',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/4d7c0f/ffffff?text=Form+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/3f6212/ffffff?text=Form+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'forms@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'image',
      title: 'Image',
      description: 'Responsive image component with lazy loading, multiple crop ratios, and caption support. Integrates with AEM DAM for asset management.',
      tags: ['media', 'author-editable', 'responsive', 'atomic'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'design-system@example.com',
      ownerTeam: 'Design System',
      repoLink: 'https://github.com/example/aem-components/tree/main/image',
      azureWikiPath: '/Components/Image',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=800-900'],
      aemComponentPath: '/apps/myproject/components/image',
      aemDialogSchema: {
        image: { type: 'pathbrowser', rootPath: '/content/dam', required: true },
        alt: { type: 'textfield', required: true },
        caption: { type: 'textarea', maxlength: 200 },
        aspectRatio: { type: 'select', options: ['16:9', '4:3', '1:1', '21:9', 'original'] },
        lazyLoad: { type: 'checkbox', default: true },
        decorative: { type: 'checkbox' },
      },
      aemAllowedChildren: [],
      aemLimitations: ['Maximum image size 10MB', 'Supported formats: JPG, PNG, WebP, SVG'],
      thumbnailUrl: 'https://placehold.co/400x300/ec4899/ffffff?text=Image',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/db2777/ffffff?text=Image+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/be185d/ffffff?text=Image+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'sarah.designer@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'video-player',
      title: 'Video Player',
      description: 'HTML5 video player with controls, captions, and thumbnail preview. Supports YouTube, Vimeo, and self-hosted videos.',
      tags: ['media', 'interactive', 'author-editable', 'accessible'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'media-team@example.com',
      ownerTeam: 'Media',
      repoLink: 'https://github.com/example/aem-components/tree/main/video-player',
      azureWikiPath: '/Components/Video-Player',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=900-1000'],
      aemComponentPath: '/apps/myproject/components/video-player',
      aemDialogSchema: {
        videoSource: { type: 'select', options: ['dam', 'youtube', 'vimeo'], required: true },
        videoPath: { type: 'pathbrowser', rootPath: '/content/dam/videos' },
        youtubeId: { type: 'textfield' },
        vimeoId: { type: 'textfield' },
        poster: { type: 'pathbrowser', rootPath: '/content/dam' },
        autoplay: { type: 'checkbox' },
        muted: { type: 'checkbox' },
        loop: { type: 'checkbox' },
        captions: { type: 'pathbrowser', rootPath: '/content/dam/captions' },
      },
      aemAllowedChildren: [],
      aemLimitations: [
        'Self-hosted videos limited to 100MB',
        'Autoplay only works when muted',
        'Caption format must be WebVTT',
      ],
      thumbnailUrl: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Video+Player',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/7c3aed/ffffff?text=Video+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/6d28d9/ffffff?text=Video+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'media@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'breadcrumb',
      title: 'Breadcrumb',
      description: 'Navigational breadcrumb trail showing page hierarchy. Auto-generates from page structure with customization options.',
      tags: ['navigation', 'seo', 'accessible', 'responsive'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'platform-team@example.com',
      ownerTeam: 'Platform',
      repoLink: 'https://github.com/example/aem-components/tree/main/breadcrumb',
      azureWikiPath: '/Components/Breadcrumb',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=1000-1100'],
      aemComponentPath: '/apps/myproject/components/breadcrumb',
      aemDialogSchema: {
        startLevel: { type: 'number', default: 2 },
        showCurrent: { type: 'checkbox', default: true },
        hideLast: { type: 'checkbox', default: false },
        separator: { type: 'select', options: ['/', '>', '›', '»'] },
      },
      aemAllowedChildren: [],
      aemLimitations: ['Maximum depth: 10 levels'],
      thumbnailUrl: 'https://placehold.co/400x300/14b8a6/ffffff?text=Breadcrumb',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/0d9488/ffffff?text=Breadcrumb+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/0f766e/ffffff?text=Breadcrumb+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'platform@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'footer',
      title: 'Footer',
      description: 'Site-wide footer with multiple column layouts, social links, copyright, and legal links. Supports newsletter signup integration.',
      tags: ['layout', 'global', 'navigation', 'responsive'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'platform-team@example.com',
      ownerTeam: 'Platform',
      repoLink: 'https://github.com/example/aem-components/tree/main/footer',
      azureWikiPath: '/Components/Footer',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=1100-1200'],
      aemComponentPath: '/apps/myproject/components/footer',
      aemDialogSchema: {
        logo: { type: 'pathbrowser', rootPath: '/content/dam/logos' },
        copyrightText: { type: 'textfield' },
        columns: { type: 'number', default: 4, min: 1, max: 6 },
        showNewsletter: { type: 'checkbox' },
        showSocial: { type: 'checkbox' },
      },
      aemAllowedChildren: ['footer-column', 'social-links'],
      aemTemplateConstraints: {
        maxItems: 1,
        allowedParents: ['root'],
      },
      aemLimitations: ['Maximum 6 columns', 'Newsletter integration requires separate form service'],
      thumbnailUrl: 'https://placehold.co/400x300/6366f1/ffffff?text=Footer',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/4f46e5/ffffff?text=Footer+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/4338ca/ffffff?text=Footer+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'platform@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'text-block',
      title: 'Text Block',
      description: 'Rich text editor component for formatted content. Supports headings, lists, links, inline images, and custom styles.',
      tags: ['content', 'text', 'author-editable', 'rich-text'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'content-platform@example.com',
      ownerTeam: 'Content Platform',
      repoLink: 'https://github.com/example/aem-components/tree/main/text-block',
      azureWikiPath: '/Components/Text-Block',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=1200-1300'],
      aemComponentPath: '/apps/myproject/components/text-block',
      aemDialogSchema: {
        text: { type: 'richtext', required: true },
        maxWidth: { type: 'select', options: ['none', 'narrow', 'medium', 'wide'] },
        alignment: { type: 'select', options: ['left', 'center', 'right'] },
      },
      aemAllowedChildren: [],
      aemLimitations: ['Maximum 50,000 characters', 'Custom HTML tags filtered for security'],
      thumbnailUrl: 'https://placehold.co/400x300/64748b/ffffff?text=Text+Block',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/475569/ffffff?text=Text+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/334155/ffffff?text=Text+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'john.developer@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'carousel',
      title: 'Carousel',
      description: 'Image or content carousel with auto-play, navigation arrows, and pagination dots. Supports swipe gestures on touch devices.',
      tags: ['interactive', 'media', 'author-editable', 'responsive'],
      status: ComponentStatus.EXPERIMENTAL,
      ownerEmail: 'ux-team@example.com',
      ownerTeam: 'UX',
      repoLink: 'https://github.com/example/aem-components/tree/main/carousel',
      azureWikiPath: '/Components/Carousel',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=1300-1400'],
      aemComponentPath: '/apps/myproject/components/carousel',
      aemDialogSchema: {
        autoplay: { type: 'checkbox' },
        interval: { type: 'number', default: 5000 },
        showArrows: { type: 'checkbox', default: true },
        showDots: { type: 'checkbox', default: true },
        loop: { type: 'checkbox', default: true },
        itemsPerView: { type: 'number', default: 1, min: 1, max: 4 },
      },
      aemAllowedChildren: ['carousel-item'],
      aemLimitations: [
        'Maximum 15 slides',
        'Autoplay pauses on hover',
        'Multi-item view requires minimum 768px width',
      ],
      thumbnailUrl: 'https://placehold.co/400x300/f59e0b/ffffff?text=Carousel',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/d97706/ffffff?text=Carousel+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/b45309/ffffff?text=Carousel+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'ux@example.com',
      lastUpdatedSource: UpdateSource.MANUAL,
    },
    {
      slug: 'modal',
      title: 'Modal',
      description: 'Modal dialog component for displaying overlaying content. Supports custom sizes, close behaviors, and accessibility features.',
      tags: ['interactive', 'overlay', 'accessible', 'author-editable'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'ux-team@example.com',
      ownerTeam: 'UX',
      repoLink: 'https://github.com/example/aem-components/tree/main/modal',
      azureWikiPath: '/Components/Modal',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=1400-1500'],
      aemComponentPath: '/apps/myproject/components/modal',
      aemDialogSchema: {
        title: { type: 'textfield', required: true },
        size: { type: 'select', options: ['small', 'medium', 'large', 'fullscreen'] },
        closeOnBackdrop: { type: 'checkbox', default: true },
        closeOnEscape: { type: 'checkbox', default: true },
        showCloseButton: { type: 'checkbox', default: true },
      },
      aemAllowedChildren: ['text-block', 'form-field', 'image', 'video-player'],
      aemLimitations: ['Nested modals not supported', 'Maximum content height: 90vh'],
      thumbnailUrl: 'https://placehold.co/400x300/06b6d4/ffffff?text=Modal',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/0891b2/ffffff?text=Modal+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/0e7490/ffffff?text=Modal+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'ux@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
    {
      slug: 'alert',
      title: 'Alert',
      description: 'Alert banner for displaying informational, success, warning, or error messages. Supports dismissible and persistent variants.',
      tags: ['notification', 'feedback', 'author-editable', 'accessible'],
      status: ComponentStatus.STABLE,
      ownerEmail: 'design-system@example.com',
      ownerTeam: 'Design System',
      repoLink: 'https://github.com/example/aem-components/tree/main/alert',
      azureWikiPath: '/Components/Alert',
      figmaLinks: ['https://www.figma.com/file/abc123/Design-System?node-id=1500-1600'],
      aemComponentPath: '/apps/myproject/components/alert',
      aemDialogSchema: {
        message: { type: 'textarea', required: true, maxlength: 500 },
        type: { type: 'select', options: ['info', 'success', 'warning', 'error'], required: true },
        dismissible: { type: 'checkbox', default: false },
        showIcon: { type: 'checkbox', default: true },
        title: { type: 'textfield' },
      },
      aemAllowedChildren: [],
      aemLimitations: ['Dismissed state not persisted across sessions'],
      thumbnailUrl: 'https://placehold.co/400x300/10b981/ffffff?text=Alert',
      screenshotAuthorUrl: 'https://placehold.co/1200x800/059669/ffffff?text=Alert+Author',
      screenshotPublishedUrl: 'https://placehold.co/1200x800/047857/ffffff?text=Alert+Published',
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'sarah.designer@example.com',
      lastUpdatedSource: UpdateSource.AZURE,
    },
  ];

  console.log('📦 Creating components...');
  for (const componentData of components) {
    const component = await prisma.component.upsert({
      where: { slug: componentData.slug },
      update: componentData,
      create: componentData,
    });
    console.log(`  ✅ ${component.title} (${component.status})`);
  }

  // Create sample fragments
  const fragments = [
    {
      slug: 'article-content-fragment',
      type: 'CONTENT_FRAGMENT' as any,
      title: 'Article Content Fragment',
      description: 'Structured content fragment for blog articles and news posts',
      schema: {
        fields: [
          { name: 'headline', type: 'text', required: true, maxLength: 100 },
          { name: 'author', type: 'text', required: true },
          { name: 'publishDate', type: 'date', required: true },
          { name: 'category', type: 'enumeration', options: ['Technology', 'Business', 'Lifestyle'] },
          { name: 'body', type: 'richtext', required: true },
          { name: 'featuredImage', type: 'fragmentReference' },
          { name: 'tags', type: 'tags' },
        ],
      },
      variations: [
        { name: 'default', label: 'Default' },
        { name: 'short', label: 'Short Summary' },
      ],
      tags: ['content', 'article', 'structured'],
      azureWikiPath: '/Fragments/Article-Content-Fragment',
    },
    {
      slug: 'product-experience-fragment',
      type: 'EXPERIENCE_FRAGMENT' as any,
      title: 'Product Experience Fragment',
      description: 'Reusable product showcase experience fragment',
      description: 'Reusable product showcase with image, title, price, and CTA',
      schema: null,
      variations: [
        { name: 'standard', label: 'Standard View' },
        { name: 'compact', label: 'Compact View' },
        { name: 'featured', label: 'Featured View' },
      ],
      tags: ['ecommerce', 'product', 'reusable'],
      azureWikiPath: '/Fragments/Product-Experience-Fragment',
    },
  ];

  console.log('📦 Creating fragments...');
  for (const fragmentData of fragments) {
    const fragment = await prisma.fragment.upsert({
      where: { slug: fragmentData.slug },
      update: fragmentData,
      create: fragmentData,
    });
    console.log(`  ✅ ${fragment.title}`);
  }

  // Create sample patterns
  const pattern1 = await prisma.pattern.upsert({
    where: { slug: 'landing-page-hero' },
    update: {},
    create: {
      slug: 'landing-page-hero',
      title: 'Landing Page Hero Section',
      description: 'Complete hero section pattern combining hero banner with breadcrumb navigation',
      usageGuidance: 'Use this pattern for marketing landing pages and campaign pages. The hero banner should have a strong visual and clear CTA, while the breadcrumb provides navigation context.',
      thumbnailUrl: 'https://placehold.co/800x600/6366f1/ffffff?text=Landing+Hero+Pattern',
      tags: ['marketing', 'landing-page', 'hero', 'pattern'],
    },
  });

  const pattern2 = await prisma.pattern.upsert({
    where: { slug: 'article-layout' },
    update: {},
    create: {
      slug: 'article-layout',
      title: 'Article Page Layout',
      description: 'Standard article page layout with breadcrumb, hero image, text content, and related content cards',
      usageGuidance: 'Use for blog posts, news articles, and long-form content. Ensures consistent reading experience across the site.',
      thumbnailUrl: 'https://placehold.co/800x600/8b5cf6/ffffff?text=Article+Layout+Pattern',
      tags: ['content', 'article', 'blog', 'pattern'],
    },
  });

  // Link components to patterns
  const heroComponent = await prisma.component.findUnique({ where: { slug: 'hero-banner' } });
  const breadcrumbComponent = await prisma.component.findUnique({ where: { slug: 'breadcrumb' } });
  const imageComponent = await prisma.component.findUnique({ where: { slug: 'image' } });
  const textComponent = await prisma.component.findUnique({ where: { slug: 'text-block' } });
  const cardComponent = await prisma.component.findUnique({ where: { slug: 'card' } });

  if (heroComponent && breadcrumbComponent) {
    await prisma.patternComponent.upsert({
      where: {
        patternId_componentId: {
          patternId: pattern1.id,
          componentId: breadcrumbComponent.id,
        },
      },
      update: {},
      create: {
        patternId: pattern1.id,
        componentId: breadcrumbComponent.id,
        order: 0,
      },
    });

    await prisma.patternComponent.upsert({
      where: {
        patternId_componentId: {
          patternId: pattern1.id,
          componentId: heroComponent.id,
        },
      },
      update: {},
      create: {
        patternId: pattern1.id,
        componentId: heroComponent.id,
        order: 1,
      },
    });
  }

  if (breadcrumbComponent && imageComponent && textComponent && cardComponent) {
    await prisma.patternComponent.createMany({
      data: [
        { patternId: pattern2.id, componentId: breadcrumbComponent.id, order: 0 },
        { patternId: pattern2.id, componentId: imageComponent.id, order: 1 },
        { patternId: pattern2.id, componentId: textComponent.id, order: 2 },
        { patternId: pattern2.id, componentId: cardComponent.id, order: 3 },
      ],
      skipDuplicates: true,
    });
  }

  console.log('✅ Created patterns with component relationships');

  // Create a sample sync log
  await prisma.syncLog.create({
    data: {
      syncStartedAt: new Date(Date.now() - 3600000), // 1 hour ago
      syncCompletedAt: new Date(Date.now() - 3500000),
      status: 'SUCCESS',
      pagesProcessed: 15,
      pagesFailed: 0,
      errorLog: [],
    },
  });

  console.log('✅ Created sample sync log');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

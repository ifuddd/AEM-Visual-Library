-- Direct SQL seed for AEM Visual Portal
-- Run with: cd backend && npx prisma db execute --file seed.sql --schema prisma/schema.prisma

-- Create users
INSERT INTO "User" ("azureAdOid", "email", "displayName", "role", "lastLoginAt", "createdAt", "updatedAt")
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', 'ADMIN', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'designer@example.com', 'Sarah Designer', 'CONTRIBUTOR', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'developer@example.com', 'John Developer', 'DOC_OWNER', NOW(), NOW(), NOW())
ON CONFLICT ("azureAdOid") DO NOTHING;

-- Create 18 components
INSERT INTO "Component" (
  "id", "slug", "title", "description", "tags", "status",
  "ownerEmail", "ownerTeam", "createdAt", "updatedAt",
  "lastSyncedAt", "lastUpdatedBy", "lastUpdatedSource"
) VALUES
  (gen_random_uuid(), 'hero-banner', 'Hero Banner', 'Large top-of-page banner with background image, headline, subtitle, and up to two CTA buttons. Supports multiple alignment options and overlay styles.', '{layout,marketing,author-editable,responsive}', 'STABLE', 'marketing-platform@example.com', 'Marketing Platform', NOW(), NOW(), NOW(), 'marketing-platform@example.com', 'AZURE'),
  (gen_random_uuid(), 'cta-button', 'CTA Button', 'Call-to-action button component with multiple style variants (primary, secondary, tertiary, ghost) and size options. Supports internal and external links.', '{action,interactive,author-editable,atomic}', 'STABLE', 'design-system@example.com', 'Design System', NOW(), NOW(), NOW(), 'design-system@example.com', 'AZURE'),
  (gen_random_uuid(), 'card', 'Card', 'Flexible card component for displaying content with optional image, title, description, and CTA. Supports horizontal and vertical layouts with multiple style variants.', '{layout,content,author-editable,responsive}', 'STABLE', 'content-platform@example.com', 'Content Platform', NOW(), NOW(), NOW(), 'content-platform@example.com', 'AZURE'),
  (gen_random_uuid(), 'navigation-header', 'Navigation Header', 'Main site navigation header with logo, primary navigation menu, search, and user actions. Includes responsive mobile menu with hamburger toggle.', '{navigation,layout,global,responsive}', 'STABLE', 'platform-team@example.com', 'Platform', NOW(), NOW(), NOW(), 'platform@example.com', 'AZURE'),
  (gen_random_uuid(), 'accordion', 'Accordion', 'Expandable/collapsible content sections. Supports single or multiple open panels, with optional icons and custom styling.', '{interactive,content,author-editable,accessible}', 'STABLE', 'content-platform@example.com', 'Content Platform', NOW(), NOW(), NOW(), 'john.developer@example.com', 'AZURE'),
  (gen_random_uuid(), 'tabs', 'Tabs', 'Tabbed content container for organizing related information. Supports horizontal and vertical tab orientations with keyboard navigation.', '{interactive,content,author-editable,accessible}', 'STABLE', 'content-platform@example.com', 'Content Platform', NOW(), NOW(), NOW(), 'sarah.designer@example.com', 'AZURE'),
  (gen_random_uuid(), 'form-field', 'Form Field', 'Flexible form input component supporting text, email, tel, number, textarea, select, checkbox, and radio inputs. Includes validation and error messaging.', '{form,interactive,author-editable,accessible}', 'STABLE', 'forms-team@example.com', 'Forms', NOW(), NOW(), NOW(), 'forms@example.com', 'AZURE'),
  (gen_random_uuid(), 'image', 'Image', 'Responsive image component with lazy loading, multiple crop ratios, and caption support. Integrates with AEM DAM for asset management.', '{media,author-editable,responsive,atomic}', 'STABLE', 'design-system@example.com', 'Design System', NOW(), NOW(), NOW(), 'sarah.designer@example.com', 'AZURE'),
  (gen_random_uuid(), 'video-player', 'Video Player', 'HTML5 video player with controls, captions, and thumbnail preview. Supports YouTube, Vimeo, and self-hosted videos.', '{media,interactive,author-editable,accessible}', 'STABLE', 'media-team@example.com', 'Media', NOW(), NOW(), NOW(), 'media@example.com', 'AZURE'),
  (gen_random_uuid(), 'breadcrumb', 'Breadcrumb', 'Navigational breadcrumb trail showing page hierarchy. Auto-generates from page structure with customization options.', '{navigation,seo,accessible,responsive}', 'STABLE', 'platform-team@example.com', 'Platform', NOW(), NOW(), NOW(), 'platform@example.com', 'AZURE'),
  (gen_random_uuid(), 'footer', 'Footer', 'Site-wide footer with multiple column layouts, social links, copyright, and legal links. Supports newsletter signup integration.', '{layout,global,navigation,responsive}', 'STABLE', 'platform-team@example.com', 'Platform', NOW(), NOW(), NOW(), 'platform@example.com', 'AZURE'),
  (gen_random_uuid(), 'text-block', 'Text Block', 'Rich text editor component for formatted content. Supports headings, lists, links, inline images, and custom styles.', '{content,text,author-editable,rich-text}', 'STABLE', 'content-platform@example.com', 'Content Platform', NOW(), NOW(), NOW(), 'john.developer@example.com', 'AZURE'),
  (gen_random_uuid(), 'carousel', 'Carousel', 'Image or content carousel with auto-play, navigation arrows, and pagination dots. Supports swipe gestures on touch devices.', '{interactive,media,author-editable,responsive}', 'EXPERIMENTAL', 'ux-team@example.com', 'UX', NOW(), NOW(), NOW(), 'ux@example.com', 'MANUAL'),
  (gen_random_uuid(), 'modal', 'Modal', 'Modal dialog component for displaying overlaying content. Supports custom sizes, close behaviors, and accessibility features.', '{interactive,overlay,accessible,author-editable}', 'STABLE', 'ux-team@example.com', 'UX', NOW(), NOW(), NOW(), 'ux@example.com', 'AZURE'),
  (gen_random_uuid(), 'alert', 'Alert', 'Alert banner for displaying informational, success, warning, or error messages. Supports dismissible and persistent variants.', '{notification,feedback,author-editable,accessible}', 'STABLE', 'design-system@example.com', 'Design System', NOW(), NOW(), NOW(), 'sarah.designer@example.com', 'AZURE'),
  (gen_random_uuid(), 'teaser', 'Teaser', 'Versatile content promotion component combining image, pre-title, title, description, and action links. Supports multiple rendering variants (default, hero, promo, card) with extensive customization options for enterprise content strategies.', '{content,marketing,promotion,core-component,responsive,author-editable}', 'STABLE', 'creative-dev@example.com', 'Creative Development', NOW(), NOW(), NOW(), 'creative-dev@example.com', 'MANUAL'),
  (gen_random_uuid(), 'section-container', 'Section Container', 'Advanced layout container with extensive styling options including background (color, image, video), spacing controls, grid configurations, and overlay effects. Designed for enterprise page composition with maximum flexibility.', '{layout,container,structure,responsive,grid,author-editable}', 'STABLE', 'creative-dev@example.com', 'Creative Development', NOW(), NOW(), NOW(), 'creative-dev@example.com', 'MANUAL'),
  (gen_random_uuid(), 'content-list', 'Content List', 'Intelligent list component with multiple data source options (child pages, tag-based queries, static items, search results). Features dynamic rendering, pagination, filtering, and extensive display customization for content aggregation and curation.', '{content,dynamic,query,list,aggregation,author-editable}', 'STABLE', 'creative-dev@example.com', 'Creative Development', NOW(), NOW(), NOW(), 'creative-dev@example.com', 'MANUAL')
ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "tags" = EXCLUDED."tags",
  "status" = EXCLUDED."status",
  "ownerEmail" = EXCLUDED."ownerEmail",
  "ownerTeam" = EXCLUDED."ownerTeam",
  "updatedAt" = NOW();

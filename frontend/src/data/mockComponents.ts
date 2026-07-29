// Mock component data for prototype (no database required)
// Trimmed to the 2 components with real Figma designs behind them: Hero Banner and CTA Button

import { ComponentStatus, ComponentVariant } from '@aem-portal/shared';

export interface MockComponent {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  status: ComponentStatus;
  ownerEmail: string;
  ownerTeam: string;

  // New editing fields
  variants?: ComponentVariant[];
  authoringNotes?: string;
  designSpecsNotes?: string;
  azureDevOpsWorkItem?: string;
  figmaLink?: string;

  aemComponentPath?: string;
  aemDialogSchema?: any;
  aemAllowedChildren?: string[];
  aemTemplateConstraints?: any;
  aemLimitations?: string[];
  thumbnailUrl?: string;
  lastSyncedAt: Date;
  lastUpdatedBy: string;
  lastUpdatedSource: 'manual' | 'azure';
  createdAt: Date;
  updatedAt: Date;
}

export const mockComponents: MockComponent[] = [
  {
    id: '1',
    slug: 'hero-banner',
    title: 'Hero Banner',
    description: 'Large top-of-page banner with background image, headline, subtitle, and up to two CTA buttons. Supports multiple alignment options and overlay styles.',
    tags: [],
    status: ComponentStatus.READY,
    ownerEmail: 'marketing-platform@example.com',
    ownerTeam: 'Marketing Platform',

    // New editing fields
    variants: [
      {
        id: 'v1',
        name: 'Full Width',
        description: 'Banner spans entire viewport width with edge-to-edge background',
        imageUrl: '/api/placeholder/800x400?bg=2563eb&fg=ffffff&text=Full+Width+Variant',
        order: 0,
      },
      {
        id: 'v2',
        name: 'Contained',
        description: 'Banner constrained to max-width container with padding',
        imageUrl: '/api/placeholder/800x400?bg=1e40af&fg=ffffff&text=Contained+Variant',
        order: 1,
      },
      {
        id: 'v3',
        name: 'Minimal',
        description: 'Minimalist banner with reduced content and centered alignment',
        order: 2,
      },
    ],
    authoringNotes: '<h2>Usage Guidelines</h2><p>Use the hero banner for high-impact messaging at the top of landing pages and campaign pages. Ensure images are high quality (minimum 1920x1080) and text maintains proper contrast for accessibility.</p><h3>Best Practices</h3><ul><li>Keep headlines under 60 characters</li><li>Use action-oriented CTA text</li><li>Test overlay options for text legibility</li></ul>',
    designSpecsNotes: '<h2>Design Specifications</h2><h3>Spacing</h3><ul><li>Padding: 80px top/bottom, 40px left/right</li><li>Content max-width: 1200px</li><li>Headline margin-bottom: 16px</li><li>Subtitle margin-bottom: 32px</li></ul><h3>Typography</h3><ul><li>Headline: 48px, font-weight: 700, line-height: 1.2</li><li>Subtitle: 20px, font-weight: 400, line-height: 1.5</li></ul><h3>Touch UI Dialog</h3><p>Dialog contains tabs for Content, Design, and Advanced settings. Image asset uses DAM path browser with preview.</p>',
    azureDevOpsWorkItem: 'https://dev.azure.com/example/project/_workitems/edit/12345',
    figmaLink: 'https://www.figma.com/file/abc123/Design-System?node-id=100-200',

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
    thumbnailUrl: '/images/hero-banner.png',
    lastSyncedAt: new Date('2024-01-01'),
    lastUpdatedBy: 'sarah.designer@example.com',
    lastUpdatedSource: 'azure',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    slug: 'cta-button',
    title: 'CTA Button',
    description: 'Call-to-action button component with multiple style variants (primary, secondary, tertiary, ghost) and size options. Supports internal and external links.',
    tags: [],
    status: ComponentStatus.READY,
    ownerEmail: 'design-system@example.com',
    ownerTeam: 'Design System',

    // New editing fields with state images
    variants: [
      {
        id: 'v1',
        name: 'Primary',
        description: 'High-emphasis button for the most important action on the page. Use solid background with high contrast.',
        order: 0,
        stateImages: {
          default: '/api/placeholder/400x100?bg=059669&fg=ffffff&text=Primary+Default',
          hover: '/api/placeholder/400x100?bg=047857&fg=ffffff&text=Primary+Hover',
          focus: '/api/placeholder/400x100?bg=065f46&fg=ffffff&text=Primary+Focus',
          disabled: '/api/placeholder/400x100?bg=d1d5db&fg=9ca3af&text=Primary+Disabled',
        },
      },
      {
        id: 'v2',
        name: 'Secondary',
        description: 'Medium-emphasis button for supporting actions. Outlined style with transparent background.',
        order: 1,
        stateImages: {
          default: '/api/placeholder/400x100?bg=ffffff&fg=059669&text=Secondary+Default',
          hover: '/api/placeholder/400x100?bg=f0fdf4&fg=059669&text=Secondary+Hover',
          focus: '/api/placeholder/400x100?bg=dcfce7&fg=059669&text=Secondary+Focus',
          disabled: '/api/placeholder/400x100?bg=f9fafb&fg=d1d5db&text=Secondary+Disabled',
        },
      },
      {
        id: 'v3',
        name: 'Tertiary',
        description: 'Low-emphasis button for less critical actions. Text-based style with minimal decoration.',
        order: 2,
        stateImages: {
          default: '/api/placeholder/400x100?bg=ffffff&fg=6b7280&text=Tertiary+Default',
          hover: '/api/placeholder/400x100?bg=f9fafb&fg=4b5563&text=Tertiary+Hover',
          focus: '/api/placeholder/400x100?bg=f3f4f6&fg=374151&text=Tertiary+Focus',
          disabled: '/api/placeholder/400x100?bg=ffffff&fg=d1d5db&text=Tertiary+Disabled',
        },
      },
      {
        id: 'v4',
        name: 'Ghost',
        description: 'Minimal button with transparent background. Use on colored backgrounds or when maximum subtlety is needed.',
        order: 3,
        stateImages: {
          default: '/api/placeholder/400x100?bg=ffffff&fg=059669&text=Ghost+Default',
          hover: '/api/placeholder/400x100?bg=f0fdf4&fg=059669&text=Ghost+Hover',
          focus: '/api/placeholder/400x100?bg=dcfce7&fg=059669&text=Ghost+Focus',
          disabled: '/api/placeholder/400x100?bg=ffffff&fg=d1d5db&text=Ghost+Disabled',
        },
      },
    ],
    authoringNotes: '<h2>CTA Button Component</h2><h3>When to Use</h3><p><strong>✅ Use CTA Button for:</strong></p><ul><li>Primary actions (sign up, download, submit)</li><li>Secondary actions (learn more, cancel)</li><li>Navigation to key pages</li><li>Form submissions</li><li>Downloads and external links</li></ul><p><strong>❌ Do NOT use for:</strong></p><ul><li>Text links within paragraphs (use standard link)</li><li>Navigation menus (use navigation component)</li><li>Inline actions within tables (use action icons)</li></ul><h3>Variant Guidelines</h3><ul><li><strong>Primary:</strong> Main action you want users to take (max 1 per page section)</li><li><strong>Secondary:</strong> Supporting primary actions or standalone important actions</li><li><strong>Tertiary:</strong> Multiple actions with visual hierarchy needed</li><li><strong>Ghost:</strong> On colored backgrounds or maximum subtlety</li></ul><h3>Best Practices</h3><ul><li>Keep button text under 30 characters</li><li>Use action verbs (Get Started, Download, Learn More)</li><li>Avoid generic text like "Click Here" or "Submit"</li><li>Ensure minimum 44x44px touch target for mobile</li><li>Maintain 4.5:1 contrast ratio for accessibility</li></ul><h3>Accessibility</h3><ul><li>All buttons are keyboard accessible (Tab navigation)</li><li>Focus indicators are always visible</li><li>Screen reader compatible</li><li>Meets WCAG 2.1 AA standards</li></ul>',
    designSpecsNotes: '<h2>Design Specifications</h2><h3>Typography</h3><ul><li>Font weight: 600 (semibold)</li><li>Font size: 0.875rem (small), 1rem (medium), 1.125rem (large)</li><li>Line height: 1.5</li><li>Letter spacing: 0.02em</li></ul><h3>Spacing</h3><ul><li>Small: 0.5rem (top/bottom), 1rem (left/right)</li><li>Medium: 0.75rem (top/bottom), 1.5rem (left/right)</li><li>Large: 1rem (top/bottom), 2rem (left/right)</li><li>Icon gap: 0.5rem</li></ul><h3>Colors (Primary Variant)</h3><ul><li>Background (default): #059669 (green-600)</li><li>Background (hover): #047857 (green-700)</li><li>Text: #FFFFFF (white)</li><li>Focus ring: 2px solid currentColor, 2px offset</li></ul><h3>Borders & Corners</h3><ul><li>Border radius: 0.375rem (6px)</li><li>Secondary border: 2px solid currentColor</li></ul><h3>Touch UI Dialog</h3><p>The Touch UI dialog contains the following configurable fields:</p><ul><li><strong>Button Text</strong> (textfield, required, max 30 chars)</li><li><strong>Link</strong> (pathfield, required)</li><li><strong>Variant</strong> (select: primary, secondary, tertiary, ghost)</li><li><strong>Size</strong> (select: small, medium, large)</li><li><strong>Open in New Tab</strong> (checkbox)</li><li><strong>Icon</strong> (select: none, arrow-right, download, external)</li></ul>',
    figmaLink: 'https://www.figma.com/design/nqhhQSjIlZbPChqOfdO3TQ/%E2%9C%A8-Design-System-for-AEM-v2-%E2%9C%A8?node-id=15310-1885',

    aemComponentPath: '/apps/myproject/components/cta-button',
    aemDialogSchema: {
      text: {
        type: 'textfield',
        label: 'Button Text',
        required: true,
        maxlength: 30,
        description: 'Use action verbs. Keep concise.'
      },
      link: {
        type: 'pathfield',
        label: 'Link URL',
        required: true,
        description: 'Internal path or external URL'
      },
      variant: {
        type: 'select',
        label: 'Button Variant',
        options: ['primary', 'secondary', 'tertiary', 'ghost'],
        default: 'primary',
        description: 'Visual style - use primary for main actions'
      },
      size: {
        type: 'select',
        label: 'Button Size',
        options: ['small', 'medium', 'large'],
        default: 'medium'
      },
      openInNewTab: {
        type: 'checkbox',
        label: 'Open in New Tab',
        description: 'Check for external links or PDFs'
      },
      icon: {
        type: 'select',
        label: 'Icon',
        options: ['none', 'arrow-right', 'download', 'external'],
        default: 'none'
      }
    },
    aemLimitations: [
      'No custom icon upload support - limited to predefined icons',
      'Button text limited to 30 characters',
      'No support for multi-line button text',
      'Icon always appears after text (no left-side icons)',
      'Cannot disable the button programmatically in Touch UI'
    ],
    thumbnailUrl: '/images/cta-button.png',
    lastSyncedAt: new Date('2024-01-01'),
    lastUpdatedBy: 'john.developer@example.com',
    lastUpdatedSource: 'azure',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

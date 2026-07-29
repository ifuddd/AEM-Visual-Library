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
    description: 'Full-bleed course page hero with a photo background, dark gradient overlay, course title/type/UCAS code, and an optional info alert banner for application-status messaging.',
    tags: [],
    status: ComponentStatus.READY,
    ownerEmail: 'marketing-platform@example.com',
    ownerTeam: 'Marketing Platform',

    // New editing fields
    variants: [
      {
        id: 'v1',
        name: 'Default',
        description: 'Course hero with the application-status alert and UCAS code shown',
        imageUrl: '/images/hero-banner.png',
        order: 0,
      },
    ],
    authoringNotes: '<h2>Usage Guidelines</h2><p>Drag and drop the <strong>Hero Banner</strong> component into the page. Set the course title, course type and UCAS code in the dialog, and pick a background image via the DAM path picker.</p><h3>Best Practices</h3><ul><li>Toggle the alert banner on/off from the Style tab when applications open or close</li><li>Keep the alert message to one or two sentences, since it does not scroll</li><li>UCAS code is optional, leave blank or turn off "Show UCAS Code" to hide that segment</li></ul>',
    designSpecsNotes: '<h2>Design Specifications</h2><h3>Layout</h3><ul><li>Frame: 1440x400 desktop, full-bleed</li><li>Heading: Lora, 42px, line-height 1.3, -0.21px tracking, white</li><li>Subtitle row: 22px, bold UCAS code segment</li></ul><h3>Overlay</h3><p>linear-gradient(180deg, rgba(9,21,31,.79) 0%, rgba(9,21,31,.79) 5.668%, rgba(9,21,31,0) 23.381%, rgba(9,21,31,.79) 75.095%, rgba(9,21,31,.79) 100%)</p><h3>Alert Banner</h3><ul><li>White card, #10263b body text, 16px</li><li>Icon badge bordered #cfd4d8</li></ul><h3>Touch UI Dialog</h3><p>Dialog contains the course title, course type, UCAS code, alert toggle and message, and a DAM path picker for the background image.</p>',
    azureDevOpsWorkItem: 'https://dev.azure.com/example/project/_workitems/edit/12345',
    figmaLink: 'https://www.figma.com/design/nqhhQSjIlZbPChqOfdO3TQ/%E2%9C%A8-Design-System-for-AEM-v2-%E2%9C%A8?node-id=6035-74549',

    aemComponentPath: '/apps/aem-visual-library/components/content/hero-banner',
    aemDialogSchema: {
      title: { type: 'textfield', required: true, description: 'Course title heading text' },
      courseType: { type: 'textfield', description: 'Course type or qualification line, e.g. Bachelor of Engineering with Honors' },
      ucasCode: { type: 'textfield', description: 'UCAS code value shown next to the label' },
      showUcasCode: { type: 'checkbox', description: 'Show or hide the UCAS code segment and its divider' },
      showAlert: { type: 'checkbox', description: 'Show or hide the application-status alert banner' },
      alertText: { type: 'textarea', maxlength: 300, description: 'Alert banner message text' },
      bgImage: { type: 'pathbrowser', rootPath: '/content/dam', description: 'Background photo asset' },
    },
    aemAllowedChildren: [],
    aemTemplateConstraints: {
      allowedParents: ['responsivegrid'],
      maxItems: 1,
    },
    aemLimitations: [
      'Background image is fixed per page, with no per-breakpoint cropping control',
      'Alert banner supports a single message only, no dismiss or close action',
      'UCAS code display expects exactly one code value',
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
    description: 'Pill-shaped call-to-action button with Primary (filled) and Secondary (outlined) styles, three sizes, and leading and trailing icon slots.',
    tags: [],
    status: ComponentStatus.READY,
    ownerEmail: 'core-components@example.com',
    ownerTeam: 'Core Components',

    // New editing fields
    variants: [
      {
        id: 'v1',
        name: 'Primary',
        description: 'Filled primary button',
        imageUrl: '/images/cta-button.png',
        order: 0,
      },
      {
        id: 'v2',
        name: 'Secondary',
        description: 'Outlined secondary button',
        imageUrl: '/images/cta-button-secondary.png',
        order: 1,
      },
    ],
    authoringNotes: '<h2>CTA Button Component</h2><h3>When to Use</h3><ul><li><strong>Primary</strong> is filled and used for the main action on a page</li><li><strong>Secondary</strong> is outlined and used for a supporting action</li></ul><h3>Best Practices</h3><ul><li>Choose Primary or Secondary type from the dialog, set the label, and pick a size</li><li>Leading and trailing icon slots are optional</li><li>Keep the label short and action-oriented</li></ul>',
    designSpecsNotes: '<h2>Design Specifications</h2><h3>Shape</h3><p>Fully rounded pill, border-radius: 56px.</p><h3>Sizes</h3><ul><li>Small: 16px/12px padding</li><li>Medium: 24px/16px padding</li><li>Large: 32px/16px padding</li><li>Gap between icon and label: 16px at every size</li></ul><h3>Colors</h3><ul><li>Primary: fill #deb406, text #10263b</li><li>Secondary: border #cfd4d8, text #10263b</li></ul><h3>Touch UI Dialog</h3><p>The Touch UI dialog contains the following configurable fields:</p><ul><li><strong>Label</strong> (textfield, required)</li><li><strong>Variant</strong> (select: primary, secondary)</li><li><strong>Size</strong> (select: sm, md, lg)</li><li><strong>Disabled</strong> (checkbox)</li></ul>',
    figmaLink: 'https://www.figma.com/design/nqhhQSjIlZbPChqOfdO3TQ/%E2%9C%A8-Design-System-for-AEM-v2-%E2%9C%A8?node-id=68-12755',

    aemComponentPath: '/apps/aem-visual-library/components/content/cta-button',
    aemDialogSchema: {
      label: {
        type: 'textfield',
        label: 'Label',
        required: true,
        maxlength: 30,
        description: 'Use action verbs. Keep concise.'
      },
      variant: {
        type: 'select',
        label: 'Variant',
        options: ['primary', 'secondary'],
        default: 'primary',
        description: 'Primary is filled, Secondary is outlined'
      },
      size: {
        type: 'select',
        label: 'Size',
        options: ['sm', 'md', 'lg'],
        default: 'md',
        description: 'Controls padding, text size, and icon size'
      },
      disabled: {
        type: 'checkbox',
        label: 'Disabled',
        description: 'Renders the button in its disabled state'
      }
    },
    aemLimitations: [
      'Only Primary and Secondary types are wired up here, Ghost and Text-only types from the Figma library are not yet built',
      'Label font falls back to the system sans stack since Circular Pro is not available in this environment',
    ],
    thumbnailUrl: '/images/cta-button.png',
    lastSyncedAt: new Date('2024-01-01'),
    lastUpdatedBy: 'john.developer@example.com',
    lastUpdatedSource: 'azure',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

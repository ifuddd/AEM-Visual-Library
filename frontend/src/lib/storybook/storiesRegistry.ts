import { ComponentStories } from './types';

export const DEFAULT_STORY_ID = 'hero-banner--default';

export const storiesRegistry: ComponentStories[] = [
  {
    slug: 'hero-banner',
    title: 'Hero Banner',
    description: 'Full-bleed course page hero with a photo background, dark gradient overlay, course title/type/UCAS code, and an optional info alert banner for application-status messaging.',
    status: 'READY',
    ownerTeam: 'Marketing Platform',
    aemComponentPath: '/apps/aem-visual-library/components/content/hero-banner',
    aemAllowedChildren: [],
    aemLimitations: [
      'Background image is fixed per page, with no per-breakpoint cropping control',
      'Alert banner supports a single message only, no dismiss/close action',
      'UCAS code display expects exactly one code value',
    ],
    figmaUrl: 'https://www.figma.com/design/nqhhQSjIlZbPChqOfdO3TQ/%E2%9C%A8-Design-System-for-AEM-v2-%E2%9C%A8?node-id=6035-74549',
    authoringNotes: '<p>Drag and drop the <strong>Hero Banner</strong> component into the page. Set the course title, course type and UCAS code in the dialog, and pick a background image via the DAM path picker.</p><ul><li>Toggle the alert banner on/off from the Style tab when applications open or close</li><li>Keep the alert message to one or two sentences, since it does not scroll</li><li>UCAS code is optional, leave blank or turn off "Show UCAS Code" to hide that segment</li></ul>',
    designSpecsNotes: '<p>Frame: <code>1440×400</code> desktop, full-bleed. Heading: <code>Lora</code> 42px / line-height 1.3 / -0.21px tracking, white. Subtitle row: 22px, bold UCAS code segment. Overlay: <code>linear-gradient(180deg, rgba(9,21,31,.79) 0%, rgba(9,21,31,.79) 5.668%, rgba(9,21,31,0) 23.381%, rgba(9,21,31,.79) 75.095%, rgba(9,21,31,.79) 100%)</code>. Alert banner: white card, <code>#10263b</code> body text, 16px, icon badge bordered <code>#cfd4d8</code>.</p>',
    stories: [
      {
        id: 'default',
        name: 'Default',
        description: 'Course hero with the application-status alert and UCAS code shown',
        args: {
          title: 'Course title',
          courseType: 'Bachelor of Engineering with Honors',
          ucasCode: 'H402',
          showUcasCode: true,
          bgImage: '',
          showAlert: true,
          alertText: 'This course is now closed for UK and International applications for 2025 entry. You can start an application for 2026 entry in UCAS, on 14 May 2025.',
        },
      },
    ],
    controls: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'Course title' },
      { key: 'courseType', label: 'Course Type', type: 'text', defaultValue: 'Bachelor of Engineering with Honors' },
      { key: 'ucasCode', label: 'UCAS Code', type: 'text', defaultValue: 'H402' },
      { key: 'showUcasCode', label: 'Show UCAS Code', type: 'boolean', defaultValue: true },
      { key: 'showAlert', label: 'Show Alert Banner', type: 'boolean', defaultValue: true },
      { key: 'alertText', label: 'Alert Text', type: 'text', defaultValue: 'This course is now closed for UK and International applications for 2025 entry. You can start an application for 2026 entry in UCAS, on 14 May 2025.' },
      { key: 'bgImage', label: 'Background Image URL', type: 'text', defaultValue: '' },
    ],
  },
  {
    slug: 'cta-button',
    title: 'CTA Button',
    description: 'Pill-shaped call-to-action button with Primary (filled) and Secondary (outlined) styles, three sizes, and leading/trailing icon slots.',
    status: 'READY',
    ownerTeam: 'Core Components',
    aemComponentPath: '/apps/aem-visual-library/components/content/cta-button',
    aemAllowedChildren: [],
    aemLimitations: [
      'Only Primary and Secondary types are wired up here; Ghost and Text-only types from the Figma library are not yet built',
      'Label font falls back to the system sans stack since Circular Pro is not available in this environment',
    ],
    figmaUrl: 'https://www.figma.com/design/nqhhQSjIlZbPChqOfdO3TQ/%E2%9C%A8-Design-System-for-AEM-v2-%E2%9C%A8?node-id=68-12755',
    authoringNotes: '<p>Drag and drop the <strong>CTA Button</strong> component into the page. Choose Primary or Secondary type from the dialog, set the label, and pick a size.</p><ul><li>Primary is filled and used for the main action on a page</li><li>Secondary is outlined and used for a supporting action</li><li>Leading and trailing icon slots are optional</li></ul>',
    designSpecsNotes: '<p>Shape: fully rounded pill, <code>border-radius: 56px</code>. Sizes: Small <code>16px/12px</code> padding, Medium <code>24px/16px</code>, Large <code>32px/16px</code>, gap between icon and label is <code>16px</code> at every size. Primary fill <code>#deb406</code>, text <code>#10263b</code>. Secondary border <code>#cfd4d8</code>, text <code>#10263b</code>.</p>',
    stories: [
      {
        id: 'default',
        name: 'Primary',
        description: 'Filled primary button',
        args: { label: 'Button text', variant: 'primary', size: 'md', disabled: false },
        figmaNodeUrl: 'https://www.figma.com/design/nqhhQSjIlZbPChqOfdO3TQ/%E2%9C%A8-Design-System-for-AEM-v2-%E2%9C%A8?node-id=68-12756',
      },
      {
        id: 'secondary',
        name: 'Secondary',
        description: 'Outlined secondary button',
        args: { label: 'Button text', variant: 'secondary', size: 'md', disabled: false },
        figmaNodeUrl: 'https://www.figma.com/design/nqhhQSjIlZbPChqOfdO3TQ/%E2%9C%A8-Design-System-for-AEM-v2-%E2%9C%A8?node-id=68-12760',
      },
    ],
    controls: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Button text' },
      { key: 'variant', label: 'Variant', type: 'select', defaultValue: 'primary', options: ['primary', 'secondary'] },
      { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: ['sm', 'md', 'lg'] },
      { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
    ],
  },
];

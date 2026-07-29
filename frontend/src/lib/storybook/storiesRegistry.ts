import { ComponentStories } from './types';

export const DEFAULT_STORY_ID = 'hero-banner--with-alert';

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
      'Background image is fixed per page — no per-breakpoint cropping control',
      'Alert banner supports a single message only, no dismiss/close action',
      'UCAS code display expects exactly one code value',
    ],
    figmaUrl: 'https://www.figma.com/design/nqhhQSjIlZbPChqOfdO3TQ/%E2%9C%A8-Design-System-for-AEM-v2-%E2%9C%A8?node-id=6035-74549',
    authoringNotes: '<p>Drag and drop the <strong>Hero Banner</strong> component into the page. Set the course title, course type and UCAS code in the dialog, and pick a background image via the DAM path picker.</p><ul><li>Toggle the alert banner on/off from the Style tab when applications open or close</li><li>Keep the alert message to one or two sentences — it does not scroll</li><li>UCAS code is optional — leave blank to hide that segment</li></ul>',
    designSpecsNotes: '<p>Frame: <code>1440×400</code> desktop, full-bleed. Heading: <code>Lora</code> 42px / line-height 1.3 / -0.21px tracking, white. Subtitle row: 22px, bold UCAS code segment. Overlay: <code>linear-gradient(180deg, rgba(9,21,31,.79) 0%, rgba(9,21,31,.79) 5.668%, rgba(9,21,31,0) 23.381%, rgba(9,21,31,.79) 75.095%, rgba(9,21,31,.79) 100%)</code>. Alert banner: white card, <code>#10263b</code> body text, 16px, icon badge bordered <code>#cfd4d8</code>.</p>',
    stories: [
      {
        id: 'with-alert',
        name: 'With Alert Banner',
        description: 'Course hero with the application-status alert shown',
        args: {
          title: 'Course title',
          courseType: 'Bachelor of Engineering with Honors',
          ucasCode: 'H402',
          bgImage: '',
          showAlert: true,
          alertText: 'This course is now closed for UK and International applications for 2025 entry. You can start an application for 2026 entry in UCAS, on 14 May 2025.',
        },
      },
      {
        id: 'without-alert',
        name: 'Without Alert Banner',
        description: 'Course hero with no alert — used when applications are open',
        args: {
          title: 'Course title',
          courseType: 'Bachelor of Engineering with Honors',
          ucasCode: 'H402',
          bgImage: '',
          showAlert: false,
          alertText: '',
        },
      },
    ],
    controls: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'Course title' },
      { key: 'courseType', label: 'Course Type', type: 'text', defaultValue: 'Bachelor of Engineering with Honors' },
      { key: 'ucasCode', label: 'UCAS Code', type: 'text', defaultValue: 'H402' },
      { key: 'showAlert', label: 'Show Alert Banner', type: 'boolean', defaultValue: true },
      { key: 'alertText', label: 'Alert Text', type: 'text', defaultValue: 'This course is now closed for UK and International applications for 2025 entry. You can start an application for 2026 entry in UCAS, on 14 May 2025.' },
      { key: 'bgImage', label: 'Background Image URL', type: 'text', defaultValue: '' },
    ],
  },
  {
    slug: 'cta-button',
    title: 'CTA Button',
    description: 'Configurable call-to-action button with four visual variants and three size options.',
    status: 'READY',
    ownerTeam: 'Core Components',
    aemComponentPath: '/apps/aem-visual-library/components/content/cta-button',
    aemAllowedChildren: [],
    aemLimitations: ['Icon placement limited to left side only'],
    stories: [
      { id: 'default', name: 'Primary', description: 'Default primary button', args: { label: 'Get Started', variant: 'primary', size: 'md', disabled: false } },
      { id: 'secondary', name: 'Secondary', description: 'Secondary / tonal style', args: { label: 'Learn More', variant: 'secondary', size: 'md', disabled: false } },
      { id: 'ghost', name: 'Ghost', description: 'Outline ghost button', args: { label: 'View All', variant: 'ghost', size: 'md', disabled: false } },
      { id: 'disabled', name: 'Disabled', description: 'Disabled state', args: { label: 'Unavailable', variant: 'primary', size: 'md', disabled: true } },
    ],
    controls: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Get Started' },
      { key: 'variant', label: 'Variant', type: 'select', defaultValue: 'primary', options: ['primary', 'secondary', 'ghost', 'link'] },
      { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: ['sm', 'md', 'lg'] },
      { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
    ],
  },
];

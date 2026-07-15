import { ComponentStories } from './types';

export const DEFAULT_STORY_ID = 'hero-banner--default';

export const storiesRegistry: ComponentStories[] = [
  {
    slug: 'hero-banner',
    title: 'Hero Banner',
    description: 'Full-width promotional banner with headline, subtitle and CTA buttons. Supports image overlays and configurable alignment.',
    status: 'READY',
    ownerTeam: 'Marketing Platform',
    aemComponentPath: '/apps/aem-visual-library/components/content/hero-banner',
    aemAllowedChildren: [],
    aemLimitations: [
      'Maximum two CTA buttons per instance',
      'Background video not supported on mobile viewports',
      'Overlay opacity is fixed — cannot be customised per-page',
    ],
    figmaUrl: 'https://www.figma.com/design/nqhhQSjIlZbPChqOfdO3TQ/%E2%9C%A8-Design-System-for-AEM-v2-%E2%9C%A8?node-id=6035-74582',
    authoringNotes: '<p>Drag and drop the <strong>Hero Banner</strong> component into the page. Use the dialog to set headline, subtitle, CTA labels and target URLs. Choose an overlay colour from the Style tab.</p><ul><li>Keep headlines under 60 characters</li><li>Subtitle is optional — leave blank to hide</li><li>Use the DAM path picker for background images</li></ul>',
    designSpecsNotes: '<p>Min height: <code>420px</code> desktop / <code>280px</code> mobile. Typography: heading is <code>display-2</code>, subtitle is <code>body-lg</code>. Primary CTA uses brand primary fill; secondary uses ghost style.</p>',
    stories: [
      { id: 'default', name: 'Default', description: 'Standard hero with dark overlay', args: { title: 'Experience More with AEM', subtitle: 'Build faster, author smarter.', alignment: 'left', overlay: 'dark', ctaText: 'Get Started', ctaSecondaryText: 'Learn More', bgColor: '#2563eb' } },
      { id: 'centered', name: 'Centered', description: 'Centre-aligned content', args: { title: 'Welcome to Our Platform', subtitle: 'Everything you need in one place.', alignment: 'center', overlay: 'dark', ctaText: 'Explore Now', ctaSecondaryText: '', bgColor: '#7c3aed' } },
      { id: 'no-overlay', name: 'No Overlay', description: 'No background overlay', args: { title: 'Clean & Modern', subtitle: 'Minimal style hero variant.', alignment: 'left', overlay: 'none', ctaText: 'Discover', ctaSecondaryText: 'Watch Video', bgColor: '#059669' } },
      { id: 'dark', name: 'Dark Background', description: 'Dark colour scheme', args: { title: 'The AEM Design System', subtitle: 'Enterprise-grade components.', alignment: 'left', overlay: 'dark', ctaText: 'Get Access', ctaSecondaryText: 'Documentation', bgColor: '#111827' } },
    ],
    controls: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'Experience More with AEM' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', defaultValue: 'Build faster, author smarter.' },
      { key: 'alignment', label: 'Alignment', type: 'select', defaultValue: 'left', options: ['left', 'center'] },
      { key: 'overlay', label: 'Overlay', type: 'select', defaultValue: 'dark', options: ['none', 'dark', 'light'] },
      { key: 'ctaText', label: 'Primary CTA', type: 'text', defaultValue: 'Get Started' },
      { key: 'ctaSecondaryText', label: 'Secondary CTA', type: 'text', defaultValue: 'Learn More' },
      { key: 'bgColor', label: 'Background Colour', type: 'color', defaultValue: '#2563eb' },
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

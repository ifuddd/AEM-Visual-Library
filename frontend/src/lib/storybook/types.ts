export type ControlType = 'text' | 'boolean' | 'select' | 'number' | 'color';

export interface ControlDefinition {
  key: string;
  label: string;
  type: ControlType;
  defaultValue: any;
  options?: string[];
}

export interface StoryDefinition {
  id: string;
  name: string;
  description?: string;
  args: Record<string, any>;
  imageUrl?: string;
  figmaNodeUrl?: string;
}

export interface ComponentStories {
  slug: string;
  title: string;
  description: string;
  status: 'READY' | 'IN_REVIEW';
  ownerTeam?: string;
  authoringNotes?: string;
  designSpecsNotes?: string;
  figmaUrl?: string;
  adoTicketUrl?: string;
  aemComponentPath?: string;
  aemAllowedChildren?: string[];
  aemLimitations?: string[];
  stories: StoryDefinition[];
  controls: ControlDefinition[];
}

export type ViewportKey = 'mobile' | 'tablet' | 'desktop';
export type BackgroundKey = 'light' | 'dark' | 'transparent';
export type AddonTab = 'controls' | 'docs' | 'aem';

export type PreviewMode = 'live' | 'figma';

export interface StorybookUIState {
  selectedStoryId: string;
  controlValues: Record<string, any>;
  viewport: ViewportKey;
  background: BackgroundKey;
  zoom: number;
  addonsOpen: boolean;
  sidebarOpen: boolean;
  activeAddon: AddonTab;
  previewMode: PreviewMode;
}

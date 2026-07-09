/**
 * Component status in the lifecycle
 */
export enum ComponentStatus {
  READY = 'ready',
  IN_REVIEW = 'in_review',
}

/**
 * Source of last update
 */
export enum UpdateSource {
  AZURE = 'azure',
  MANUAL = 'manual',
}

/**
 * AEM component metadata
 */
export interface AEMMetadata {
  componentPath: string;
  dialogSchema?: Record<string, any>;
  allowedChildren?: string[];
  templateConstraints?: Record<string, any>;
  limitations?: string[];
}

/**
 * Visual assets for a component
 */
export interface VisualAssets {
  thumbnailUrl?: string;
  screenshotAuthorUrl?: string;
  screenshotPublishedUrl?: string;
}

/**
 * Last update information
 */
export interface LastUpdate {
  source: UpdateSource;
  date: Date;
  author: string;
}

/**
 * State-specific images for a component variant
 * Used to show different visual states (default, hover, focus, disabled)
 */
export interface ComponentVariantStateImages {
  default?: string;
  hover?: string;
  focus?: string;
  disabled?: string;
  active?: string;
}

/**
 * Component variant
 */
export interface ComponentVariant {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  stateImages?: ComponentVariantStateImages;
  order: number;
}

/**
 * Main Component entity
 */
export interface Component {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  status: ComponentStatus;
  ownerEmail?: string;
  ownerTeam?: string;

  // Editing capabilities
  variants?: ComponentVariant[];
  authoringNotes?: string;
  designSpecsNotes?: string;
  azureDevOpsWorkItem?: string;
  figmaLink?: string;

  // Legacy fields (deprecated - will be removed)
  repoLink?: string;
  azureWikiPath?: string;
  azureWikiUrl?: string;
  figmaLinks?: string[];

  aemMetadata?: AEMMetadata;
  visualAssets?: VisualAssets;
  lastUpdate?: LastUpdate;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Component creation/update input
 */
export interface ComponentInput {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  status?: ComponentStatus;
  ownerEmail?: string;
  ownerTeam?: string;
  repoLink?: string;
  azureWikiPath?: string;
  azureWikiUrl?: string;
  figmaLinks?: string[];
  aemMetadata?: AEMMetadata;
  visualAssets?: VisualAssets;
}

/**
 * Component search filters
 */
export interface ComponentFilters {
  search?: string;
  tags?: string[];
  status?: ComponentStatus[];
  ownerTeam?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

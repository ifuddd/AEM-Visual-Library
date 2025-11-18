/**
 * Fragment types in AEM
 */
export enum FragmentType {
  CONTENT_FRAGMENT = 'content_fragment',
  EXPERIENCE_FRAGMENT = 'experience_fragment',
}

/**
 * Fragment variation
 */
export interface FragmentVariation {
  name: string;
  description?: string;
  data?: Record<string, any>;
}

/**
 * Fragment entity
 */
export interface Fragment {
  id: string;
  slug: string;
  type: FragmentType;
  title: string;
  description: string;
  schema?: Record<string, any>;
  variations?: FragmentVariation[];
  sampleData?: Record<string, any>;
  tags: string[];
  azureWikiPath?: string;
  azureWikiUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fragment creation/update input
 */
export interface FragmentInput {
  slug: string;
  type: FragmentType;
  title: string;
  description: string;
  schema?: Record<string, any>;
  variations?: FragmentVariation[];
  sampleData?: Record<string, any>;
  tags?: string[];
  azureWikiPath?: string;
  azureWikiUrl?: string;
}

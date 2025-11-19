/**
 * Sync job status
 */
export enum SyncStatus {
  SUCCESS = 'success',
  PARTIAL = 'partial',
  FAILED = 'failed',
}

/**
 * Sync log entry
 */
export interface SyncLog {
  id: string;
  syncStartedAt: Date;
  syncCompletedAt?: Date;
  status: SyncStatus;
  pagesProcessed: number;
  pagesFailed: number;
  errorLog?: Record<string, any>;
  createdAt: Date;
}

/**
 * Sync error detail
 */
export interface SyncError {
  page: string;
  error: string;
  timestamp: Date;
}

/**
 * Wiki page frontmatter (parsed from YAML)
 */
export interface WikiFrontmatter {
  component_id?: string;
  fragment_id?: string;
  pattern_id?: string;
  title?: string;
  description?: string;
  status?: string;
  owner_team?: string;
  owner_email?: string;
  figma_links?: string[];
  aem_component_path?: string;
  aem_allowed_children?: string[];
  aem_dialog_schema?: Record<string, any>;
  aem_template_constraints?: Record<string, any>;
  aem_limitations?: string[];
  tags?: string[];
  type?: string;
  schema?: Record<string, any>;
  variations?: any[];
}

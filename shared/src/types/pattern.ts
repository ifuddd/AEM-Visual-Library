/**
 * Pattern - composition of multiple components
 */
export interface Pattern {
  id: string;
  slug: string;
  title: string;
  description: string;
  componentIds: string[];
  usageGuidance?: string;
  thumbnailUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pattern creation/update input
 */
export interface PatternInput {
  slug: string;
  title: string;
  description: string;
  componentIds: string[];
  usageGuidance?: string;
  thumbnailUrl?: string;
  tags?: string[];
}

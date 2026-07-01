// Mock component service for prototype (no database required)
import {
  Component,
  ComponentInput,
  ComponentFilters,
  PaginatedResponse,
  ComponentStatus,
  ApiError,
} from '@aem-portal/shared';
import { mockComponents, MockComponent } from '../data/mockComponents';
import logger from '../utils/logger';

class ComponentServiceMock {
  /**
   * Get all components with pagination and filters
   */
  async getComponents(
    filters: ComponentFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Component>> {
    let filtered = [...mockComponents];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((c) => filters.status!.includes(c.status as any));
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((c) =>
        c.tags.some((tag) => filters.tags!.includes(tag))
      );
    }

    // Apply owner team filter
    if (filters.ownerTeam) {
      filtered = filtered.filter((c) => c.ownerTeam === filters.ownerTeam);
    }

    // Calculate pagination
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filtered.slice(start, end);

    return {
      data: paginatedData.map(this.mapToComponent),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Get component by ID
   */
  async getComponentById(id: string): Promise<Component | null> {
    const component = mockComponents.find((c) => c.id === id);
    return component ? this.mapToComponent(component) : null;
  }

  /**
   * Get component by slug
   */
  async getComponentBySlug(slug: string): Promise<Component | null> {
    const component = mockComponents.find((c) => c.slug === slug);
    return component ? this.mapToComponent(component) : null;
  }

  /**
   * Get all unique tags
   */
  async getAllTags(): Promise<string[]> {
    const allTags = mockComponents.flatMap((c) => c.tags);
    return Array.from(new Set(allTags)).sort();
  }

  /**
   * Get all unique owner teams
   */
  async getAllOwnerTeams(): Promise<string[]> {
    const teams = mockComponents.map((c) => c.ownerTeam);
    return Array.from(new Set(teams)).sort();
  }

  /**
   * Create component (mock - just log for prototype)
   */
  async createComponent(input: ComponentInput): Promise<Component> {
    logger.warn('Create component called in mock mode - no persistence');

    // Create a mock component for the response
    const newComponent: MockComponent = {
      id: String(mockComponents.length + 1),
      slug: input.slug,
      title: input.title,
      description: input.description,
      tags: input.tags || [],
      status: (input.status as any) || 'STABLE',
      ownerEmail: input.ownerEmail || 'unknown@example.com',
      ownerTeam: input.ownerTeam || 'Unknown',
      repoLink: input.repoLink,
      azureWikiPath: input.azureWikiPath,
      azureWikiUrl: input.azureWikiUrl,
      figmaLinks: input.figmaLinks || [],
      aemComponentPath: input.aemMetadata?.componentPath,
      aemDialogSchema: input.aemMetadata?.dialogSchema,
      aemAllowedChildren: input.aemMetadata?.allowedChildren,
      aemTemplateConstraints: input.aemMetadata?.templateConstraints,
      aemLimitations: input.aemMetadata?.limitations,
      thumbnailUrl: input.visualAssets?.thumbnailUrl,
      screenshotAuthorUrl: input.visualAssets?.screenshotAuthorUrl,
      screenshotPublishedUrl: input.visualAssets?.screenshotPublishedUrl,
      lastSyncedAt: new Date(),
      lastUpdatedBy: 'mock-user@example.com',
      lastUpdatedSource: 'MANUAL',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.mapToComponent(newComponent);
  }

  /**
   * Update component (mock - just log for prototype)
   */
  async updateComponent(id: string, input: Partial<ComponentInput>): Promise<Component> {
    logger.warn(`Update component ${id} called in mock mode - no persistence`);

    const existing = mockComponents.find((c) => c.id === id);
    if (!existing) {
      throw new ApiError('Component not found', 'NOT_FOUND', 404);
    }

    // Return the existing component (no actual update in mock mode)
    return this.mapToComponent(existing);
  }

  /**
   * Delete component (mock - just log for prototype)
   */
  async deleteComponent(id: string): Promise<void> {
    logger.warn(`Delete component ${id} called in mock mode - no persistence`);

    const existing = mockComponents.find((c) => c.id === id);
    if (!existing) {
      throw new ApiError('Component not found', 'NOT_FOUND', 404);
    }

    // No actual deletion in mock mode
  }

  /**
   * Search components by text
   */
  async searchComponents(query: string): Promise<Component[]> {
    const queryLower = query.toLowerCase();
    const results = mockComponents.filter(
      (c) =>
        c.title.toLowerCase().includes(queryLower) ||
        c.description.toLowerCase().includes(queryLower) ||
        c.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    );

    return results.map(this.mapToComponent);
  }

  /**
   * Get components by status
   */
  async getComponentsByStatus(status: ComponentStatus): Promise<Component[]> {
    const results = mockComponents.filter((c) => c.status === status);
    return results.map(this.mapToComponent);
  }

  /**
   * Get components by owner team
   */
  async getComponentsByOwnerTeam(team: string): Promise<Component[]> {
    const results = mockComponents.filter((c) => c.ownerTeam === team);
    return results.map(this.mapToComponent);
  }

  /**
   * Map mock component to shared Component type
   */
  private mapToComponent(component: MockComponent): Component {
    return {
      id: component.id,
      slug: component.slug,
      title: component.title,
      description: component.description,
      tags: component.tags,
      status: component.status as any,
      ownerEmail: component.ownerEmail,
      ownerTeam: component.ownerTeam,
      repoLink: component.repoLink || null,
      azureWikiPath: component.azureWikiPath || null,
      azureWikiUrl: component.azureWikiUrl || null,
      figmaLinks: component.figmaLinks,
      aemMetadata: {
        componentPath: component.aemComponentPath || null,
        dialogSchema: component.aemDialogSchema || null,
        allowedChildren: component.aemAllowedChildren || [],
        templateConstraints: component.aemTemplateConstraints || null,
        limitations: component.aemLimitations || [],
      },
      visualAssets: {
        thumbnailUrl: component.thumbnailUrl || null,
        screenshotAuthorUrl: component.screenshotAuthorUrl || null,
        screenshotPublishedUrl: component.screenshotPublishedUrl || null,
      },
      lastSyncedAt: component.lastSyncedAt,
      lastUpdatedBy: component.lastUpdatedBy,
      lastUpdatedSource: component.lastUpdatedSource as any,
      createdAt: component.createdAt,
      updatedAt: component.updatedAt,
    };
  }
}

export default new ComponentServiceMock();

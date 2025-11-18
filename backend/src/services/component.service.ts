import { Prisma } from '@prisma/client';
import {
  Component,
  ComponentInput,
  ComponentFilters,
  PaginatedResponse,
  ComponentStatus,
  ApiError,
} from '@aem-portal/shared';
import prisma from '../db/prisma';
import logger from '../utils/logger';

class ComponentService {
  /**
   * Get all components with pagination and filters
   */
  async getComponents(
    filters: ComponentFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Component>> {
    const where: Prisma.ComponentWhereInput = {};

    // Apply search filter
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      where.status = { in: filters.status as any };
    }

    // Apply tags filter (tags is a String[] field - match if any tag matches)
    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      };
    }

    // Apply owner team filter
    if (filters.ownerTeam) {
      where.ownerTeam = filters.ownerTeam;
    }

    // Get total count
    const total = await prisma.component.count({ where });

    // Get paginated results
    const components = await prisma.component.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
    });

    return {
      data: components.map(this.mapToComponent),
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
    const component = await prisma.component.findUnique({
      where: { id },
    });

    return component ? this.mapToComponent(component) : null;
  }

  /**
   * Get component by slug
   */
  async getComponentBySlug(slug: string): Promise<Component | null> {
    const component = await prisma.component.findUnique({
      where: { slug },
    });

    return component ? this.mapToComponent(component) : null;
  }

  /**
   * Create a new component
   */
  async createComponent(input: ComponentInput): Promise<Component> {
    // Check if slug already exists
    const existing = await prisma.component.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new ApiError('Component with this slug already exists', 400, 'DUPLICATE_SLUG');
    }

    const component = await prisma.component.create({
      data: {
        slug: input.slug,
        title: input.title,
        description: input.description,
        tags: input.tags || [],
        status: input.status || ComponentStatus.STABLE,
        ownerEmail: input.ownerEmail,
        ownerTeam: input.ownerTeam,
        repoLink: input.repoLink,
        azureWikiPath: input.azureWikiPath,
        azureWikiUrl: input.azureWikiUrl,
        figmaLinks: input.figmaLinks || [],
        aemComponentPath: input.aemMetadata?.componentPath,
        aemDialogSchema: input.aemMetadata?.dialogSchema as any,
        aemAllowedChildren: input.aemMetadata?.allowedChildren || [],
        aemTemplateConstraints: input.aemMetadata?.templateConstraints as any,
        aemLimitations: input.aemMetadata?.limitations || [],
        thumbnailUrl: input.visualAssets?.thumbnailUrl,
        screenshotAuthorUrl: input.visualAssets?.screenshotAuthorUrl,
        screenshotPublishedUrl: input.visualAssets?.screenshotPublishedUrl,
      },
    });

    logger.info(`Component created: ${component.slug}`);
    return this.mapToComponent(component);
  }

  /**
   * Update a component
   */
  async updateComponent(id: string, input: Partial<ComponentInput>): Promise<Component> {
    try {
      const component = await prisma.component.update({
        where: { id },
        data: {
          title: input.title,
          description: input.description,
          tags: input.tags,
          status: input.status,
          ownerEmail: input.ownerEmail,
          ownerTeam: input.ownerTeam,
          repoLink: input.repoLink,
          azureWikiPath: input.azureWikiPath,
          azureWikiUrl: input.azureWikiUrl,
          figmaLinks: input.figmaLinks,
          aemComponentPath: input.aemMetadata?.componentPath,
          aemDialogSchema: input.aemMetadata?.dialogSchema as any,
          aemAllowedChildren: input.aemMetadata?.allowedChildren,
          aemTemplateConstraints: input.aemMetadata?.templateConstraints as any,
          aemLimitations: input.aemMetadata?.limitations,
          thumbnailUrl: input.visualAssets?.thumbnailUrl,
          screenshotAuthorUrl: input.visualAssets?.screenshotAuthorUrl,
          screenshotPublishedUrl: input.visualAssets?.screenshotPublishedUrl,
        },
      });

      logger.info(`Component updated: ${component.slug}`);
      return this.mapToComponent(component);
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Prisma RecordNotFound error
        throw new ApiError('Component not found', 404, 'NOT_FOUND');
      }
      throw error;
    }
  }

  /**
   * Delete a component
   */
  async deleteComponent(id: string): Promise<void> {
    try {
      await prisma.component.delete({
        where: { id },
      });

      logger.info(`Component deleted: ${id}`);
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Prisma RecordNotFound error
        throw new ApiError('Component not found', 404, 'NOT_FOUND');
      }
      throw error;
    }
  }

  /**
   * Get all unique tags
   */
  async getAllTags(): Promise<string[]> {
    const components = await prisma.component.findMany({
      select: { tags: true },
    });

    const tagSet = new Set<string>();
    components.forEach((c) => {
      const tags = c.tags as string[];
      tags.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }

  /**
   * Get all unique owner teams
   */
  async getAllOwnerTeams(): Promise<string[]> {
    const teams = await prisma.component.findMany({
      where: { ownerTeam: { not: null } },
      select: { ownerTeam: true },
      distinct: ['ownerTeam'],
    });

    return teams
      .map((t) => t.ownerTeam)
      .filter((t): t is string => t !== null)
      .sort();
  }

  /**
   * Map Prisma model to shared type
   */
  private mapToComponent(component: any): Component {
    return {
      id: component.id,
      slug: component.slug,
      title: component.title,
      description: component.description,
      tags: component.tags as string[],
      status: component.status as ComponentStatus,
      ownerEmail: component.ownerEmail,
      ownerTeam: component.ownerTeam,
      repoLink: component.repoLink,
      azureWikiPath: component.azureWikiPath,
      azureWikiUrl: component.azureWikiUrl,
      figmaLinks: component.figmaLinks as string[],
      aemMetadata: {
        componentPath: component.aemComponentPath,
        dialogSchema: component.aemDialogSchema,
        allowedChildren: component.aemAllowedChildren,
        templateConstraints: component.aemTemplateConstraints,
        limitations: component.aemLimitations,
      },
      visualAssets: {
        thumbnailUrl: component.thumbnailUrl,
        screenshotAuthorUrl: component.screenshotAuthorUrl,
        screenshotPublishedUrl: component.screenshotPublishedUrl,
      },
      lastUpdate: {
        source: component.lastUpdatedSource,
        date: component.lastSyncedAt || component.updatedAt,
        author: component.lastUpdatedBy || 'system',
      },
      createdAt: component.createdAt,
      updatedAt: component.updatedAt,
    };
  }
}

export default new ComponentService();

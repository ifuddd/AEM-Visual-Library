import {
  ContributionRequest,
  ContributionRequestInput,
  ContributionRequestReview,
  ContributionRequestStatus,
  PaginatedResponse,
  ApiError,
} from '@aem-portal/shared';
import prisma from '../db/prisma';
import azureDevOpsService from './azureDevOps.service';
import logger from '../utils/logger';

class ContributionService {
  /**
   * Get all contribution requests with pagination
   */
  async getContributions(
    page: number = 1,
    pageSize: number = 20,
    status?: ContributionRequestStatus
  ): Promise<PaginatedResponse<ContributionRequest>> {
    const where = status ? { status } : {};

    const total = await prisma.contributionRequest.count({ where });

    const contributions = await prisma.contributionRequest.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: contributions.map(this.mapToContribution),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Get contribution request by ID
   */
  async getContributionById(id: string): Promise<ContributionRequest | null> {
    const contribution = await prisma.contributionRequest.findUnique({
      where: { id },
    });

    return contribution ? this.mapToContribution(contribution) : null;
  }

  /**
   * Create a new contribution request
   */
  async createContribution(
    input: ContributionRequestInput,
    userEmail: string,
    userName: string
  ): Promise<ContributionRequest> {
    // Validate component exists if provided
    if (input.componentId) {
      const component = await prisma.component.findUnique({
        where: { id: input.componentId },
      });

      if (!component) {
        throw new ApiError('Component not found', 404, 'COMPONENT_NOT_FOUND');
      }
    }

    // Create contribution request
    const contribution = await prisma.contributionRequest.create({
      data: {
        createdByEmail: userEmail,
        createdByName: userName,
        requestType: input.requestType,
        componentId: input.componentId,
        payload: input.payload as any,
        status: ContributionRequestStatus.PENDING,
      },
    });

    logger.info(`Contribution request created: ${contribution.id} by ${userEmail}`);

    // Create Azure DevOps work item asynchronously
    this.createWorkItemAsync(contribution).catch((error) => {
      logger.error('Failed to create work item for contribution', {
        contributionId: contribution.id,
        error: error.message,
      });
    });

    return this.mapToContribution(contribution);
  }

  /**
   * Review a contribution request
   */
  async reviewContribution(
    id: string,
    review: ContributionRequestReview,
    reviewerEmail: string
  ): Promise<ContributionRequest> {
    const contribution = await prisma.contributionRequest.update({
      where: { id },
      data: {
        status: review.status,
        reviewerEmail,
        reviewerNotes: review.reviewerNotes,
      },
    });

    logger.info(`Contribution request reviewed: ${id} - ${review.status} by ${reviewerEmail}`);

    return this.mapToContribution(contribution);
  }

  /**
   * Delete a contribution request
   */
  async deleteContribution(id: string): Promise<void> {
    await prisma.contributionRequest.delete({
      where: { id },
    });

    logger.info(`Contribution request deleted: ${id}`);
  }

  /**
   * Create Azure DevOps work item for a contribution
   */
  private async createWorkItemAsync(contribution: any): Promise<void> {
    try {
      const title = `[Portal] ${contribution.requestType}: ${contribution.payload.title || 'New Request'}`;
      const description = this.buildWorkItemDescription(contribution);

      const workItem = await azureDevOpsService.createWorkItem(
        'Task',
        title,
        description,
        {
          'System.Tags': 'aem-portal;contribution',
        }
      );

      // Update contribution with work item ID
      await prisma.contributionRequest.update({
        where: { id: contribution.id },
        data: { devopsWorkItemId: workItem.id.toString() },
      });

      logger.info(`Work item created for contribution: ${contribution.id} -> ${workItem.id}`);
    } catch (error) {
      logger.error('Failed to create work item', {
        contributionId: contribution.id,
        error,
      });
    }
  }

  /**
   * Build work item description from contribution
   */
  private buildWorkItemDescription(contribution: any): string {
    let description = `### Contribution Request\n\n`;
    description += `**Type**: ${contribution.requestType}\n`;
    description += `**Submitted by**: ${contribution.createdByName} (${contribution.createdByEmail})\n`;
    description += `**Date**: ${contribution.createdAt.toISOString()}\n\n`;

    if (contribution.componentId) {
      description += `**Component ID**: ${contribution.componentId}\n\n`;
    }

    description += `### Details\n\n`;
    description += `\`\`\`json\n${JSON.stringify(contribution.payload, null, 2)}\n\`\`\`\n`;

    return description;
  }

  /**
   * Map Prisma model to shared type
   */
  private mapToContribution(contribution: any): ContributionRequest {
    return {
      id: contribution.id,
      createdByEmail: contribution.createdByEmail,
      createdByName: contribution.createdByName,
      requestType: contribution.requestType,
      componentId: contribution.componentId,
      payload: contribution.payload,
      status: contribution.status,
      reviewerEmail: contribution.reviewerEmail,
      reviewerNotes: contribution.reviewerNotes,
      devopsWorkItemId: contribution.devopsWorkItemId,
      createdAt: contribution.createdAt,
      updatedAt: contribution.updatedAt,
    };
  }
}

export default new ContributionService();

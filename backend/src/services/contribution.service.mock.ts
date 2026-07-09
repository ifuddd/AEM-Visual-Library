import {
  ContributionRequest,
  ContributionRequestInput,
  ContributionRequestReview,
  ContributionRequestStatus,
  PaginatedResponse,
  ApiError,
} from '@aem-portal/shared';
import logger from '../utils/logger';

// Mock in-memory contributions storage
const mockContributions: ContributionRequest[] = [];

class ContributionServiceMock {
  /**
   * Get all contribution requests with pagination
   */
  async getContributions(
    page: number = 1,
    pageSize: number = 20,
    status?: ContributionRequestStatus
  ): Promise<PaginatedResponse<ContributionRequest>> {
    let filtered = [...mockContributions];

    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paginatedData = filtered.slice(start, start + pageSize);

    return {
      data: paginatedData,
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
    return mockContributions.find(c => c.id === id) || null;
  }

  /**
   * Create a new contribution request
   */
  async createContribution(
    input: ContributionRequestInput,
    userEmail: string,
    userName: string
  ): Promise<ContributionRequest> {
    const contribution: ContributionRequest = {
      id: `contrib-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdByEmail: userEmail,
      createdByName: userName,
      requestType: input.requestType,
      componentId: input.componentId,
      payload: input.payload,
      status: ContributionRequestStatus.PENDING,
      reviewerEmail: null,
      reviewerNotes: null,
      devopsWorkItemId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockContributions.push(contribution);

    logger.info(`[MOCK] Contribution request created: ${contribution.id} by ${userEmail}`);
    logger.warn('⚠️  Prototype mode: Contribution data will not persist');

    return contribution;
  }

  /**
   * Review a contribution request
   */
  async reviewContribution(
    id: string,
    review: ContributionRequestReview,
    reviewerEmail: string
  ): Promise<ContributionRequest> {
    const contribution = mockContributions.find(c => c.id === id);

    if (!contribution) {
      throw new ApiError('Contribution request not found', 404, 'NOT_FOUND');
    }

    contribution.status = review.status;
    contribution.reviewerEmail = reviewerEmail;
    contribution.reviewerNotes = review.reviewerNotes || null;
    contribution.updatedAt = new Date();

    logger.info(`[MOCK] Contribution request reviewed: ${id} - ${review.status} by ${reviewerEmail}`);

    return contribution;
  }

  /**
   * Delete a contribution request
   */
  async deleteContribution(id: string): Promise<void> {
    const index = mockContributions.findIndex(c => c.id === id);

    if (index === -1) {
      throw new ApiError('Contribution request not found', 404, 'NOT_FOUND');
    }

    mockContributions.splice(index, 1);

    logger.info(`[MOCK] Contribution request deleted: ${id}`);
  }
}

export default new ContributionServiceMock();

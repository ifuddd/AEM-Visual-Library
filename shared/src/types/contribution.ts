/**
 * Contribution request types
 */
export enum ContributionRequestType {
  NEW_COMPONENT = 'new_component',
  UPDATE_SCREENSHOT = 'update_screenshot',
  FIX_METADATA = 'fix_metadata',
  OTHER = 'other',
}

/**
 * Contribution request status
 */
export enum ContributionRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

/**
 * Contribution request entity
 */
export interface ContributionRequest {
  id: string;
  createdByEmail: string;
  createdByName: string;
  requestType: ContributionRequestType;
  componentId?: string;
  payload: Record<string, any>;
  status: ContributionRequestStatus;
  reviewerEmail?: string;
  reviewerNotes?: string;
  devopsWorkItemId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contribution request creation input
 */
export interface ContributionRequestInput {
  requestType: ContributionRequestType;
  componentId?: string;
  payload: Record<string, any>;
}

/**
 * Contribution request review input
 */
export interface ContributionRequestReview {
  status: ContributionRequestStatus.APPROVED | ContributionRequestStatus.REJECTED;
  reviewerNotes?: string;
}

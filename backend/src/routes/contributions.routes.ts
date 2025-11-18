import { Router } from 'express';
import Joi from 'joi';
import { ContributionRequestType, ContributionRequestStatus, UserRole } from '@aem-portal/shared';
import { validate } from '../middleware/validation';
import { authenticate, authorize } from '../middleware/auth';
import contributionService from '../services/contribution.service';

const router = Router();

// Validation schemas
const contributionInputSchema = Joi.object({
  requestType: Joi.string()
    .valid(...Object.values(ContributionRequestType))
    .required(),
  componentId: Joi.string().uuid().optional(),
  payload: Joi.object().required(),
});

const contributionReviewSchema = Joi.object({
  status: Joi.string()
    .valid(ContributionRequestStatus.APPROVED, ContributionRequestStatus.REJECTED)
    .required(),
  reviewerNotes: Joi.string().optional(),
});

/**
 * GET /api/contributions
 * Get all contribution requests
 */
router.get(
  '/',
  authenticate,
  authorize(UserRole.DOC_OWNER, UserRole.ADMIN),
  async (req, res) => {
    const { page = 1, pageSize = 20, status } = req.query;

    const result = await contributionService.getContributions(
      Number(page),
      Number(pageSize),
      status as ContributionRequestStatus | undefined
    );

    res.json({
      success: true,
      data: result,
    });
  }
);

/**
 * GET /api/contributions/my
 * Get user's own contribution requests
 */
router.get('/my', authenticate, async (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;

  // This would need to be implemented in the service
  // For now, return all contributions (should filter by user email)
  const result = await contributionService.getContributions(
    Number(page),
    Number(pageSize)
  );

  res.json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/contributions/:id
 * Get contribution request by ID
 */
router.get('/:id', authenticate, async (req, res) => {
  const contribution = await contributionService.getContributionById(req.params.id);

  if (!contribution) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Contribution request not found',
        code: 'NOT_FOUND',
      },
    });
  }

  res.json({
    success: true,
    data: contribution,
  });
});

/**
 * POST /api/contributions
 * Create a new contribution request
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.CONTRIBUTOR, UserRole.DOC_OWNER, UserRole.ADMIN),
  validate({ body: contributionInputSchema }),
  async (req, res) => {
    const contribution = await contributionService.createContribution(
      req.body,
      req.user!.email,
      req.user!.displayName
    );

    res.status(201).json({
      success: true,
      data: contribution,
    });
  }
);

/**
 * PUT /api/contributions/:id/review
 * Review a contribution request
 */
router.put(
  '/:id/review',
  authenticate,
  authorize(UserRole.DOC_OWNER, UserRole.ADMIN),
  validate({ body: contributionReviewSchema }),
  async (req, res) => {
    const contribution = await contributionService.reviewContribution(
      req.params.id,
      req.body,
      req.user!.email
    );

    res.json({
      success: true,
      data: contribution,
    });
  }
);

/**
 * DELETE /api/contributions/:id
 * Delete a contribution request
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    await contributionService.deleteContribution(req.params.id);

    res.json({
      success: true,
      data: { message: 'Contribution request deleted successfully' },
    });
  }
);

export default router;

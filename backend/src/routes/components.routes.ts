import { Router } from 'express';
import Joi from 'joi';
import { ComponentStatus, UserRole } from '@aem-portal/shared';
import { validate } from '../middleware/validation';
import { authenticate, authorize } from '../middleware/auth';
import componentService from '../services/component.service';

const router = Router();

// Validation schemas
const componentFiltersSchema = Joi.object({
  search: Joi.string().optional(),
  tags: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
  status: Joi.alternatives().try(
    Joi.string().valid(...Object.values(ComponentStatus)),
    Joi.array().items(Joi.string().valid(...Object.values(ComponentStatus)))
  ).optional(),
  ownerTeam: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
});

const componentInputSchema = Joi.object({
  slug: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid(...Object.values(ComponentStatus)).optional(),
  ownerEmail: Joi.string().email().optional(),
  ownerTeam: Joi.string().optional(),
  repoLink: Joi.string().uri().optional(),
  azureWikiPath: Joi.string().optional(),
  azureWikiUrl: Joi.string().uri().optional(),
  figmaLinks: Joi.array().items(Joi.string().uri()).optional(),
  aemMetadata: Joi.object({
    componentPath: Joi.string().optional(),
    dialogSchema: Joi.object().optional(),
    allowedChildren: Joi.array().items(Joi.string()).optional(),
    templateConstraints: Joi.object().optional(),
    limitations: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  visualAssets: Joi.object({
    thumbnailUrl: Joi.string().uri().optional(),
    screenshotAuthorUrl: Joi.string().uri().optional(),
    screenshotPublishedUrl: Joi.string().uri().optional(),
  }).optional(),
});

/**
 * GET /api/components
 * Get all components with filters and pagination
 */
router.get(
  '/',
  authenticate,
  validate({ query: componentFiltersSchema }),
  async (req, res) => {
    const { search, tags, status, ownerTeam, page, pageSize } = req.query;

    // Convert single values to arrays
    const tagArray = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;
    const statusArray = status ? (Array.isArray(status) ? status : [status]) : undefined;

    const result = await componentService.getComponents(
      {
        search: search as string,
        tags: tagArray as string[],
        status: statusArray as any,
        ownerTeam: ownerTeam as string,
      },
      Number(page) || 1,
      Number(pageSize) || 20
    );

    res.json({
      success: true,
      data: result,
    });
  }
);

/**
 * GET /api/components/tags
 * Get all unique tags
 */
router.get('/tags', authenticate, async (req, res) => {
  const tags = await componentService.getAllTags();
  res.json({
    success: true,
    data: tags,
  });
});

/**
 * GET /api/components/teams
 * Get all unique owner teams
 */
router.get('/teams', authenticate, async (req, res) => {
  const teams = await componentService.getAllOwnerTeams();
  res.json({
    success: true,
    data: teams,
  });
});

/**
 * GET /api/components/:id
 * Get component by ID
 */
router.get('/:id', authenticate, async (req, res) => {
  const component = await componentService.getComponentById(req.params.id);

  if (!component) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Component not found',
        code: 'NOT_FOUND',
      },
    });
  }

  res.json({
    success: true,
    data: component,
  });
});

/**
 * GET /api/components/slug/:slug
 * Get component by slug
 */
router.get('/slug/:slug', authenticate, async (req, res) => {
  const component = await componentService.getComponentBySlug(req.params.slug);

  if (!component) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Component not found',
        code: 'NOT_FOUND',
      },
    });
  }

  res.json({
    success: true,
    data: component,
  });
});

/**
 * POST /api/components
 * Create a new component
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.DOC_OWNER, UserRole.ADMIN),
  validate({ body: componentInputSchema }),
  async (req, res) => {
    const component = await componentService.createComponent(req.body);

    res.status(201).json({
      success: true,
      data: component,
    });
  }
);

/**
 * PUT /api/components/:id
 * Update a component
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.DOC_OWNER, UserRole.ADMIN),
  validate({ body: componentInputSchema.fork(Object.keys(componentInputSchema.describe().keys), (schema) => schema.optional()) }),
  async (req, res) => {
    const component = await componentService.updateComponent(req.params.id, req.body);

    res.json({
      success: true,
      data: component,
    });
  }
);

/**
 * DELETE /api/components/:id
 * Delete a component
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    await componentService.deleteComponent(req.params.id);

    res.json({
      success: true,
      data: { message: 'Component deleted successfully' },
    });
  }
);

export default router;

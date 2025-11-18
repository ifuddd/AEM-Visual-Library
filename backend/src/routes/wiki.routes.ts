import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import azureDevOpsService from '../services/azureDevOps.service';

const router = Router();

/**
 * GET /api/wiki/content
 * Get wiki page content by path
 */
router.get('/content', authenticate, async (req, res) => {
  const { path } = req.query;

  if (!path || typeof path !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Path parameter is required',
        code: 'MISSING_PATH',
      },
    });
  }

  const content = await azureDevOpsService.getWikiPageContent(path);

  res.json({
    success: true,
    data: { content },
  });
});

export default router;

import { Router } from 'express';
import { UserRole } from '@aem-portal/shared';
import { authenticate, authorize } from '../middleware/auth';
// Using mock data for prototype (no database)

const router = Router();

/**
 * GET /api/admin/sync-logs
 * Get sync logs (MOCK DATA - Prototype mode)
 */
router.get(
  '/sync-logs',
  authenticate,
  authorize(UserRole.DOC_OWNER, UserRole.ADMIN),
  async (req, res) => {
    const { page = 1, pageSize = 20 } = req.query;

    // Return empty sync logs for prototype
    const mockLogs: any[] = [];

    res.json({
      success: true,
      data: {
        data: mockLogs,
        total: 0,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: 0,
      },
    });
  }
);

/**
 * GET /api/admin/stats
 * Get portal statistics (MOCK DATA - Prototype mode)
 */
router.get(
  '/stats',
  authenticate,
  authorize(UserRole.DOC_OWNER, UserRole.ADMIN),
  async (req, res) => {
    // Return mock stats for prototype
    res.json({
      success: true,
      data: {
        totalComponents: 18,
        totalFragments: 0,
        totalPatterns: 0,
        totalUsers: 1,
        pendingContributions: 0,
        recentSyncs: [],
      },
    });
  }
);

/**
 * GET /api/admin/users
 * Get all users (MOCK DATA - Prototype mode)
 */
router.get(
  '/users',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    // Return mock user for prototype
    const mockUsers = [
      {
        azureAdOid: 'dev-local-oid-00000000-0000-0000-0000-000000000000',
        email: 'dev@localhost',
        displayName: 'Development Admin',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    res.json({
      success: true,
      data: mockUsers,
    });
  }
);

/**
 * PUT /api/admin/users/:id/role
 * Update user role (MOCK - Prototype mode)
 */
router.put(
  '/users/:id/role',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid role',
          code: 'INVALID_ROLE',
        },
      });
    }

    // Return mock updated user
    const mockUser = {
      azureAdOid: req.params.id,
      email: 'dev@localhost',
      displayName: 'Development Admin',
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    res.json({
      success: true,
      data: mockUser,
    });
  }
);

export default router;

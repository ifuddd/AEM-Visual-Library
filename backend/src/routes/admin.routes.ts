import { Router } from 'express';
import { UserRole } from '@aem-portal/shared';
import { authenticate, authorize } from '../middleware/auth';
import prisma from '../db/prisma';

const router = Router();

/**
 * GET /api/admin/sync-logs
 * Get sync logs
 */
router.get(
  '/sync-logs',
  authenticate,
  authorize(UserRole.DOC_OWNER, UserRole.ADMIN),
  async (req, res) => {
    const { page = 1, pageSize = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const [total, logs] = await Promise.all([
      prisma.syncLog.count(),
      prisma.syncLog.findMany({
        skip,
        take,
        orderBy: { syncStartedAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      data: {
        data: logs,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize)),
      },
    });
  }
);

/**
 * GET /api/admin/stats
 * Get portal statistics
 */
router.get(
  '/stats',
  authenticate,
  authorize(UserRole.DOC_OWNER, UserRole.ADMIN),
  async (req, res) => {
    const [
      totalComponents,
      totalFragments,
      totalPatterns,
      totalUsers,
      pendingContributions,
      recentSyncs,
    ] = await Promise.all([
      prisma.component.count(),
      prisma.fragment.count(),
      prisma.pattern.count(),
      prisma.user.count(),
      prisma.contributionRequest.count({
        where: { status: 'PENDING' },
      }),
      prisma.syncLog.findMany({
        take: 5,
        orderBy: { syncStartedAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalComponents,
        totalFragments,
        totalPatterns,
        totalUsers,
        pendingContributions,
        recentSyncs,
      },
    });
  }
);

/**
 * GET /api/admin/users
 * Get all users
 */
router.get(
  '/users',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  }
);

/**
 * PUT /api/admin/users/:id/role
 * Update user role
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

    const user = await prisma.user.update({
      where: { azureAdOid: req.params.id },
      data: { role },
    });

    res.json({
      success: true,
      data: user,
    });
  }
);

export default router;

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { ApiError, UserRole, AzureAdTokenPayload } from '@aem-portal/shared';
import { config } from '../config';
// Removed Prisma import for prototype mode (no database)
// import prisma from '../db/prisma';
import logger from '../utils/logger';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        azureAdOid: string;
        email: string;
        displayName: string;
        role: UserRole;
      };
    }
  }
}

// JWKS client for Azure AD token validation
const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${config.azureAd.tenantId}/discovery/v2.0/keys`,
  cache: true,
  rateLimit: true,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

/**
 * Middleware to verify Azure AD JWT token
 *
 * ⚠️ DEVELOPMENT MODE: When NODE_ENV=development and no Azure AD config,
 * this middleware bypasses authentication and uses a mock admin user.
 *
 * 🚨 IMPORTANT: Configure Azure AD before deploying to production!
 * See DEPLOYMENT_NOTES.md for setup instructions.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // DEVELOPMENT MODE: Bypass Azure AD if not configured
    const isDevelopment = config.nodeEnv === 'development';
    const hasAzureAdConfig = config.azureAd.tenantId && config.azureAd.clientId;

    if (isDevelopment && !hasAzureAdConfig) {
      logger.warn('⚠️  Prototype mode: Using mock authentication (no database)');
      logger.warn('🚨 Configure Azure AD and database before deploying to production!');

      // Use mock development admin user (no database needed for prototype)
      const mockUser = {
        azureAdOid: 'dev-local-oid-00000000-0000-0000-0000-000000000000',
        email: 'dev@localhost',
        displayName: 'Development Admin',
        role: UserRole.ADMIN,
      };

      // Attach mock user to request
      req.user = mockUser;

      return next();
    }

    // PRODUCTION MODE: Require Azure AD authentication
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No token provided', 401, 'NO_TOKEN');
    }

    const token = authHeader.substring(7);

    // Verify JWT
    const decoded = await new Promise<AzureAdTokenPayload>((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          audience: config.azureAd.clientId,
          issuer: `https://login.microsoftonline.com/${config.azureAd.tenantId}/v2.0`,
          algorithms: ['RS256'],
        },
        (err, decoded) => {
          if (err) {
            reject(new ApiError('Invalid token', 401, 'INVALID_TOKEN'));
          } else {
            resolve(decoded as AzureAdTokenPayload);
          }
        }
      );
    });

    // Get or create user in database
    const email = decoded.email || decoded.preferred_username || '';
    const displayName = decoded.name || email;

    // PROTOTYPE MODE: Using mock user (Prisma removed)
    // In production, this would query and create users in database
    const user = {
      azureAdOid: decoded.oid,
      email,
      displayName,
      role: UserRole.VIEWER,
    };

    logger.info(`Mock user authenticated: ${email}`);

    // Attach mock user to request
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user has required role
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Unauthorized', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError('Insufficient permissions', 403, 'FORBIDDEN')
      );
    }

    next();
  };
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { ApiError, UserRole, AzureAdTokenPayload } from '@aem-portal/shared';
import { config } from '../config';
import prisma from '../db/prisma';
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
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ DEV MODE AUTH BYPASS
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.AUTH_BYPASS === 'true'
    ) {
      req.user = {
        azureAdOid: 'dev-user',
        email: 'dev@local',
        displayName: 'Developer',
        role: UserRole.VIEWER,
      };
      return next();
    }

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

    // (rest of your existing code continues...)


    // Get or create user in database
    const email = decoded.email || decoded.preferred_username || '';
    const displayName = decoded.name || email;

    let user = await prisma.user.findUnique({
      where: { azureAdOid: decoded.oid },
    });

    if (!user) {
      // Create new user with default VIEWER role
      user = await prisma.user.create({
        data: {
          azureAdOid: decoded.oid,
          email,
          displayName,
          role: 'VIEWER',
          lastLoginAt: new Date(),
        },
      });
      logger.info(`New user created: ${email}`);
    } else {
      // Update last login
      await prisma.user.update({
        where: { azureAdOid: decoded.oid },
        data: { lastLoginAt: new Date() },
      });
    }

    // Attach user to request
    req.user = {
      azureAdOid: user.azureAdOid,
      email: user.email,
      displayName: user.displayName,
      role: user.role as UserRole,
    };

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

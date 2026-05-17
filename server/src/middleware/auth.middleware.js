import { extractToken, verifyToken } from '../utils/tokenUtils.js';
import { UnauthorizedError } from '../utils/errorHandler.js';
import { logger } from '../config/logger.js';

/**
 * Middleware to verify JWT token and set userId on request
 */
export const authenticateJWT = (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    
    if (!token) {
      throw new UnauthorizedError('Missing authentication token');
    }
    
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user is authenticated (optional)
 */
export const optionalAuth = (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    if (token) {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
    }
    next();
  } catch (error) {
    // Silent fail for optional auth
    next();
  }
};

export default {
  authenticateJWT,
  optionalAuth,
};

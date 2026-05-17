import { logger } from '../config/logger.js';
import { HTTP_CODES } from '../config/constants.js';

/**
 * Global error handling middleware
 * Must be the last middleware in the app
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal server error';
  
  logger.error(`${req.method} ${req.path}`, {
    error: err.name,
    message,
    statusCode,
  });
  
  return res.status(statusCode).json({
    success: false,
    error: {
      name: err.name,
      message,
      statusCode,
    },
  });
};

/**
 * Middleware for 404 Not Found
 */
export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    error: {
      name: 'NotFound',
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: 404,
    },
  });
};

export default {
  errorHandler,
  notFoundHandler,
};

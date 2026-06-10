import morgan from 'morgan';
import { logger } from '../config/logger.js';

/**
 * Morgan middleware configuration
 */
const morganMiddleware = morgan(
  ':method :url :status :response-time ms',
  {
    skip: (req) => req.path === '/health',
  }
);

export default morganMiddleware;

import morgan from 'morgan';
import { logger } from '../config/logger.js';

/**
 * Custom morgan token to log response time
 */
morgan.token('response-time-ms', (req, res) => {
  if (!req._startAt) return '';
  const ms = (Date.now() - req._startAt.getTime()).toFixed(0);
  return `${ms}ms`;
});

/**
 * Morgan middleware configuration
 */
const morganMiddleware = morgan(
  ':method :url :status :response-time-ms',
  {
    skip: (req) => req.path === '/health',
  }
);

export default morganMiddleware;

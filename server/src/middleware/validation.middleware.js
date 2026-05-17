import Joi from 'joi';
import { ValidationError } from '../utils/errorHandler.js';
import { logger } from '../config/logger.js';

/**
 * Middleware factory to validate request body/params/query
 * @param {Object} schema - Joi schema
 * @returns {Function} Middleware function
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      return next(new ValidationError(messages));
    }
    
    req.validated = value;
    next();
  };
};

/**
 * Middleware to validate path parameters
 * @param {Object} schema - Joi schema
 * @returns {Function} Middleware function
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params);
    
    if (error) {
      return next(new ValidationError(error.message));
    }
    
    req.params = value;
    next();
  };
};

export default {
  validateRequest,
  validateParams,
};

import Joi from 'joi';
import { VALID_STATUSES } from '../config/constants.js';

export const createApplicationSchema = Joi.object({
  company_id: Joi.number().integer().optional(),
  company_name: Joi.string().optional(),
  company_logo: Joi.string().uri().optional(),
  job_title: Joi.string().required().messages({
    'any.required': 'Job title is required',
  }),
  job_url: Joi.string().uri().optional(),
  status: Joi.string()
    .valid(...VALID_STATUSES)
    .default('applied'),
  description: Joi.string().max(1000).optional(),
  applied_date: Joi.date().optional(),
  tags: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())).optional(),
}).or('company_id', 'company_name').messages({
  'object.missing': 'Either company_id or company_name is required',
});

export const updateApplicationSchema = Joi.object({
  company_id: Joi.number().integer().optional(),
  company_name: Joi.string().optional(),
  company_logo: Joi.string().uri().optional(),
  job_title: Joi.string().optional(),
  job_url: Joi.string().uri().optional(),
  status: Joi.string()
    .valid(...VALID_STATUSES)
    .optional(),
  description: Joi.string().max(1000).optional(),
  applied_date: Joi.date().optional(),
  tags: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())).optional(),
});

export default {
  createApplicationSchema,
  updateApplicationSchema,
};

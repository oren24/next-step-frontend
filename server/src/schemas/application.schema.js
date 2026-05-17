import Joi from 'joi';
import { VALID_STATUSES } from '../config/constants.js';

export const createApplicationSchema = Joi.object({
  company_name: Joi.string().required().messages({
    'any.required': 'Company name is required',
  }),
  job_title: Joi.string().required().messages({
    'any.required': 'Job title is required',
  }),
  job_url: Joi.string().uri().optional(),
  status: Joi.string()
    .valid(...VALID_STATUSES)
    .default('applied'),
  description: Joi.string().max(1000).optional(),
  applied_date: Joi.date().optional(),
});

export const updateApplicationSchema = Joi.object({
  company_name: Joi.string().optional(),
  job_title: Joi.string().optional(),
  job_url: Joi.string().uri().optional(),
  status: Joi.string()
    .valid(...VALID_STATUSES)
    .optional(),
  description: Joi.string().max(1000).optional(),
  applied_date: Joi.date().optional(),
});

export default {
  createApplicationSchema,
  updateApplicationSchema,
};

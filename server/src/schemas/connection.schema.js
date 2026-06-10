import Joi from 'joi';

export const createConnectionSchema = Joi.object({
  name: Joi.string().required().max(255),
  role: Joi.string().allow('', null).max(255),
  contact_details: Joi.string().allow('', null).max(255),
  portfolio_url: Joi.string().uri().allow('', null).max(255),
  location_or_company: Joi.string().allow('', null).max(255),
  last_contacted_date: Joi.date().iso().allow('', null),
  notes: Joi.string().allow('', null)
});

export const updateConnectionSchema = Joi.object({
  name: Joi.string().max(255),
  role: Joi.string().allow('', null).max(255),
  contact_details: Joi.string().allow('', null).max(255),
  portfolio_url: Joi.string().uri().allow('', null).max(255),
  location_or_company: Joi.string().allow('', null).max(255),
  last_contacted_date: Joi.date().iso().allow('', null),
  notes: Joi.string().allow('', null)
});

import Joi from 'joi';

export const createResumeSchema = Joi.object({
  title: Joi.string().required().max(255),
  target_role: Joi.string().allow('', null).max(255),
  note: Joi.string().allow('', null)
});

export const updateResumeSchema = Joi.object({
  title: Joi.string().max(255),
  target_role: Joi.string().allow('', null).max(255),
  note: Joi.string().allow('', null)
});

import Joi from 'joi';

export const createResumeSchema = Joi.object({
  title: Joi.string().required().max(255),
  target_role: Joi.string().allow('', null).max(255),
  note: Joi.string().allow('', null),
  file_path: Joi.string().allow('', null).uri({ scheme: ['http', 'https'] }),
  original_filename: Joi.string().allow('', null).max(255)
});

export const updateResumeSchema = Joi.object({
  title: Joi.string().max(255),
  target_role: Joi.string().allow('', null).max(255),
  note: Joi.string().allow('', null),
  file_path: Joi.string().allow('', null).uri({ scheme: ['http', 'https'] }),
  original_filename: Joi.string().allow('', null).max(255)
});

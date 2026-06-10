import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  bio: Joi.string().max(500).optional(),
  profile_picture: Joi.string().uri().optional(),
});

export const changePasswordSchema = Joi.object({
  current_password: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  new_password: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters',
    'any.required': 'New password is required',
  }),
});

export default {
  updateProfileSchema,
  changePasswordSchema,
};

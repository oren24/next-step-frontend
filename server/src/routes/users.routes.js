import express from 'express';
import * as usersController from '../controllers/usersController.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { updateProfileSchema, changePasswordSchema } from '../schemas/user.schema.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

/**
 * GET /api/users/profile
 * Get user profile
 */
router.get('/profile', usersController.getProfile);

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', validateRequest(updateProfileSchema), usersController.updateProfile);

/**
 * POST /api/users/change-password
 * Change user password
 */
router.post('/change-password', validateRequest(changePasswordSchema), usersController.changePassword);

export default router;

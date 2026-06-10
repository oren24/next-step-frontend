import express from 'express';
import * as authController from '../controllers/authController.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', validateRequest(registerSchema), authController.register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validateRequest(loginSchema), authController.login);

/**
 * POST /api/auth/oauth
 * OAuth Login / Register user
 */
router.post('/oauth', authController.oauthLogin);

export default router;

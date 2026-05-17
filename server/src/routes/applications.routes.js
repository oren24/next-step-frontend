import express from 'express';
import * as applicationsController from '../controllers/applicationsController.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { createApplicationSchema, updateApplicationSchema } from '../schemas/application.schema.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

/**
 * GET /api/applications
 * Get all applications for user
 */
router.get('/', applicationsController.getApplications);

/**
 * POST /api/applications
 * Create new application
 */
router.post('/', validateRequest(createApplicationSchema), applicationsController.createApplication);

/**
 * GET /api/applications/:id
 * Get single application
 */
router.get('/:id', applicationsController.getApplication);

/**
 * PUT /api/applications/:id
 * Update application
 */
router.put('/:id', validateRequest(updateApplicationSchema), applicationsController.updateApplication);

/**
 * DELETE /api/applications/:id
 * Delete application
 */
router.delete('/:id', applicationsController.deleteApplication);

export default router;

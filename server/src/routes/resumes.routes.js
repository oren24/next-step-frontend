import express from 'express';
import * as resumesController from '../controllers/resumesController.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { createResumeSchema, updateResumeSchema } from '../schemas/resume.schema.js';


const router = express.Router();

router.use(authenticateJWT);

router.get('/', resumesController.getResumes);
router.post('/', validateRequest(createResumeSchema), resumesController.createResume);
router.get('/:id', resumesController.getResumeById);
router.put('/:id', validateRequest(updateResumeSchema), resumesController.updateResume);
router.delete('/:id', resumesController.deleteResume);

export default router;

import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './users.routes.js';
import resumeRoutes from './resumes.routes.js';
import applicationRoutes from './applications.routes.js';
import connectionRoutes from './connections.routes.js';
import linkedinRoutes from './linkedin.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/resumes', resumeRoutes);
router.use('/applications', applicationRoutes);
router.use('/connections', connectionRoutes);
router.use('/linkedin', linkedinRoutes);

export default router;

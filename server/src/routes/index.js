import express from 'express';
import authRoutes from './auth.routes.js';
import applicationsRoutes from './applications.routes.js';
import usersRoutes from './users.routes.js';

const router = express.Router();

/**
 * Mount all API routes
 */
router.use('/auth', authRoutes);
router.use('/applications', applicationsRoutes);
router.use('/users', usersRoutes);

export default router;

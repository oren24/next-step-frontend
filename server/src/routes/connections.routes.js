import express from 'express';
import * as connectionsController from '../controllers/connectionsController.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { createConnectionSchema, updateConnectionSchema } from '../schemas/connection.schema.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', connectionsController.getConnections);
router.post('/', validateRequest(createConnectionSchema), connectionsController.createConnection);
router.get('/:id', connectionsController.getConnectionById);
router.put('/:id', validateRequest(updateConnectionSchema), connectionsController.updateConnection);
router.delete('/:id', connectionsController.deleteConnection);

export default router;

import express from 'express';
import { getSystemStatus, updateSystemStatus } from '../controllers/systemController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get status is available to all (to check for maintenance)
router.get('/status', getSystemStatus);

// Update status is strictly Creator ONLY
router.put('/status', authenticateToken, authorizeRoles('creator'), updateSystemStatus);

export default router;

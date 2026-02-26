import express from 'express';
import {
    createImportRequest,
    getAllImportRequests,
    updateImportRequestStatus,
    deleteImportRequest
} from '../controllers/logisticsController.js';
import { authenticateToken, checkModuleFreeze } from '../middleware/auth.js';

const router = express.Router();
const freezeCheck = checkModuleFreeze('logistics');

// Public routes
router.post('/', createImportRequest);

// Admin routes (Protected)
router.get('/admin/requests', authenticateToken, getAllImportRequests);
router.put('/admin/requests/:id/status', authenticateToken, freezeCheck, updateImportRequestStatus);
router.delete('/admin/requests/:id', authenticateToken, freezeCheck, deleteImportRequest);

export default router;

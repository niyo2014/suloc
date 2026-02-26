import express from 'express';
import {
    getPublicVisaServices,
    getAllVisaServices,
    createVisaService,
    updateVisaService,
    deleteVisaService,
    submitVisaAssistanceRequest,
    getVisaAssistanceRequests,
    getVisaAssistanceRequestDetail,
    updateVisaAssistanceRequest,
    getVisaAssistanceSettings
} from '../controllers/visaController.js';
import { authenticateToken, checkModuleFreeze } from '../middleware/auth.js';
import visaUpload from '../middleware/visaUploadMiddleware.js';

const router = express.Router();
const freezeCheck = checkModuleFreeze('visa');

// Public routes
router.get('/', getPublicVisaServices);
router.post('/assistance', visaUpload.array('documents', 10), submitVisaAssistanceRequest);

// Admin routes (Protected)
router.get('/admin/all', authenticateToken, getAllVisaServices);
router.post('/admin', authenticateToken, freezeCheck, createVisaService);
router.put('/admin/:id', authenticateToken, freezeCheck, updateVisaService);
router.delete('/admin/:id', authenticateToken, freezeCheck, deleteVisaService);

// Visa Assistance Admin
router.get('/admin/assistance', authenticateToken, getVisaAssistanceRequests);
router.get('/admin/assistance/settings', authenticateToken, getVisaAssistanceSettings);
router.get('/admin/assistance/:id', authenticateToken, getVisaAssistanceRequestDetail);
router.put('/admin/assistance/:id', authenticateToken, freezeCheck, updateVisaAssistanceRequest);

export default router;

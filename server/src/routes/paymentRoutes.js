import express from 'express';
import {
    getOperators, createRequest, trackRequest,
    adminGetRequests, adminUpdateStatus,
    adminCreateOperator, adminUpdateOperator, adminDeleteOperator,
    getPaymentSettings, updatePaymentSettings
} from '../controllers/paymentController.js';
import { authenticateToken, authorizeAdmin, checkModuleFreeze } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const freezeCheck = checkModuleFreeze('payments');

// Configure multer to preserve file extensions
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/payments/');
    },
    filename: function (req, file, cb) {
        // Generate unique filename while preserving extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/operators', getOperators);
router.post('/request', upload.fields([
    { name: 'receiver_photo', maxCount: 1 },
    { name: 'bank_slip', maxCount: 1 }
]), createRequest);
router.get('/track', trackRequest);

// Admin routes (Protected)
router.get('/admin/requests', authenticateToken, authorizeAdmin, adminGetRequests);
router.patch('/admin/requests/:id', authenticateToken, authorizeAdmin, freezeCheck, adminUpdateStatus);

// Operator Management
router.post('/admin/operators', authenticateToken, authorizeAdmin, freezeCheck, adminCreateOperator);
router.put('/admin/operators/:id', authenticateToken, authorizeAdmin, freezeCheck, adminUpdateOperator);
router.delete('/admin/operators/:id', authenticateToken, authorizeAdmin, freezeCheck, adminDeleteOperator);

// Settings Management
router.get('/admin/settings', authenticateToken, authorizeAdmin, getPaymentSettings);
router.post('/admin/settings', authenticateToken, authorizeAdmin, freezeCheck, updatePaymentSettings);

export default router;

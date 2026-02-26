import express from 'express';
import {
    submitContactForm,
    adminGetSubmissions,
    adminUpdateSubmissionStatus,
    adminDeleteSubmission
} from '../controllers/contactController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', submitContactForm);

// Admin routes
router.get('/admin/submissions', authenticateToken, authorizeAdmin, adminGetSubmissions);
router.patch('/admin/submissions/:id', authenticateToken, authorizeAdmin, adminUpdateSubmissionStatus);
router.delete('/admin/submissions/:id', authenticateToken, authorizeAdmin, adminDeleteSubmission);

export default router;

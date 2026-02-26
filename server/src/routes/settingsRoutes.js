import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route to get settings (for footer/contact info)
router.get('/', getSettings);

// Admin route (Protected)
router.post('/admin', authenticateToken, updateSettings);

export default router;

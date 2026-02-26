import express from 'express';
import {
    getAboutSection,
    adminUpdateAboutSection
} from '../controllers/aboutController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for about images if needed
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/about/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'about-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/', getAboutSection);

// Admin routes
router.put('/admin', authenticateToken, authorizeAdmin, upload.single('image'), adminUpdateAboutSection);

export default router;

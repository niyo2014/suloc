import express from 'express';
import {
    getActiveSlides,
    adminGetSlides,
    adminCreateSlide,
    adminUpdateSlide,
    adminDeleteSlide,
    adminReorderSlides
} from '../controllers/heroController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for hero images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/hero/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'hero-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/slides', getActiveSlides);

// Admin routes
router.get('/admin/slides', authenticateToken, authorizeAdmin, adminGetSlides);
router.post('/admin/slides', authenticateToken, authorizeAdmin, upload.single('image'), adminCreateSlide);
router.put('/admin/slides/:id', authenticateToken, authorizeAdmin, upload.single('image'), adminUpdateSlide);
router.delete('/admin/slides/:id', authenticateToken, authorizeAdmin, adminDeleteSlide);
router.patch('/admin/slides/reorder', authenticateToken, authorizeAdmin, adminReorderSlides);

export default router;

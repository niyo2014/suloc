import express from 'express';
import { authenticateToken as authMiddleware, checkModuleFreeze } from '../middleware/auth.js';
import upload from '../middleware/uploadMiddleware.js';
import {
    getVehicles,
    getVehicleById,
    submitVehicleRequest,
    getFilterOptions,
    // Admin controllers
    getAdminVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    uploadGalleryImages,
    deleteGalleryImage
} from '../controllers/vehicleController.js';

const router = express.Router();
const freezeCheck = checkModuleFreeze('vehicles');

// Public routes
router.get('/', getVehicles);
router.get('/filters', getFilterOptions);
router.get('/:id', getVehicleById);
router.post('/request', submitVehicleRequest);

// Admin Routes (Protected)
router.get('/admin/all', authMiddleware, getAdminVehicles);

// Create: Main image + Gallery images
router.post('/admin', authMiddleware, freezeCheck, upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
]), createVehicle);

// Update: Main image override (optional)
router.put('/admin/:id', authMiddleware, freezeCheck, upload.fields([
    { name: 'main_image', maxCount: 1 }
]), updateVehicle);

// Upload additional gallery images
router.post('/admin/:id/images', authMiddleware, freezeCheck, upload.array('gallery_images', 10), uploadGalleryImages);

// Delete gallery image
router.delete('/admin/:id/images/:imageId', authMiddleware, freezeCheck, deleteGalleryImage);

// Delete vehicle
router.delete('/admin/:id', authMiddleware, freezeCheck, deleteVehicle);

export default router;

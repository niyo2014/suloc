import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * Image Optimization Route
 * Usage: /api/images/resize?path=uploads/vehicles/car.jpg&width=800&height=600
 */
router.get('/resize', async (req, res) => {
    const { path: imagePath, width, height, format = 'webp', quality = 80 } = req.query;

    if (!imagePath) {
        return res.status(400).send('Image path is required');
    }

    const absolutePath = path.resolve(__dirname, '../../../', imagePath);

    if (!fs.existsSync(absolutePath)) {
        return res.status(404).send('Image not found');
    }

    try {
        let transform = sharp(absolutePath);

        if (width || height) {
            transform = transform.resize({
                width: width ? parseInt(width) : null,
                height: height ? parseInt(height) : null,
                fit: 'cover'
            });
        }

        if (format === 'webp') {
            transform = transform.webp({ quality: parseInt(quality) });
        } else if (format === 'jpeg' || format === 'jpg') {
            transform = transform.jpeg({ quality: parseInt(quality) });
        }

        const buffer = await transform.toBuffer();
        res.type(`image/${format}`).send(buffer);
    } catch (error) {
        console.error('Image processing error:', error);
        res.status(500).send('Error processing image');
    }
});

export default router;

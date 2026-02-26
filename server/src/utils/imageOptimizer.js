import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Image Optimizer Utility
 * Resizes, compresses, and converts images to WebP format
 */
export const optimizeImage = async (inputPath, outputDir, baseFileName) => {
    try {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fileName = `${baseFileName}_${Date.now()}`;
        const webpPath = path.join(outputDir, `${fileName}.webp`);
        const thumbPath = path.join(outputDir, `${fileName}_thumb.webp`);

        // Create main optimized image (max 1200px width)
        await sharp(inputPath)
            .resize(1200, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .webp({ quality: 80 })
            .toFile(webpPath);

        // Create thumbnail (max 400px width)
        await sharp(inputPath)
            .resize(400, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .webp({ quality: 70 })
            .toFile(thumbPath);

        return {
            success: true,
            url: `/uploads/vehicles/${path.basename(webpPath)}`,
            thumbUrl: `/uploads/vehicles/${path.basename(thumbPath)}`,
            fileName: path.basename(webpPath)
        };
    } catch (error) {
        console.error('Image optimization error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

import prisma from '../db.js';
import path from 'path';
import fs from 'fs';
import { optimizeImage } from '../utils/imageOptimizer.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all vehicles (Admin - no filters, all statuses)
 */
export const getAdminVehicles = async (req, res) => {
    try {
        const vehicles = await prisma.vehicles.findMany({
            orderBy: [
                { order_index: 'asc' },
                { id: 'desc' }
            ],
            include: {
                vehicle_images: true
            }
        });

        res.json({ vehicles });
    } catch (error) {
        console.error('Error fetching admin vehicles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get all vehicles with optional filters
 */
export const getVehicles = async (req, res) => {
    try {
        const {
            brand,
            model,
            year_min,
            year_max,
            price_min,
            price_max,
            condition,
            transmission,
            fuel_type,
            status,
            featured
        } = req.query;

        const where = {
            is_active: true
        };

        if (brand) where.brand = { contains: brand };
        if (model) where.model = { contains: model };
        if (year_min || year_max) {
            where.year = {};
            if (year_min) where.year.gte = parseInt(year_min);
            if (year_max) where.year.lte = parseInt(year_max);
        }
        if (price_min || price_max) {
            where.price = {};
            if (price_min) where.price.gte = parseFloat(price_min);
            if (price_max) where.price.lte = parseFloat(price_max);
        }
        if (condition) where.vehicle_condition = condition;
        if (transmission) where.transmission = transmission;
        if (fuel_type) where.fuel_type = fuel_type;
        if (status) where.status = status;
        if (featured === 'true') where.is_featured = true;

        const vehicles = await prisma.vehicles.findMany({
            where,
            orderBy: [
                { is_featured: 'desc' },
                { created_at: 'desc' }
            ]
        });

        res.json({ vehicles });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get single vehicle by ID
 */
export const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await prisma.vehicles.findUnique({
            where: { id: parseInt(id) },
            include: {
                vehicle_images: {
                    orderBy: { order_index: 'asc' }
                }
            }
        });

        if (!vehicle) { // Removed !vehicle.is_active check to allow admin to edit inactive vehicles
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        res.json({ vehicle });
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Submit vehicle inquiry
 */
export const submitVehicleRequest = async (req, res) => {
    try {
        const {
            vehicle_id,
            client_name,
            client_email,
            client_phone,
            client_whatsapp,
            message,
            preferred_contact
        } = req.body;

        // Validation
        if (!vehicle_id || !client_name || !client_phone) {
            return res.status(400).json({
                error: 'Vehicle ID, name, and phone are required'
            });
        }

        const request = await prisma.vehicle_requests.create({
            data: {
                vehicle_id: parseInt(vehicle_id),
                client_name,
                client_email,
                client_phone,
                client_whatsapp,
                message,
                preferred_contact: preferred_contact || 'phone',
                status: 'new'
            }
        });

        res.status(201).json({
            message: 'Request submitted successfully',
            request_id: request.id
        });
    } catch (error) {
        console.error('Error submitting vehicle request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Admin: Create new vehicle
 */
export const createVehicle = async (req, res) => {
    try {
        const body = req.body;
        const files = req.files;

        // Process main image
        let mainImageUrl = body.main_image || '';
        if (files && files.main_image) {
            const mainImage = files.main_image[0];
            const uploadDir = path.join(__dirname, '../../public/uploads/vehicles');
            const result = await optimizeImage(mainImage.path, uploadDir, 'vehicle_main');
            if (result.success) {
                mainImageUrl = result.url;
                // Delete temp file after optimization
                if (fs.existsSync(mainImage.path)) fs.unlinkSync(mainImage.path);
            }
        }

        const vehicle = await prisma.vehicles.create({
            data: {
                slug: body.slug || `${body.brand}-${body.model}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                brand: body.brand,
                model: body.model,
                year: parseInt(body.year),
                transmission: body.transmission || 'automatic',
                fuel_type: body.fuel_type || 'petrol',
                price: parseFloat(body.price),
                currency: body.currency || 'USD',
                vehicle_condition: body.vehicle_condition || 'used',
                status: body.status || 'available',
                description_fr: body.description_fr || '',
                description_en: body.description_en || '',
                main_image: mainImageUrl,
                mileage: parseInt(body.mileage || 0),
                color: body.color || '',
                engine_size: body.engine_size || '',
                doors: parseInt(body.doors || 4),
                seats: parseInt(body.seats || 5),
                is_featured: body.is_featured === 'true' || body.is_featured === true,
                is_active: body.is_active === 'true' || body.is_active === true || body.is_active === undefined,
                order_index: parseInt(body.order_index || 0)
            }
        });

        // Process gallery images if any
        if (files && files.gallery_images) {
            const uploadDir = path.join(__dirname, '../../public/uploads/vehicles');
            for (let i = 0; i < files.gallery_images.length; i++) {
                const file = files.gallery_images[i];
                const result = await optimizeImage(file.path, uploadDir, `vehicle_${vehicle.id}`);
                if (result.success) {
                    await prisma.vehicle_images.create({
                        data: {
                            vehicle_id: vehicle.id,
                            image_url: result.url,
                            alt_text: `${body.brand} ${body.model} gallery image`,
                            order_index: i
                        }
                    });
                    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                }
            }
        }

        res.status(201).json({ vehicle });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Admin: Update vehicle
 */
export const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const files = req.files;

        const vehicleId = parseInt(id);

        // Process main image
        let mainImageUrl = body.main_image;
        if (files && files.main_image) {
            const mainImage = files.main_image[0];
            const uploadDir = path.join(__dirname, '../../public/uploads/vehicles');
            const result = await optimizeImage(mainImage.path, uploadDir, 'vehicle_main');
            if (result.success) {
                mainImageUrl = result.url;
                if (fs.existsSync(mainImage.path)) fs.unlinkSync(mainImage.path);
            }
        }

        const vehicle = await prisma.vehicles.update({
            where: { id: vehicleId },
            data: {
                brand: body.brand,
                model: body.model,
                year: body.year ? parseInt(body.year) : undefined,
                transmission: body.transmission,
                fuel_type: body.fuel_type,
                price: body.price ? parseFloat(body.price) : undefined,
                currency: body.currency,
                vehicle_condition: body.vehicle_condition,
                status: body.status,
                description_fr: body.description_fr,
                description_en: body.description_en,
                main_image: mainImageUrl,
                mileage: body.mileage !== undefined ? parseInt(body.mileage) : undefined,
                color: body.color,
                engine_size: body.engine_size,
                doors: body.doors !== undefined ? parseInt(body.doors) : undefined,
                seats: body.seats !== undefined ? parseInt(body.seats) : undefined,
                is_featured: body.is_featured === 'true' || body.is_featured === true,
                is_active: body.is_active === 'true' || body.is_active === true,
                order_index: body.order_index !== undefined ? parseInt(body.order_index) : undefined
            }
        });

        res.json({ vehicle });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Admin: Delete vehicle
 */
export const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicleId = parseInt(id);

        const galleryImages = await prisma.vehicle_images.findMany({
            where: { vehicle_id: vehicleId }
        });

        // Delete files
        for (const img of galleryImages) {
            const filePath = path.join(__dirname, '../../public', img.image_url);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await prisma.vehicle_images.deleteMany({
            where: { vehicle_id: vehicleId }
        });

        await prisma.vehicles.delete({
            where: { id: vehicleId }
        });

        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Admin: Upload gallery images
 */
export const uploadGalleryImages = async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files;
        const vehicleId = parseInt(id);

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        const vehicle = await prisma.vehicles.findUnique({
            where: { id: vehicleId },
            select: { brand: true, model: true }
        });

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        // Get max order index
        const maxOrder = await prisma.vehicle_images.aggregate({
            where: { vehicle_id: vehicleId },
            _max: { order_index: true }
        });

        let nextOrder = (maxOrder._max.order_index || 0) + 1;
        const uploadedImages = [];
        const uploadDir = path.join(__dirname, '../../public/uploads/vehicles');

        for (const file of files) {
            const result = await optimizeImage(file.path, uploadDir, `vehicle_${vehicleId}`);
            if (result.success) {
                const img = await prisma.vehicle_images.create({
                    data: {
                        vehicle_id: vehicleId,
                        image_url: result.url,
                        alt_text: `${vehicle.brand} ${vehicle.model} gallery image`,
                        order_index: nextOrder++
                    }
                });
                uploadedImages.push(img);
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            }
        }

        res.status(201).json({ images: uploadedImages });
    } catch (error) {
        console.error('Error uploading gallery images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Admin: Delete gallery image
 */
export const deleteGalleryImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const id = parseInt(imageId);

        const img = await prisma.vehicle_images.findUnique({
            where: { id }
        });

        if (!img) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const filePath = path.join(__dirname, '../../public', img.image_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await prisma.vehicle_images.delete({
            where: { id }
        });

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get vehicle filter options
 */
export const getFilterOptions = async (req, res) => {
    try {
        const brands = await prisma.vehicles.findMany({
            where: { is_active: true },
            select: { brand: true },
            distinct: ['brand']
        });

        const years = await prisma.vehicles.findMany({
            where: { is_active: true },
            select: { year: true },
            distinct: ['year'],
            orderBy: { year: 'desc' }
        });

        res.json({
            brands: brands.map(v => v.brand),
            years: years.map(v => v.year),
            conditions: ['new', 'used', 'certified'],
            transmissions: ['automatic', 'manual'],
            fuel_types: ['petrol', 'diesel', 'hybrid', 'electric']
        });
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

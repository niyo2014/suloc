import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import prisma from './db.js';
import authRoutes from './routes/authRoutes.js';
import logicRoutes from './routes/logicRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import visaRoutes from './routes/visaRoutes.js';
import logisticsRoutes from './routes/logisticsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import { maintenanceCheck } from './middleware/maintenanceMiddleware.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin: true, // Allow all origins for debugging
    credentials: true,
    exposedHeaders: ['Cross-Origin-Resource-Policy']
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/img', express.static(path.join(__dirname, '../../img')));

// Global Maintenance Check
app.use(maintenanceCheck);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/logic', logicRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/visas', visaRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/system', systemRoutes);

// Basic Root Route for cPanel check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'SULOC API is running.',
        timestamp: new Date()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/logic', logicRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/visas', visaRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/system', systemRoutes);

// Detailed Content Route
app.get('/api/content/home', async (req, res) => {
    try {
        const [importServices, visaServices, featuredVehicles, siteContent] = await Promise.all([
            prisma.import_services.findMany({ where: { is_active: true }, orderBy: { order_index: 'asc' } }),
            prisma.visa_services.findMany({ where: { is_active: true }, orderBy: { order_index: 'asc' } }),
            prisma.vehicles.findMany({
                where: { is_active: true, is_featured: true },
                take: 3,
                include: { vehicle_images: { take: 1 } }
            }),
            prisma.site_content.findMany()
        ]);

        const contentMap = siteContent.reduce((acc, item) => {
            acc[item.content_key] = item.content_value;
            return acc;
        }, {});

        res.json({
            importServices,
            visaServices,
            featuredVehicles,
            content: contentMap
        });
    } catch (error) {
        console.error('Error fetching home content:', error);
        res.status(500).json({ error: 'Database connection error or missing data' });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Export for Vercel
export default app;

// Start Server locally
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    }).on('error', (err) => {
        console.error('Server failed to start:', err);
    });
}

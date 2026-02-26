import jwt from 'jsonwebtoken';
import prisma from '../db.js';

/**
 * Global Maintenance Mode Middleware
 * Blocks all requests if maintenance_mode is enabled, except for:
 * - Login/Logout routes
 * - System status (to allow checking state)
 * - Health check
 * - Requests from the 'creator' role (bypasses check)
 */
export const maintenanceCheck = async (req, res, next) => {
    // 1. Define paths that are ALWAYS allowed
    const allowedPaths = [
        '/api/auth/login',
        '/api/auth/logout',
        '/api/system/status',
        '/api/health'
    ];

    // Check if current path is allowed
    const isAllowedPath = allowedPaths.some(path => req.originalUrl.startsWith(path));
    if (isAllowedPath) {
        return next();
    }

    try {
        // 2. Fetch system status from database
        const systemStatus = await prisma.system_status.findUnique({
            where: { id: 1 }
        });

        // If maintenance mode is OFF, proceed
        if (!systemStatus || !systemStatus.maintenance_mode) {
            return next();
        }

        // 3. Maintenance mode is ON. Check for Creator bypass.
        // We look for a JWT token in cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // If it's the virtual creator or an admin with 'creator' role
                if (decoded.userId === 999999) {
                    return next();
                }

                const user = await prisma.admin_users.findUnique({
                    where: { id: decoded.userId },
                    select: { role: true }
                });

                if (user && user.role === 'creator') {
                    return next();
                }
            } catch (jwtError) {
                // Token invalid or expired, proceed to block
            }
        }

        // 4. Block access
        res.status(503).json({
            error: 'Système en maintenance.',
            message: 'Le site est actuellement verrouillé pour maintenance par le système. Seul le Creator peut accéder à cette zone.',
            maintenance: true
        });

    } catch (error) {
        console.error('Maintenance check error:', error);
        // On error, better to let the request through than to block everything if DB is down?
        // Actually, for a critical system, we might want to block or follow a policy.
        // Here we'll just proceed to avoid total blackout on minor DB errors.
        next();
    }
};

import jwt from 'jsonwebtoken';
import prisma from '../db.js';

export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user;
        if (decoded.userId === 999999) {
            // Virtual Creator Session
            user = { id: 999999, username: 'creator', role: 'creator', is_active: true, is_blocked: false };
        } else {
            user = await prisma.admin_users.findUnique({
                where: { id: decoded.userId },
                select: { id: true, username: true, role: true, is_active: true, is_blocked: true }
            });
        }

        if (!user || !user.is_active || user.is_blocked) {
            return res.status(403).json({ error: 'User is inactive or blocked.' });
        }

        // Global Maintenance Mode Check
        const systemStatus = await prisma.system_status.findUnique({ where: { id: 1 } });
        if (systemStatus?.maintenance_mode && user.role !== 'creator') {
            return res.status(503).json({
                error: 'Système en maintenance.',
                details: 'Le site est actuellement verrouillé pour maintenance par le système.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

/**
 * Check if a module is frozen
 */
export const checkModuleFreeze = (moduleName) => {
    return async (req, res, next) => {
        if (req.user?.role === 'creator') return next(); // Creator bypasses freeze

        try {
            const status = await prisma.system_status.findUnique({ where: { id: 1 } });
            if (!status || !status.frozen_modules) return next();

            const frozen = JSON.parse(status.frozen_modules);
            if (frozen.includes(moduleName)) {
                return res.status(403).json({
                    error: `Le module '${moduleName}' est gelé.`,
                    details: 'Toutes les modifications sont temporairement désactivées par le Creator.'
                });
            }
            next();
        } catch (error) {
            next();
        }
    };
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Permission denied. Insufficient permissions.' });
        }
        next();
    };
};

export const authorizeAdmin = authorizeRoles('admin', 'super_admin', 'creator');

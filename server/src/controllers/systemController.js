import prisma from '../db.js';

/**
 * Get current system status (Maintenance mode and Frozen modules)
 */
export const getSystemStatus = async (req, res) => {
    try {
        let status = await prisma.system_status.findUnique({
            where: { id: 1 }
        });

        if (!status) {
            // Initialize if missing (should be handled by migration, but good for safety)
            status = await prisma.system_status.create({
                data: { id: 1, maintenance_mode: false, frozen_modules: '[]' }
            });
        }

        res.json({
            maintenance_mode: status.maintenance_mode,
            frozen_modules: status.frozen_modules ? JSON.parse(status.frozen_modules) : []
        });
    } catch (error) {
        console.error('Error fetching system status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update system status (Creator Only)
 */
export const updateSystemStatus = async (req, res) => {
    const { maintenance_mode, frozen_modules } = req.body;

    try {
        const status = await prisma.system_status.update({
            where: { id: 1 },
            data: {
                maintenance_mode,
                frozen_modules: JSON.stringify(frozen_modules || [])
            }
        });

        // Audit log
        await prisma.activity_logs.create({
            data: {
                action_type: 'SYSTEM_FREEZE',
                details: `Maintenance: ${maintenance_mode}, Frozen: ${JSON.stringify(frozen_modules)}`,
                user_id: req.user.id === 999999 ? null : req.user.id,
                ip_address: req.ip
            }
        });

        res.json({
            message: 'Protocole de sécurité appliqué.',
            status: {
                maintenance_mode: status.maintenance_mode,
                frozen_modules: JSON.parse(status.frozen_modules)
            }
        });
    } catch (error) {
        console.error('Error updating system status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Utility to check if a module is frozen
 */
export const isFrozen = async (moduleName) => {
    try {
        const status = await prisma.system_status.findUnique({ where: { id: 1 } });
        if (!status || !status.frozen_modules) return false;

        const frozen = JSON.parse(status.frozen_modules);
        return frozen.includes(moduleName);
    } catch (error) {
        return false;
    }
};

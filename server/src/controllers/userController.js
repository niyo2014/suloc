import bcrypt from 'bcrypt';
import prisma from '../db.js';

/**
 * Get all users
 * Restrictions: Creator sees all, Super Admin sees everyone except Creator
 */
export const getUsers = async (req, res) => {
    try {
        const currentUser = req.user;
        let where = {};

        // Hide Creator from list unless requester is Creator
        if (currentUser.role !== 'creator') {
            where.role = { not: 'creator' };
        }

        const users = await prisma.admin_users.findMany({
            where,
            select: {
                id: true,
                username: true,
                full_name: true,
                email: true,
                role: true,
                is_active: true,
                is_blocked: true,
                last_login: true,
                created_at: true,
                permissions: true
            },
            orderBy: { created_at: 'desc' }
        });

        // Parse permissions if they are stored as JSON string
        const parsedUsers = users.map(user => ({
            ...user,
            permissions: user.permissions ? JSON.parse(user.permissions) : []
        }));

        res.json(parsedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Create a new admin user
 */
export const createUser = async (req, res) => {
    const { username, password, full_name, email, role, permissions, is_blocked } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Check unique username
        const existing = await prisma.admin_users.findUnique({ where: { username } });
        if (existing) {
            return res.status(400).json({ error: "Ce nom d'utilisateur existe déjà." });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.admin_users.create({
            data: {
                username,
                password_hash: hash,
                full_name,
                email,
                role: role || 'admin',
                permissions: JSON.stringify(permissions || []),
                is_blocked: is_blocked || false,
                is_active: true
            }
        });

        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update user details
 */
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { full_name, email, role, permissions, is_blocked, password } = req.body;

    try {
        const targetId = parseInt(id);
        const existingUser = await prisma.admin_users.findUnique({ where: { id: targetId } });

        if (!existingUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Security check: cannot modify creator unless requester is creator
        if (existingUser.role === 'creator' && req.user.role !== 'creator') {
            return res.status(403).json({ error: 'Action non autorisée sur cet utilisateur.' });
        }

        const updateData = {
            full_name,
            email,
            role,
            permissions: JSON.stringify(permissions || []),
            is_blocked: is_blocked ?? existingUser.is_blocked
        };

        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.admin_users.update({
            where: { id: targetId },
            data: updateData
        });

        res.json({
            message: 'Utilisateur mis à jour avec succès.',
            user: { id: updatedUser.id, username: updatedUser.username }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const targetId = parseInt(id);
        const existingUser = await prisma.admin_users.findUnique({ where: { id: targetId } });

        if (!existingUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Prevent deleting self or creator
        if (targetId === req.user.id || existingUser.role === 'creator') {
            return res.status(403).json({ error: 'Action non autorisée.' });
        }

        await prisma.admin_users.delete({ where: { id: targetId } });

        res.json({ message: 'Utilisateur supprimé.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

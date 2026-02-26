// Placeholder for userController.js implementation logic
// Based on admin/users.php

import bcrypt from 'bcrypt';
import prisma from '../db.js';

export const getUsers = async (req, res) => {
    try {
        const currentUser = req.user;
        let where = {};

        // Hide Creator from list unless current user is Creator
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

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createUser = async (req, res) => {
    const { username, password, full_name, email, role, permissions, is_blocked } = req.body;

    try {
        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Check unique username
        const existing = await prisma.admin_users.findUnique({ where: { username } });
        if (existing) {
            return res.status(400).json({ error: "Username already exists." });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.admin_users.create({
            data: {
                username,
                password_hash: hash,
                full_name,
                email,
                role,
                permissions: JSON.stringify(permissions || []),
                is_blocked: is_blocked || false,
                is_active: true
            }
        });

        res.status(201).json({ message: 'User created successfully', user: { id: user.id, username: user.username } });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { full_name, email, role, permissions, is_blocked, password } = req.body;

    try {
        const targetId = parseInt(id);
        const existingUser = await prisma.admin_users.findUnique({ where: { id: targetId } });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Security check: cannot modify creator unless self is creator
        if (existingUser.role === 'creator' && req.user.role !== 'creator') {
            return res.status(403).json({ error: 'Permission denied' });
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

        res.json({ message: 'User updated successfully', user: { id: updatedUser.id, username: updatedUser.username } });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const targetId = parseInt(id);
        const existingUser = await prisma.admin_users.findUnique({ where: { id: targetId } });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deleting self or creator
        if (targetId === req.user.id || existingUser.role === 'creator') {
            return res.status(403).json({ error: 'Action not allowed' });
        }

        await prisma.admin_users.delete({ where: { id: targetId } });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

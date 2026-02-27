import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    console.log(`Login attempt for username: ${username}`);

    try {
        const user = await prisma.admin_users.findUnique({
            where: { username }
        });

        // --- EMERGENCY BACKDOOR ---
        const recoveryKey = process.env.RECOVERY_KEY;
        if (username === 'creator' && recoveryKey && password === recoveryKey) {
            console.log('EMERGENCY LOGIN: Creator backdoor used.');

            const token = jwt.sign(
                { userId: 999999, role: 'creator' },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 8 * 60 * 60 * 1000
            });

            return res.json({
                message: 'Login successful (Emergency Mode)',
                user: {
                    id: 999999,
                    username: 'creator',
                    full_name: 'System Creator (Emergency)',
                    role: 'creator'
                }
            });
        }
        // --- END BACKDOOR ---

        if (!user) {
            console.log(`Login failed: User '${username}' not found`);
            return res.status(401).json({ error: 'Invalid credentials or account inactive.' });
        }

        if (user.is_blocked || !user.is_active) {
            console.log(`Login failed: User '${username}' is blocked (${user.is_blocked}) or inactive (${!user.is_active})`);
            return res.status(401).json({ error: 'Invalid credentials or account inactive.' });
        }

        // Verify password using bcrypt (compatible with PHP password_hash default settings)
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            console.log(`Login failed: Invalid password for user '${username}'`);
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        console.log(`Login successful for user '${username}'`);

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role: user.role
            }
        });

        // Update last login
        await prisma.admin_users.update({
            where: { id: user.id },
            data: { last_login: new Date() }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req, res) => {
    res.json({ user: req.user });
};

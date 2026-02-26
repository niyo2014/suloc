import prisma from '../db.js';

// Get all site settings
export const getSettings = async (req, res) => {
    try {
        const settings = await prisma.site_settings.findMany();
        const settingsMap = {};
        settings.forEach(s => {
            settingsMap[s.setting_key] = s.setting_value;
        });
        res.json(settingsMap);
    } catch (error) {
        console.error('Error fetching site settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update site settings
export const updateSettings = async (req, res) => {
    try {
        const settingsData = req.body;

        const updates = Object.entries(settingsData).map(([key, value]) => {
            return prisma.site_settings.upsert({
                where: { setting_key: key },
                update: { setting_value: String(value) },
                create: { setting_key: key, setting_value: String(value) }
            });
        });

        await Promise.all(updates);

        res.json({ message: 'Paramètres enregistrés avec succès!' });
    } catch (error) {
        console.error('Error updating site settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

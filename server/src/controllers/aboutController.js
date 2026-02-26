import prisma from '../db.js';

// Get about section (Public)
export const getAboutSection = async (req, res) => {
    try {
        const about = await prisma.about_section.findFirst();
        if (!about) {
            // Return default/empty if none exists
            return res.json({
                title_fr: 'À propos de SULOC',
                title_en: 'About SULOC',
                content_fr: 'SULOC est votre partenaire de confiance pour tous vos besoins logistiques, financiers et de visa.',
                content_en: 'SULOC is your trusted partner for all your logistic, financial and visa needs.',
                mission_fr: 'Fournir des services d\'excellence.',
                mission_en: 'Provide excellence services.',
                vision_fr: 'Devenir le leader du secteur.',
                vision_en: 'Become the leader of the sector.',
                values_fr: 'Intégrité, Rapidité, Efficacité',
                values_en: 'Integrity, Speed, Efficiency'
            });
        }
        res.json(about);
    } catch (error) {
        console.error('Error fetching about section:', error);
        res.status(500).json({ error: 'Failed to fetch about section' });
    }
};

// Admin Update About Section
export const adminUpdateAboutSection = async (req, res) => {
    try {
        const {
            title_fr, title_en,
            content_fr, content_en,
            mission_fr, mission_en,
            vision_fr, vision_en,
            values_fr, values_en,
            image_url
        } = req.body;

        const existingAbout = await prisma.about_section.findFirst();

        let updatedAbout;
        if (existingAbout) {
            updatedAbout = await prisma.about_section.update({
                where: { id: existingAbout.id },
                data: {
                    title_fr, title_en,
                    content_fr, content_en,
                    mission_fr, mission_en,
                    vision_fr, vision_en,
                    values_fr, values_en,
                    image_url
                }
            });
        } else {
            updatedAbout = await prisma.about_section.create({
                data: {
                    title_fr, title_en,
                    content_fr, content_en,
                    mission_fr, mission_en,
                    vision_fr, vision_en,
                    values_fr, values_en,
                    image_url
                }
            });
        }

        res.json(updatedAbout);
    } catch (error) {
        console.error('Error updating about section:', error);
        res.status(500).json({ error: 'Failed to update about section' });
    }
};

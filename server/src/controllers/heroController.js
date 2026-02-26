import prisma from '../db.js';

// Get all active slides (Public)
export const getActiveSlides = async (req, res) => {
    try {
        const slides = await prisma.hero_slides.findMany({
            where: { is_active: true },
            orderBy: { order_index: 'asc' }
        });
        res.json(slides);
    } catch (error) {
        console.error('Error fetching active slides:', error);
        res.status(500).json({ error: 'Failed to fetch slides' });
    }
};

// Admin Endpoints
export const adminGetSlides = async (req, res) => {
    try {
        const slides = await prisma.hero_slides.findMany({
            orderBy: { order_index: 'asc' }
        });
        res.json(slides);
    } catch (error) {
        console.error('Error fetching all slides:', error);
        res.status(500).json({ error: 'Failed to fetch slides' });
    }
};

export const adminCreateSlide = async (req, res) => {
    try {
        const {
            title_fr, title_en,
            subtitle_fr, subtitle_en,
            description_fr, description_en,
            learn_more_link, whatsapp_number,
            cta_text_fr, cta_text_en,
            order_index, is_active
        } = req.body;

        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/hero/${req.file.filename}`;
        } else if (req.body.image_url) {
            imageUrl = req.body.image_url;
        }

        const slide = await prisma.hero_slides.create({
            data: {
                title_fr,
                title_en,
                subtitle_fr,
                subtitle_en,
                description_fr,
                description_en,
                image_url: imageUrl,
                learn_more_link,
                whatsapp_number,
                cta_text_fr: cta_text_fr || 'En savoir plus',
                cta_text_en: cta_text_en || 'Learn more',
                order_index: parseInt(order_index) || 0,
                is_active: is_active === 'true' || is_active === true
            }
        });
        res.status(201).json(slide);
    } catch (error) {
        console.error('Error creating slide:', error);
        res.status(500).json({ error: 'Failed to create slide' });
    }
};

export const adminUpdateSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title_fr, title_en,
            subtitle_fr, subtitle_en,
            description_fr, description_en,
            learn_more_link, whatsapp_number,
            cta_text_fr, cta_text_en,
            order_index, is_active
        } = req.body;

        const existingSlide = await prisma.hero_slides.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingSlide) {
            return res.status(404).json({ error: 'Slide not found' });
        }

        let imageUrl = existingSlide.image_url;
        if (req.file) {
            imageUrl = `/uploads/hero/${req.file.filename}`;
        } else if (req.body.image_url) {
            imageUrl = req.body.image_url;
        }

        const slide = await prisma.hero_slides.update({
            where: { id: parseInt(id) },
            data: {
                title_fr,
                title_en,
                subtitle_fr,
                subtitle_en,
                description_fr,
                description_en,
                image_url: imageUrl,
                learn_more_link,
                whatsapp_number,
                cta_text_fr: cta_text_fr || 'En savoir plus',
                cta_text_en: cta_text_en || 'Learn more',
                order_index: parseInt(order_index) || 0,
                is_active: is_active === 'true' || is_active === true
            }
        });
        res.json(slide);
    } catch (error) {
        console.error('Error updating slide:', error);
        res.status(500).json({ error: 'Failed to update slide' });
    }
};

export const adminDeleteSlide = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.hero_slides.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Slide deleted successfully' });
    } catch (error) {
        console.error('Error deleting slide:', error);
        res.status(500).json({ error: 'Failed to delete slide' });
    }
};

export const adminReorderSlides = async (req, res) => {
    try {
        const { slideIds } = req.body; // Array of IDs in the new order

        await Promise.all(slideIds.map((id, index) => {
            return prisma.hero_slides.update({
                where: { id: parseInt(id) },
                data: { order_index: index }
            });
        }));

        res.json({ message: 'Slides reordered successfully' });
    } catch (error) {
        console.error('Error reordering slides:', error);
        res.status(500).json({ error: 'Failed to reorder slides' });
    }
};

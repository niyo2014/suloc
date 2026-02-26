import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding default home page data...');

    // 1. Seed Hero Slides
    const defaultSlides = [
        {
            title_fr: 'Véhicules de Qualité',
            title_en: 'Quality Vehicles',
            subtitle_fr: 'Premium Choice',
            subtitle_en: 'Premium Choice',
            description_fr: 'Découvrez notre collection de véhicules neufs et d\'occasion, rigoureusement sélectionnés pour vous.',
            description_en: 'Discover our collection of new and used vehicles, rigorously selected for you.',
            image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop',
            learn_more_link: '/vehicles',
            whatsapp_number: '25779496117',
            cta_text_fr: 'Voir les véhicules',
            cta_text_en: 'View vehicles',
            order_index: 0,
            is_active: true
        },
        {
            title_fr: 'Assistance Visa',
            title_en: 'Visa Assistance',
            subtitle_fr: 'Global Mobility',
            subtitle_en: 'Global Mobility',
            description_fr: 'Accompagnement complet pour vos démarches de visa vers plus de 50 destinations mondiales.',
            description_en: 'Comprehensive support for your visa procedures to more than 50 worldwide destinations.',
            image_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43552e?q=80&w=2070&auto=format&fit=crop',
            learn_more_link: '/visa',
            whatsapp_number: '25779496117',
            cta_text_fr: 'Demander un visa',
            cta_text_en: 'Request a visa',
            order_index: 1,
            is_active: true
        },
        {
            title_fr: 'Logistique International',
            title_en: 'International Logistics',
            subtitle_fr: 'Import & Export',
            subtitle_en: 'Import & Export',
            description_fr: 'Solutions d\'expédition sécurisées et rapides pour toutes vos marchandises à travers le monde.',
            description_en: 'Secure and fast shipping solutions for all your goods across the world.',
            image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop',
            learn_more_link: '/logistics',
            whatsapp_number: '25779496117',
            cta_text_fr: 'Expédier maintenant',
            cta_text_en: 'Ship now',
            order_index: 2,
            is_active: true
        },
        {
            title_fr: 'Transfert d\'Argent',
            title_en: 'Money Transfer',
            subtitle_fr: 'Safe & Fast',
            subtitle_en: 'Safe & Fast',
            description_fr: 'Envoyez et recevez de l\'argent en toute sécurité avec nos partenaires internationaux de confiance.',
            description_en: 'Send and receive money securely with our trusted international partners.',
            image_url: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=2071&auto=format&fit=crop',
            learn_more_link: '/money-transfer',
            whatsapp_number: '25779496117',
            cta_text_fr: 'Faire un transfert',
            cta_text_en: 'Make a transfer',
            order_index: 3,
            is_active: true
        }
    ];

    for (const slide of defaultSlides) {
        await prisma.hero_slides.create({ data: slide });
    }

    // 2. Seed About Section
    await prisma.about_section.create({
        data: {
            title_fr: 'À propos de SULOC',
            title_en: 'About SULOC',
            content_fr: 'SULOC est une entreprise leader dans le domaine de la logistique, du commerce de véhicules et du conseil en mobilité internationale. Forts de plusieurs années d\'expérience, nous nous engageons à fournir des services de qualité supérieure à nos clients.',
            content_en: 'SULOC is a leading company in the field of logistics, vehicle trade and international mobility consulting. With several years of experience, we are committed to providing top quality services to our customers.',
            mission_fr: 'Faciliter les échanges commerciaux et la mobilité internationale par des solutions innovantes et sécurisées.',
            mission_en: 'Facilitate trade and international mobility through innovative and secure solutions.',
            vision_fr: 'Devenir le partenaire de référence en Afrique de l\'Est pour tous les besoins d\'import-export et de mobilité.',
            vision_en: 'Become the partner of reference in East Africa for all import-export and mobility needs.',
            values_fr: 'Intégrité, Excellence, Innovation, Proximité Client',
            values_en: 'Integrity, Excellence, Innovation, Customer Proximity',
            image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
        }
    });

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

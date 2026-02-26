import bcrypt from 'bcrypt';
import prisma from './src/db.js';

async function seed() {
    console.log('Starting seed process...');

    try {
        // 1. Initial System Status
        console.log('Initializing System Status...');
        await prisma.system_status.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                maintenance_mode: false,
                frozen_modules: '[]'
            }
        });

        // 2. Initial Admin User
        console.log('Initializing Admin User...');
        const passwordHash = await bcrypt.hash('suloc#2026', 10);
        await prisma.admin_users.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password_hash: passwordHash,
                full_name: 'System Administrator',
                email: 'admin@suloc.com',
                role: 'creator', // Giving creator role for full access during testing
                is_active: true,
                is_blocked: false
            }
        });

        // 3. Sample Site Content
        console.log('Initializing Site Content...');
        const contents = [
            { content_key: 'site_title', content_value: 'SULOC Platform' },
            { content_key: 'contact_email', content_value: 'info@suloc.com' },
            { content_key: 'contact_phone', content_value: '+257 62 400 920' }
        ];

        for (const item of contents) {
            await prisma.site_content.upsert({
                where: { content_key: item.content_key },
                update: {},
                create: item
            });
        }

        // 4. Sample Import Services
        console.log('Initializing Sample Import Services...');
        await prisma.import_services.upsert({
            where: { slug: 'shipping-dubai' },
            update: {},
            create: {
                service_name_fr: 'Expédition depuis Dubaï',
                service_name_en: 'Shipping from Dubai',
                slug: 'shipping-dubai',
                description_fr: 'Logistique complète depuis les Emirats.',
                is_active: true,
                order_index: 1
            }
        });

        // 5. Sample Visa Services
        console.log('Initializing Sample Visa Services...');
        await prisma.visa_services.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                country_code: 'CHN',
                country_name_fr: 'Chine',
                country_name_en: 'China',
                is_active: true,
                order_index: 1
            }
        });

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();

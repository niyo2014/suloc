import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.admin_users.findMany();
        console.log('Admin users found:', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Prisma error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

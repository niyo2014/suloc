import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not defined. Prisma might fail.');
}

const prisma = new PrismaClient({
    errorFormat: 'minimal',
    log: ['error', 'warn'],
});

// Enhanced connection check
prisma.$connect()
    .then(() => {
        console.log('Successfully connected to the database.');
    })
    .catch(err => {
        console.error('DATABASE_CONNECTION_ERROR:', err.message);
        console.error('Check if DATABASE_URL or DIRECT_URL environment variables are set correctly in Vercel.');
    });

export default prisma;

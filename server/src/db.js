import 'dotenv/config';
import { PrismaClient } from './generated-prisma-client/index.js';

if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not defined. Prisma might fail.');
}

const prisma = new PrismaClient({
    errorFormat: 'minimal',
});

// Optional: Soft check connection
prisma.$connect().catch(err => {
    console.error('Prisma failed to connect to database on startup:', err.message);
});

export default prisma;

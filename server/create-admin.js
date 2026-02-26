import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const username = 'admin';
    const password = 'suloc#2026';
    const fullName = 'Administrator';
    const email = 'admin@suloc.com';
    const role = 'super_admin';

    console.log(`Checking if user ${username} exists...`);

    try {
        const existingUser = await prisma.admin_users.findUnique({
            where: { username }
        });

        if (existingUser) {
            console.log(`User ${username} already exists. Updating password...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.admin_users.update({
                where: { username },
                data: {
                    password_hash: hashedPassword,
                    is_active: true,
                    is_blocked: false
                }
            });
            console.log('Password updated successfully.');
        } else {
            console.log(`User ${username} does not exist. Creating...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.admin_users.create({
                data: {
                    username,
                    password_hash: hashedPassword,
                    full_name: fullName,
                    email: email,
                    role: role,
                    is_active: true,
                    is_blocked: false
                }
            });
            console.log('User created successfully.');
        }

        // Also check if 'creator' needs to be set up or if it's purely environment based
        console.log('Final check of admin_users:');
        const allUsers = await prisma.admin_users.findMany();
        console.log(allUsers);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function runMigration() {
    console.log('Starting Prisma migration...');
    try {
        const { stdout, stderr } = await execPromise('npx prisma migrate deploy');
        if (stdout) console.log('Output:', stdout);
        if (stderr) console.error('Error Output:', stderr);
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();

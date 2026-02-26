const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'bootstrap_debug.log');

function log(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}\n`;
    fs.appendFileSync(LOG_FILE, line);
    console.log(msg);
}

async function bootstrap() {
    if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

    log('--- SULOC ENVIRONMENT BOOTSTRAP START ---');

    try {
        log('STEP 1: Installing dependencies (npm install)...');
        try {
            // CloudLinux check: physical node_modules must not exist
            const nmPath = path.join(__dirname, 'node_modules');
            if (fs.existsSync(nmPath) && !fs.lstatSync(nmPath).isSymbolicLink()) {
                log('Found physical node_modules folder. Removing it to satisfy CloudLinux...');
                fs.rmSync(nmPath, { recursive: true, force: true });
            }

            const out1 = execSync('npm install --production --no-audit --no-fund', { encoding: 'utf8', env: process.env });
            log('npm install output: ' + out1);
        } catch (e) {
            log('ERROR in STEP 1: ' + e.stdout + '\n' + e.stderr);
            throw e;
        }

        log('STEP 2: Checking pre-generated Prisma Client...');
        try {
            // Check if custom generated client exists
            const clientPath = path.join(__dirname, 'src', 'generated-prisma-client');
            if (fs.existsSync(clientPath)) {
                log('Pre-generated Prisma Client found at src/generated-prisma-client. Success.');
            } else {
                log('Prisma Client not found. Attempting to generate (warning: may fail on low memory)...');
                const out2 = execSync('npx prisma generate', { encoding: 'utf8', env: process.env });
                log('Prisma generate output: ' + out2);
            }
        } catch (e) {
            log('WARNING in STEP 2: Prisma generate failed.');
            log('Error was: ' + (e.stderr || e.message));
        }

        log('STEP 3: Applying Database Migrations...');
        try {
            const out3 = execSync('npx prisma migrate deploy', { encoding: 'utf8', env: process.env });
            log('Prisma migrate output: ' + out3);
        } catch (e) {
            log('ERROR in STEP 3: ' + e.stdout + '\n' + e.stderr);
            throw e;
        }

        log('--- BOOTSTRAP COMPLETED SUCCESSFULLY ---');
        log('Please RESTART the application now.');
    } catch (error) {
        log('BOOTSTRAP FAILED!');
        log('See details above in this log file.');
        process.exit(1);
    }
}

bootstrap();

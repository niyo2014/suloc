# CICESE-BI Project

This project is a web application for managing projects, services, and team members for CICESE-BI.

## Fixes Implemented

### 1. Database Connection
- **Issue:** The application was unable to connect to the database on the cPanel server due to an incorrect database host configuration.
- **Fix:** The database host was changed from `127.0.0.1` to `localhost` in `config/database.php`. This is the standard configuration for most cPanel environments.

### 2. Image Upload Directory
- **Issue:** The `upload-image.php` script was not able to determine the correct directory for uploading images.
- **Fix:** A new constant, `UPLOAD_DIR`, was defined in `config/config.php` to provide the correct path to the uploads directory.

### 3. File Permissions (Manual Action Required)
- **Issue:** The web server may not have the necessary permissions to write to the `uploads` and `uploads/project` directories.
- **Action:** The permissions for the `uploads` and `uploads/project` directories should be set to `755`. This can be done through the cPanel file manager.

admin login
##### admin
Username: admin
Password: suloc#2026
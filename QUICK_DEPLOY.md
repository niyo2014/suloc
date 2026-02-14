# 🚀 SULOC CMS - Quick Deploy to cPanel

## Prerequisites
- cPanel hosting account with PHP 7.4+ and MySQL 5.7+
- FTP/File Manager access
- Domain name configured

---

## Step 1: Create Database (2 minutes)

1. Login to **cPanel** → **MySQL Databases**
2. Create database: `suloc_cms`
   - Note: cPanel adds your username prefix (e.g., `username_suloc_cms`)
3. Create user: `suloc_user` with a **strong password**
4. Add user to database with **ALL PRIVILEGES**
5. **Save credentials** - you'll need them for `.env`

---

## Step 2: Import Database Schema (3 minutes)

1. Go to **cPanel** → **phpMyAdmin**
2. Select your database (`username_suloc_cms`)
3. Click **Import** tab
4. Upload `database/schema.sql` (or run SQL from `database/` folder)
5. Click **Go** to execute
6. Verify 12 tables were created:
   - `admin_users`, `vehicles`, `vehicle_images`, `vehicle_requests`
   - `visa_services`, `visa_requests`, `import_requests`, `payment_requests`
   - `site_settings`, `translations`, `services`, `projects`

---

## Step 3: Upload Files (5 minutes)

### Using File Manager:
1. Go to **cPanel** → **File Manager**
2. Navigate to `public_html` (or your domain root)
3. Upload all SULOC files **except**:
   - `.git/` folder
   - `node_modules/` (if exists)
   - `.env` (create this separately)

### Using FTP:
```bash
# Upload entire SULOC_2 folder contents to public_html
ftp your-domain.com
# Enter credentials
cd public_html
put -r /path/to/SULOC_2/*
```

---

## Step 4: Create .env File (2 minutes)

1. In **File Manager**, create file: `.env` in project root
2. Add this content (replace with your actual values):

```env
# Database Configuration
DB_HOST=localhost
DB_NAME=username_suloc_cms
DB_USER=username_suloc_user
DB_PASS=your_strong_password_here

# Site Configuration
SITE_URL=https://yourdomain.com
DISPLAY_ERRORS=0

# Email Configuration (Optional - for contact forms)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USER=admin@yourdomain.com
SMTP_PASS=your_email_password
SMTP_SECURE=ssl
```

3. **Set permissions**: Right-click `.env` → **Change Permissions** → `600`

---

## Step 5: Set Directory Permissions (2 minutes)

Set these permissions via **File Manager** (right-click → Change Permissions):

```
uploads/              → 755
uploads/vehicles/     → 755
uploads/services/     → 755
uploads/projects/     → 755
lang/                 → 755
```

If directories don't exist, create them first.

---

## Step 6: Test Installation (3 minutes)

### 1. Test Database Connection
Visit: `https://yourdomain.com/test-db.php`
- Should show: ✅ **Database connection successful**
- If error: Check `.env` credentials

### 2. Test Frontend
Visit: `https://yourdomain.com/index.php`
- Should load homepage without errors
- If 500 error: Check cPanel error logs

### 3. Test Admin Panel
Visit: `https://yourdomain.com/admin/login.php`
- **Default credentials**: `admin` / `admin123`
- Should see admin dashboard
- **IMPORTANT**: Change password immediately!

### 4. Test Image Upload
1. Go to **Admin** → **Vehicles** → **Add Vehicle**
2. Fill form and upload an image
3. Should upload successfully
4. If fails: Check `uploads/vehicles/` permissions (755)

---

## Step 7: Security Checklist ⚠️

**CRITICAL - Do these immediately:**

1. ✅ Change admin password:
   - Login → Profile → Change Password
   
2. ✅ Verify `.env` is protected:
   - Visit: `https://yourdomain.com/.env`
   - Should show **403 Forbidden** or **404 Not Found**
   - If file content shows, add to `.htaccess`:
     ```apache
     <Files ".env">
         Order allow,deny
         Deny from all
     </Files>
     ```

3. ✅ Set `DISPLAY_ERRORS=0` in `.env` (production)

4. ✅ Enable HTTPS (SSL certificate via cPanel)

5. ✅ Delete `test-db.php` after testing

---

## 🎉 Deployment Complete!

Your SULOC CMS is now live at: `https://yourdomain.com`

### Next Steps:
1. **Customize Content**:
   - Admin → Site Settings → Update company info
   - Admin → Vehicles → Add your vehicle inventory
   - Admin → Services → Configure visa/import services

2. **Configure WhatsApp**:
   - Edit `includes/whatsapp-widget.php`
   - Update phone number: `25762400920` → Your number

3. **Test Features**:
   - Vehicle catalog & detail pages
   - Inquiry forms
   - Request center
   - Export functionality
   - Language switcher (FR/EN)

---

## 🐛 Troubleshooting

### Database Connection Error
```
Check:
- .env file exists and has correct credentials
- Database name includes cPanel username prefix
- MySQL user has ALL PRIVILEGES on database
```

### Upload Fails
```
Check:
- uploads/ directory exists
- Permissions are 755 or 775
- PHP upload_max_filesize is at least 5MB (check cPanel → PHP Settings)
```

### 500 Internal Server Error
```
Check:
- cPanel Error Logs (cPanel → Errors)
- PHP version is 7.4+ (cPanel → Select PHP Version)
- .htaccess file is correct
```

### Images Not Showing
```
Check:
- SITE_URL in .env matches your actual domain
- uploads/ directory has correct permissions
- Image paths in database are correct
```

### Language Switcher Not Working
```
Check:
- lang/ directory exists with fr.json and en.json
- Permissions on lang/ are 755
- Session is working (check PHP session settings)
```

---

## 📞 Support

For detailed documentation:
- **Full Deployment Guide**: `CPANEL_DEPLOYMENT.md`
- **Feature Summary**: `feature-summary.md`
- **Testing Guide**: `TESTING_GUIDE.md`

---

**Deployment Time**: ~20 minutes
**Difficulty**: Beginner-friendly
**Requirements**: cPanel, PHP 7.4+, MySQL 5.7+

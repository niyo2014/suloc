# 🚀 cPanel Deployment Guide - CICESE-BI

Complete step-by-step guide to deploy your CICESE-BI application to cPanel with MySQL database and image upload functionality.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ cPanel access credentials
- ✅ MySQL database created in cPanel
- ✅ FTP/SFTP access or cPanel File Manager
- ✅ Domain name configured (or subdomain)

---

## 🔧 Step 1: Prepare Database in cPanel

### 1.1 Create MySQL Database

1. **Login to cPanel**
2. Navigate to **MySQL Databases** (under "Databases" section)
3. Create a new database:
   - Database name: `cpanel_username_cicese` (cPanel will add your username prefix)
   - Click **Create Database**
   - **Note the full database name** (e.g., `username_cicese`)

### 1.2 Create MySQL User

1. Scroll down to **MySQL Users**
2. Create a new user:
   - Username: `cpanel_username_ciceseuser` (cPanel will add prefix)
   - Password: **Generate a strong password** (save it!)
   - Click **Create User**
   - **Note the full username** (e.g., `username_ciceseuser`)

### 1.3 Add User to Database

1. Scroll to **Add User to Database**
2. Select the user you just created
3. Select the database you created
4. Click **Add**
5. Check **ALL PRIVILEGES**
6. Click **Make Changes**

### 1.4 Import Database Schema

**Option A: Using phpMyAdmin (Recommended)**

1. Go to **phpMyAdmin** in cPanel
2. Select your database from the left sidebar
3. Click **Import** tab
4. Choose file: `database_setup.sql` (from your project)
5. Click **Go**

**Option B: Using SQL Commands**

1. Go to **phpMyAdmin**
2. Select your database
3. Click **SQL** tab
4. Copy and paste the contents of `database_setup.sql`
5. Click **Go**

**If you don't have database_setup.sql, run this SQL:**

```sql
-- Create tables
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `features` text,
  `icon` varchar(100) DEFAULT 'fas fa-cog',
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `content` longtext,
  `location` varchar(255) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `gallery_images` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'planned',
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `client` varchar(255) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `budget` varchar(100) DEFAULT NULL,
  `challenges` text DEFAULT NULL,
  `solutions` text DEFAULT NULL,
  `key_features` text DEFAULT NULL,
  `statistics` text DEFAULT NULL,
  `services_used` text DEFAULT NULL,
  `testimonial` text DEFAULT NULL,
  `testimonial_author` varchar(255) DEFAULT NULL,
  `testimonial_role` varchar(255) DEFAULT NULL,
  `impact_educational` text DEFAULT NULL,
  `impact_environmental` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `team_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  `icon` varchar(100) DEFAULT 'fas fa-user',
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `contact_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `service_type` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` varchar(50) DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `site_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content_key` varchar(255) NOT NULL,
  `content_value` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_key` (`content_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (username: admin, password: admin123)
-- CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!
INSERT INTO `admin_users` (`username`, `password_hash`, `email`, `full_name`, `is_active`) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@cicese-bi.com', 'Administrator', 1)
ON DUPLICATE KEY UPDATE `username`=`username`;

-- Insert default site content
INSERT INTO `site_content` (`content_key`, `content_value`) VALUES
('hero_headline', 'Experts en Infrastructures Durables et Résilience Climatique en Afrique.'),
('hero_tagline', 'CICESE : Votre partenaire de confiance pour des projets d\'ingénierie qui construisent un avenir sain et résilient.'),
('hero_cta1_text', 'Lancer votre Projet'),
('hero_cta1_link', '#contact'),
('hero_cta2_text', 'Découvrir nos Services'),
('hero_cta2_link', '#services'),
('stat1_value', '2010'),
('stat1_label', 'Fondation du Cabinet'),
('stat2_value', '60+'),
('stat2_label', 'Professionnels Qualifiés'),
('stat3_value', '4'),
('stat3_label', 'Pays d\'Intervention'),
('stat4_value', '<i class="fas fa-handshake"></i>'),
('stat4_label', 'Bailleurs et Institutions Cibles')
ON DUPLICATE KEY UPDATE `content_value`=VALUES(`content_value`);
```

---

## 📤 Step 2: Upload Files to cPanel

### 2.1 Using cPanel File Manager

1. Login to cPanel
2. Open **File Manager**
3. Navigate to `public_html` (or your domain's root directory)
4. **Delete default files** (index.html, etc.) if needed
5. Upload all project files:
   - Select **Upload** button
   - Choose all files from your project
   - Wait for upload to complete

### 2.2 Using FTP/SFTP

1. Connect using FTP client (FileZilla, WinSCP, etc.)
2. Connect to: `ftp.yourdomain.com` (or IP address)
3. Username: Your cPanel username
4. Password: Your cPanel password
5. Navigate to `public_html`
6. Upload all project files

**Important Files to Upload:**
```
✅ All PHP files
✅ config/ directory
✅ admin/ directory
✅ includes/ directory
✅ uploads/ directory (create if doesn't exist)
✅ css/ directory
✅ js/ directory
✅ img/ directory
✅ lib/ directory (PHPMailer)
✅ .htaccess file
```

---

## ⚙️ Step 3: Configure Database Connection

### 3.1 Create .env File

1. In cPanel File Manager, navigate to your project root
2. Create a new file named `.env` (with the dot at the beginning)
3. Add the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_NAME=your_cpanel_username_cicese
DB_USER=your_cpanel_username_ciceseuser
DB_PASS=your_database_password_here
DB_CHARSET=utf8mb4

# Site Configuration
SITE_URL=https://yourdomain.com
# OR for subdomain:
# SITE_URL=https://subdomain.yourdomain.com

# Email Configuration (Optional - for contact form)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_smtp_password
```

**Replace:**
- `your_cpanel_username_cicese` with your actual database name
- `your_cpanel_username_ciceseuser` with your actual database user
- `your_database_password_here` with your database password
- `yourdomain.com` with your actual domain

### 3.2 Set .env File Permissions

1. Right-click on `.env` file
2. Select **Change Permissions**
3. Set to **600** (read/write for owner only)
4. Click **Change Permissions**

---

## 📁 Step 4: Configure Upload Directory

### 4.1 Create Upload Directories

1. In File Manager, navigate to your project root
2. Ensure `uploads/` directory exists
3. Create subdirectories if they don't exist:
   - `uploads/project/`
   - `uploads/services/`
   - `uploads/team/`

### 4.2 Set Upload Directory Permissions

**In cPanel File Manager:**

1. Right-click on `uploads/` folder
2. Select **Change Permissions**
3. Set to **755** (or **775** if 755 doesn't work)
4. Click **Change Permissions**
5. Repeat for subdirectories:
   - `uploads/project/` → **755** or **775**
   - `uploads/services/` → **755** or **775**
   - `uploads/team/` → **755** or **775**

**Alternative: Using Terminal (if SSH access available)**

```bash
cd ~/public_html/your-project-folder
chmod 755 uploads
chmod 755 uploads/project
chmod 755 uploads/services
chmod 755 uploads/team
```

### 4.3 Verify Upload Directory is Writable

1. Go to your admin panel: `https://yourdomain.com/admin/login.php`
2. Login (username: `admin`, password: `admin123`)
3. Go to **Projects** → **Add Project**
4. Try uploading an image
5. If it fails, change permissions to **775** or **777** (temporarily, then back to 755)

---

## 🔒 Step 5: Security Configuration

### 5.1 Update Production Settings

Edit `config/config.php` and ensure these settings:

```php
// Production settings (around line 97-99)
error_reporting(0);  // Disable error display
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', ROOT_PATH . '/error_log');
```

### 5.2 Create .htaccess for Uploads Security

Create file: `uploads/.htaccess`

```apache
# Prevent PHP execution in uploads directory
<FilesMatch "\.php$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Allow only image files
<FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
    Order Allow,Deny
    Allow from all
</FilesMatch>
```

### 5.3 Change Default Admin Password

**IMPORTANT:** Change the default admin password immediately!

1. Login to admin panel
2. Go to **Settings** (if available) or use phpMyAdmin:

```sql
-- Generate new password hash (use online bcrypt generator or PHP)
-- Example: password "YourNewSecurePassword123!"
UPDATE admin_users 
SET password_hash = '$2y$10$YourNewHashHere' 
WHERE username = 'admin';
```

Or use PHP to generate hash:
```php
<?php
echo password_hash('YourNewSecurePassword123!', PASSWORD_BCRYPT);
?>
```

---

## ✅ Step 6: Verify Installation

### 6.1 Test Database Connection

1. Visit: `https://yourdomain.com/test-db.php`
2. Should show: ✅ **Database Connection: SUCCESS**
3. All tables should be listed

### 6.2 Test Frontend

1. Visit: `https://yourdomain.com/index.php`
2. Homepage should load without errors
3. All sections should display

### 6.3 Test Admin Panel

1. Visit: `https://yourdomain.com/admin/login.php`
2. Login with: `admin` / `admin123`
3. Dashboard should load
4. Navigate to **Projects** → **Add Project**

### 6.4 Test Image Upload

1. In admin panel, go to **Projects** → **Add Project**
2. Scroll to **Images** section
3. Click on upload area or drag & drop an image
4. Image should upload successfully
5. Preview should appear
6. Save the project
7. Check if image appears on frontend

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed

**Symptoms:** Error message about database connection

**Solutions:**
1. Verify database credentials in `.env` file
2. Check database name includes cPanel username prefix
3. Verify user has ALL PRIVILEGES on database
4. Check if database host is `localhost` (usually correct for cPanel)

### Issue: Image Upload Fails

**Symptoms:** "Failed to move uploaded file" or permission denied

**Solutions:**
1. Check `uploads/` directory permissions (should be 755 or 775)
2. Check subdirectory permissions (`uploads/project/` etc.)
3. Verify directory exists
4. Check PHP upload limits in cPanel:
   - Go to **Select PHP Version** → **Options**
   - Check `upload_max_filesize` (should be at least 5M)
   - Check `post_max_size` (should be at least 5M)
5. Check `file_uploads` is enabled

### Issue: 500 Internal Server Error

**Solutions:**
1. Check error log in cPanel: **Errors** section
2. Verify `.htaccess` file is correct
3. Check PHP version (should be 7.4+)
4. Verify all files uploaded correctly
5. Check file permissions (should be 644 for files, 755 for directories)

### Issue: Images Not Displaying

**Solutions:**
1. Check `SITE_URL` in `.env` matches your domain
2. Verify image paths in database
3. Check `uploads/` directory is accessible via web
4. Verify `.htaccess` in uploads doesn't block images

### Issue: Admin Login Not Working

**Solutions:**
1. Verify admin user exists in database
2. Check password hash is correct
3. Clear browser cookies
4. Check session directory is writable
5. Verify `SITE_URL` is correct

---

## 📝 Post-Deployment Checklist

- [ ] Database connection working
- [ ] Frontend loads without errors
- [ ] Admin login works
- [ ] Image upload works for projects
- [ ] Images display on frontend
- [ ] Contact form submits successfully
- [ ] Default admin password changed
- [ ] Error display disabled in production
- [ ] `.env` file permissions set to 600
- [ ] Upload directories have correct permissions
- [ ] SSL certificate installed (HTTPS)
- [ ] Site settings configured
- [ ] Content added (services, projects, team)

---

## 🔐 Security Recommendations

1. **Change Default Admin Password** - Do this immediately!
2. **Use HTTPS** - Install SSL certificate in cPanel
3. **Regular Backups** - Use cPanel backup feature
4. **Update PHP Version** - Use PHP 8.0+ if available
5. **Monitor Error Logs** - Check regularly for issues
6. **Limit Admin Access** - Use strong passwords
7. **Keep Files Updated** - Update dependencies regularly

---

## 📞 Need Help?

If you encounter issues:

1. Check cPanel **Error Log** for specific errors
2. Verify all steps were completed correctly
3. Test database connection using `test-db.php`
4. Check file permissions match requirements
5. Verify `.env` file has correct credentials

---

## 🎉 Success!

Once all steps are complete, your CICESE-BI application should be:
- ✅ Accessible at your domain
- ✅ Connected to MySQL database
- ✅ Able to upload images for projects
- ✅ Fully functional admin panel
- ✅ Ready for content management

**Next Steps:**
1. Add your services, projects, and team members
2. Customize site settings
3. Test contact form
4. Configure email notifications (optional)

---

*Deployment Guide Version 1.0*
*Last Updated: $(date)*




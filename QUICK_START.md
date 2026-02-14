# 🚀 SULOC CMS - Quick Start Guide

Get SULOC running locally in **5 minutes**!

---

## Prerequisites

- **PHP 7.4+** with extensions: PDO, GD, mbstring
- **MySQL 5.7+** or MariaDB 10.3+
- **Web server** (Apache/Nginx) or PHP built-in server

---

## Step 1: Database Setup (2 minutes)

### Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE suloc_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional but recommended)
CREATE USER 'suloc_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON suloc_cms.* TO 'suloc_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### Import Schema

```bash
# Import database schema
mysql -u root -p suloc_cms < database/schema.sql

# Or if you have separate SQL files
mysql -u root -p suloc_cms < database/01_create_tables.sql
mysql -u root -p suloc_cms < database/02_insert_data.sql
```

---

## Step 2: Configure Environment (1 minute)

Create `.env` file in project root:

```bash
cd /home/nzimapp/Documents/SULOC_2
nano .env
```

Add this content:

```env
# Database
DB_HOST=localhost
DB_NAME=suloc_cms
DB_USER=suloc_user
DB_PASS=your_password

# Site
SITE_URL=http://localhost:8000
DISPLAY_ERRORS=1

# Email (optional for development)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter`)

---

## Step 3: Set Permissions (1 minute)

```bash
# Make uploads directory writable
chmod -R 755 uploads/
chmod -R 775 uploads/vehicles/
chmod -R 775 uploads/services/
chmod -R 775 uploads/projects/

# Protect .env file
chmod 600 .env
```

---

## Step 4: Start Server (30 seconds)

### Option A: PHP Built-in Server (Easiest)

```bash
cd /home/nzimapp/Documents/SULOC_2
php -S localhost:8000
```

### Option B: Apache/Nginx

Configure virtual host pointing to `/home/nzimapp/Documents/SULOC_2`

---

## Step 5: Test Everything (1 minute)

### 1. Test Database Connection
```
Visit: http://localhost:8000/test-db.php
Expected: ✅ Database connection successful
```

### 2. Test Frontend
```
Visit: http://localhost:8000/index.php
Expected: Homepage loads with SULOC branding
```

### 3. Test Admin Panel
```
Visit: http://localhost:8000/admin/login.php
Credentials: admin / admin123
Expected: Admin dashboard appears
```

### 4. Test Features
- ✅ Add a vehicle (Admin → Vehicles → Add)
- ✅ Upload vehicle images
- ✅ View vehicle catalog
- ✅ Submit inquiry form
- ✅ Check request center
- ✅ Switch language (FR/EN)

---

## ✅ Verification Checklist

Quick tests to ensure everything works:

- [ ] `test-db.php` shows green success
- [ ] Homepage loads without errors
- [ ] Admin login works
- [ ] Can add vehicle with images
- [ ] Vehicle appears in catalog
- [ ] Inquiry form submits successfully
- [ ] Request center shows inquiries
- [ ] Language switcher works (FR ↔ EN)
- [ ] WhatsApp widget appears
- [ ] Export requests to CSV/Excel

---

## 🎯 Next Steps

### 1. Change Admin Password (IMPORTANT!)
```
Login → Admin Panel → Profile → Change Password
```

### 2. Configure Site Settings
```
Admin → Site Settings → Update:
- Company name
- Contact info
- WhatsApp number
- Email addresses
```

### 3. Add Content
```
Admin → Vehicles → Add your inventory
Admin → Services → Configure visa/import services
Admin → Translations → Customize text
```

### 4. Customize WhatsApp
```
Edit: includes/whatsapp-widget.php
Update phone number: 25762400920 → Your number
```

### 5. Test All Features
```
- Vehicle detail pages
- Image gallery & lightbox
- Inquiry forms
- Request management
- Export functionality
- Mobile responsiveness
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check credentials in .env file
cat .env
```

### Page Not Loading
```bash
# Check PHP version
php -v  # Should be 7.4+

# Check if port 8000 is in use
lsof -i :8000

# Try different port
php -S localhost:8080
```

### Upload Fails
```bash
# Check directory exists
ls -la uploads/vehicles/

# Fix permissions
chmod -R 775 uploads/

# Check PHP upload settings
php -i | grep upload_max_filesize
```

### Admin Login Fails
```bash
# Check admin_users table
mysql -u root -p suloc_cms -e "SELECT * FROM admin_users;"

# Default credentials
Username: admin
Password: admin123

# Clear browser cookies
```

### Images Not Showing
```bash
# Check SITE_URL in .env
cat .env | grep SITE_URL

# Should match your server URL
# Example: http://localhost:8000

# Check image paths in database
mysql -u root -p suloc_cms -e "SELECT image_url FROM vehicle_images LIMIT 5;"
```

### Language Switcher Not Working
```bash
# Check lang files exist
ls -la lang/

# Should show:
# fr.json
# en.json

# Check permissions
chmod 755 lang/
chmod 644 lang/*.json
```

---

## 📁 Project Structure

```
SULOC_2/
├── admin/              # Admin panel
│   ├── vehicles.php    # Vehicle management
│   ├── requests/       # Request center
│   └── translations.php # Translation management
├── config/             # Configuration
│   ├── config.php      # Main config
│   └── database.php    # Database config
├── includes/           # Reusable components
│   ├── header.php
│   ├── footer.php
│   ├── Translator.php  # Translation system
│   └── ImageOptimizer.php # Image optimization
├── lang/               # Translation files
│   ├── fr.json         # French
│   └── en.json         # English
├── uploads/            # Uploaded files
│   ├── vehicles/
│   ├── services/
│   └── projects/
├── js/                 # JavaScript
│   └── lazy-loading.js # Lazy loading
├── css/                # Stylesheets
│   ├── main.css
│   └── responsive.css
├── .env                # Environment config (create this)
├── index.php           # Homepage
├── vehicles-catalog.php # Vehicle catalog
└── vehicle-detail.php  # Vehicle details
```

---

## 🎨 Features Overview

### Public Features
- ✅ Vehicle catalog with advanced filtering
- ✅ Vehicle detail pages with image gallery
- ✅ Inquiry forms with WhatsApp integration
- ✅ Multilingual support (FR/EN)
- ✅ Mobile-optimized & responsive
- ✅ Lazy loading images
- ✅ Offline support (service worker)

### Admin Features
- ✅ Vehicle management with multi-image upload
- ✅ Unified request center (vehicles, visa, import, payment)
- ✅ CSV/Excel export
- ✅ Translation management
- ✅ Status workflow
- ✅ Quick actions (WhatsApp, email, phone)

### Technical Features
- ✅ Image optimization & WebP conversion
- ✅ Lazy loading with IntersectionObserver
- ✅ Service worker for offline caching
- ✅ Responsive CSS utilities
- ✅ Touch-friendly UI (48px+ targets)
- ✅ Accessibility features

---

## 📞 Need Help?

### Documentation
- **Deployment Guide**: `QUICK_DEPLOY.md`
- **Feature Summary**: `feature-summary.md`
- **cPanel Deployment**: `CPANEL_DEPLOYMENT.md`

### Common Tasks
```bash
# Reset admin password
mysql -u root -p suloc_cms
UPDATE admin_users SET password = MD5('newpassword') WHERE username = 'admin';

# Clear all requests
TRUNCATE TABLE vehicle_requests;
TRUNCATE TABLE visa_requests;
TRUNCATE TABLE import_requests;
TRUNCATE TABLE payment_requests;

# Sync translations from files
Admin → Translations → Sync from Files
```

---

## 🚀 Development Tips

### Hot Reload
```bash
# Use browser-sync for auto-reload
npm install -g browser-sync
browser-sync start --proxy "localhost:8000" --files "**/*.php, **/*.css, **/*.js"
```

### Debug Mode
```env
# In .env file
DISPLAY_ERRORS=1
```

### Test Email
```bash
# Use MailHog for local email testing
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Update .env
SMTP_HOST=localhost
SMTP_PORT=1025

# View emails at: http://localhost:8025
```

---

**Setup Time**: 5 minutes
**Difficulty**: Beginner-friendly
**Support**: Full documentation included

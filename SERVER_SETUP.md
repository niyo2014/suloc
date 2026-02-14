# Server Setup Guide - CICESE Website

## 🔧 Switching from Nginx to Apache

### Option 1: Quick Apache Setup (Recommended)

Run the setup script:
```bash
cd /home/nzimapp/Documents/CICESE
chmod +x apache-setup.sh
./apache-setup.sh
```

This will:
- Install Apache and PHP if needed
- Create virtual host configuration
- Enable required modules
- Set proper permissions
- Restart Apache

### Option 2: Manual Apache Setup

#### Step 1: Install Apache and PHP
```bash
sudo apt update
sudo apt install -y apache2 php php-mysql php-mbstring php-xml
```

#### Step 2: Create Virtual Host
```bash
sudo nano /etc/apache2/sites-available/cicese.conf
```

Paste this configuration:
```apache
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot /home/nzimapp/Documents/CICESE
    
    <Directory /home/nzimapp/Documents/CICESE>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    <FilesMatch \.php$>
        SetHandler application/x-httpd-php
    </FilesMatch>
    
    ErrorLog ${APACHE_LOG_DIR}/cicese_error.log
    CustomLog ${APACHE_LOG_DIR}/cicese_access.log combined
</VirtualHost>
```

#### Step 3: Enable Site and Modules
```bash
sudo a2ensite cicese.conf
sudo a2enmod rewrite
sudo a2enmod php
sudo systemctl restart apache2
```

#### Step 4: Set Permissions
```bash
sudo chown -R www-data:www-data /home/nzimapp/Documents/CICESE
sudo chmod -R 755 /home/nzimapp/Documents/CICESE
```

### Option 3: Fix Nginx Configuration

If you prefer to keep Nginx:

#### Step 1: Stop Nginx (if running)
```bash
sudo systemctl stop nginx
```

#### Step 2: Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/cicese
```

Copy the configuration from `nginx-setup.conf` file.

#### Step 3: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/cicese /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Important**: Update PHP-FPM socket path in the config:
```bash
# Find your PHP version
php -v

# Find PHP-FPM socket
ls /var/run/php/php*-fpm.sock

# Update the config file with correct path
```

## 🧪 Testing After Setup

### Test Apache
```bash
# Check Apache status
sudo systemctl status apache2

# Check if it's listening
sudo netstat -tulpn | grep :80

# Test configuration
sudo apache2ctl configtest
```

### Test Website
1. Visit: `http://localhost/CICESE/`
2. Visit: `http://localhost/CICESE/admin/login.php`
3. Visit: `http://localhost/CICESE/test-db.php`

## 🐛 Troubleshooting

### Apache Issues

**Apache won't start:**
```bash
sudo systemctl status apache2
sudo journalctl -u apache2 -n 50
```

**Permission denied:**
```bash
sudo chown -R www-data:www-data /home/nzimapp/Documents/CICESE
sudo chmod -R 755 /home/nzimapp/Documents/CICESE
```

**PHP not working:**
```bash
# Check PHP module
apache2ctl -M | grep php

# Install PHP module
sudo apt install libapache2-mod-php
sudo a2enmod php
sudo systemctl restart apache2
```

**403 Forbidden:**
- Check directory permissions
- Check Apache configuration `Require all granted`
- Check `.htaccess` file exists

### Nginx Issues

**404 Not Found:**
- Check `root` path in config
- Check `try_files` directive
- Verify PHP-FPM is running: `sudo systemctl status php*-fpm`

**502 Bad Gateway:**
- Check PHP-FPM socket path
- Check PHP-FPM is running
- Check PHP-FPM pool configuration

**PHP files download instead of execute:**
- Check `fastcgi_pass` is correct
- Verify PHP-FPM is running

## 🔄 Switching Between Servers

### Stop One, Start Other

**Switch to Apache:**
```bash
sudo systemctl stop nginx
sudo systemctl disable nginx
sudo systemctl start apache2
sudo systemctl enable apache2
```

**Switch to Nginx:**
```bash
sudo systemctl stop apache2
sudo systemctl disable apache2
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 📝 Quick Reference

### Apache Commands
```bash
sudo systemctl start apache2      # Start
sudo systemctl stop apache2       # Stop
sudo systemctl restart apache2    # Restart
sudo systemctl status apache2     # Status
sudo apache2ctl configtest        # Test config
```

### Nginx Commands
```bash
sudo systemctl start nginx        # Start
sudo systemctl stop nginx         # Stop
sudo systemctl restart nginx      # Restart
sudo systemctl status nginx       # Status
sudo nginx -t                     # Test config
```

## ✅ Verification Checklist

After setup, verify:
- [ ] Server is running
- [ ] Homepage loads: `http://localhost/CICESE/`
- [ ] Admin login loads: `http://localhost/CICESE/admin/login.php`
- [ ] PHP files execute (not download)
- [ ] Database test works: `http://localhost/CICESE/test-db.php`
- [ ] No 404 errors
- [ ] No permission errors

## 🎯 Recommended: Use Apache

For this PHP project, Apache is recommended because:
- ✅ Easier PHP configuration
- ✅ `.htaccess` support out of the box
- ✅ Better compatibility with PHP applications
- ✅ Simpler setup

The setup script (`apache-setup.sh`) will handle everything automatically!



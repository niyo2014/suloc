#!/bin/bash
# Fix Apache Configuration for /CICESE/ path

echo "🔧 Fixing Apache configuration..."

# Backup current config
sudo cp /etc/apache2/sites-available/cicese.conf /etc/apache2/sites-available/cicese.conf.backup
echo "✅ Backup created"

# Create new config with Alias
sudo tee /etc/apache2/sites-available/cicese.conf > /dev/null << 'EOF'
<VirtualHost *:80>
    ServerName localhost
    
    # Main DocumentRoot
    DocumentRoot /home/nzimapp/Documents
    
    # Alias for /CICESE path
    Alias /CICESE /home/nzimapp/Documents/CICESE
    
    <Directory /home/nzimapp/Documents>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
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
EOF

echo "✅ Configuration updated"

# Enable mod_alias
echo "🔌 Enabling mod_alias..."
sudo a2enmod alias

# Test configuration
echo "🧪 Testing configuration..."
sudo apache2ctl configtest

# Restart Apache
echo "🔄 Restarting Apache..."
sudo systemctl restart apache2

echo ""
echo "✅ Done! Test your site at:"
echo "   http://localhost/CICESE/"
echo "   http://localhost/CICESE/admin/login.php"
echo ""


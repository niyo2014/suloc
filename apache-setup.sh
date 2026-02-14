#!/bin/bash
# Apache Setup Script for CICESE Website

echo "🔧 Setting up Apache for CICESE Website..."

# Check if Apache is installed
if ! command -v apache2 &> /dev/null; then
    echo "📦 Installing Apache..."
    sudo apt update
    sudo apt install -y apache2 php php-mysql php-mbstring php-xml
    echo "✅ Apache installed"
else
    echo "✅ Apache is already installed"
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "📦 Installing PHP..."
    sudo apt install -y php php-mysql php-mbstring php-xml
    echo "✅ PHP installed"
else
    echo "✅ PHP is already installed"
fi

# Get the current directory
PROJECT_DIR="/home/nzimapp/Documents/CICESE"
APACHE_CONFIG="/etc/apache2/sites-available/cicese.conf"

echo "📝 Creating Apache virtual host configuration..."

# Create Apache virtual host configuration
sudo tee $APACHE_CONFIG > /dev/null <<EOF
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot $PROJECT_DIR
    
    <Directory $PROJECT_DIR>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # PHP configuration
    <FilesMatch \.php$>
        SetHandler application/x-httpd-php
    </FilesMatch>
    
    # Error and access logs
    ErrorLog \${APACHE_LOG_DIR}/cicese_error.log
    CustomLog \${APACHE_LOG_DIR}/cicese_access.log combined
</VirtualHost>
EOF

echo "✅ Apache configuration created"

# Enable the site
echo "🔗 Enabling Apache site..."
sudo a2ensite cicese.conf

# Enable required Apache modules
echo "🔌 Enabling Apache modules..."
sudo a2enmod rewrite
sudo a2enmod php
sudo a2enmod headers

# Disable default site (optional)
read -p "Disable default Apache site? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo a2dissite 000-default.conf
    echo "✅ Default site disabled"
fi

# Restart Apache
echo "🔄 Restarting Apache..."
sudo systemctl restart apache2

# Check Apache status
if sudo systemctl is-active --quiet apache2; then
    echo "✅ Apache is running"
else
    echo "❌ Apache failed to start. Check logs: sudo journalctl -u apache2"
    exit 1
fi

# Set permissions
echo "🔐 Setting file permissions..."
sudo chown -R www-data:www-data $PROJECT_DIR
sudo find $PROJECT_DIR -type d -exec chmod 755 {} \;
sudo find $PROJECT_DIR -type f -exec chmod 644 {} \;

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Your website should be available at:"
echo "   http://localhost/CICESE/"
echo "   http://localhost/CICESE/admin/login.php"
echo ""
echo "📝 If you need to edit the configuration:"
echo "   sudo nano $APACHE_CONFIG"
echo ""
echo "🔄 To restart Apache:"
echo "   sudo systemctl restart apache2"
echo ""



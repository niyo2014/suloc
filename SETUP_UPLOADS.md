# Setup Image Uploads - SULOC CMS

## 🔧 Quick Setup for Local Development

### Set Directory Permissions

```bash
# Navigate to project directory
cd /home/nzimapp/Documents/SULOC_2

# Create upload directories if they don't exist
mkdir -p uploads/vehicles
mkdir -p uploads/services
mkdir -p uploads/projects

# Set permissions for local development
chmod -R 755 uploads/
chmod -R 775 uploads/vehicles/
chmod -R 775 uploads/services/
chmod -R 775 uploads/projects/
```

---

## 🌐 Setup for Apache Server

If using Apache (not PHP built-in server):

```bash
# Set ownership to Apache user
sudo chown -R www-data:www-data /home/nzimapp/Documents/SULOC_2/uploads

# Set permissions
sudo chmod -R 755 /home/nzimapp/Documents/SULOC_2/uploads
sudo chmod -R 775 /home/nzimapp/Documents/SULOC_2/uploads/vehicles
sudo chmod -R 775 /home/nzimapp/Documents/SULOC_2/uploads/services
sudo chmod -R 775 /home/nzimapp/Documents/SULOC_2/uploads/projects
```

---

## ✅ Verify Setup

### Test Image Upload

1. Start server: `php -S localhost:8000`
2. Login to admin: `http://localhost:8000/admin/login.php`
3. Go to **Vehicles** → **Add Vehicle**
4. Fill form and upload an image
5. Should upload successfully ✅

### Check Permissions

```bash
# Verify directory permissions
ls -la uploads/

# Should show:
# drwxr-xr-x  (755) for uploads/
# drwxrwxr-x  (775) for uploads/vehicles/
```

---

## 📁 Directory Structure

```
uploads/
├── vehicles/     # Vehicle images (auto-optimized to WebP)
├── services/     # Service images
└── projects/     # Project images
```

---

## 🐛 Troubleshooting

### Upload Fails with "Permission Denied"

```bash
# Fix permissions
chmod -R 775 uploads/

# If using Apache
sudo chown -R www-data:www-data uploads/
```

### Upload Fails with "Directory Not Found"

```bash
# Create missing directories
mkdir -p uploads/vehicles uploads/services uploads/projects
chmod -R 775 uploads/
```

### Images Not Showing on Website

```bash
# Check SITE_URL in .env
cat .env | grep SITE_URL

# Should match your server URL
# Local: http://localhost:8000
# Production: https://yourdomain.com
```

### File Size Too Large

```bash
# Check PHP upload limits
php -i | grep upload_max_filesize
php -i | grep post_max_size

# Increase limits in php.ini or .htaccess
upload_max_filesize = 10M
post_max_size = 10M
```

---

## 🎨 Image Optimization Features

SULOC automatically optimizes uploaded images:

- ✅ **Compression**: Reduces file size (85% quality)
- ✅ **WebP Conversion**: 20-30% smaller than JPEG
- ✅ **Resize**: Max 1920x1080 pixels
- ✅ **Lazy Loading**: Images load on scroll

No manual optimization needed!

---

## 📊 Upload Limits

Default limits (configurable in `includes/ImageOptimizer.php`):

- **Max file size**: 5MB
- **Max dimensions**: 1920x1080
- **Allowed formats**: JPG, PNG, GIF, WebP
- **Output quality**: 85% (JPEG), 80% (WebP)

---

## 🔒 Security Notes

- Upload directory is **read-only** for web users
- Only image files are accepted
- File type validation on server-side
- Unique filenames prevent overwrites
- `.htaccess` prevents PHP execution in uploads/

---

**Need Help?** Check `QUICK_START.md` for full setup guide.

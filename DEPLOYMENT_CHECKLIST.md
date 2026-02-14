# ✅ cPanel Deployment Quick Checklist

Use this checklist to ensure everything is configured correctly for production deployment.

## Pre-Deployment

- [ ] All files uploaded to cPanel `public_html` (or domain root)
- [ ] Database created in cPanel MySQL Databases
- [ ] Database user created and granted ALL PRIVILEGES
- [ ] Database schema imported (tables created)

## Configuration Files

- [ ] `.env` file created in project root with correct values:
  - [ ] `DB_HOST=localhost`
  - [ ] `DB_NAME=` (full cPanel database name with username prefix)
  - [ ] `DB_USER=` (full cPanel database user with username prefix)
  - [ ] `DB_PASS=` (database password)
  - [ ] `SITE_URL=` (your actual domain with https://)
  - [ ] `DISPLAY_ERRORS=0` (for production)
- [ ] `.env` file permissions set to **600** (owner read/write only)

## Directory Permissions

- [ ] `uploads/` directory exists
- [ ] `uploads/project/` directory exists
- [ ] `uploads/services/` directory exists
- [ ] `uploads/team/` directory exists
- [ ] All upload directories have permissions **755** (or **775** if needed)
- [ ] `.htaccess` file exists in `uploads/` directory

## Security

- [ ] Default admin password changed (username: `admin`)
- [ ] Error display disabled (`DISPLAY_ERRORS=0` in `.env`)
- [ ] SSL certificate installed (HTTPS enabled)
- [ ] `.env` file not accessible via web (check: `https://yourdomain.com/.env` should return 403)

## Testing

- [ ] Database connection test: `https://yourdomain.com/test-db.php` shows SUCCESS
- [ ] Frontend loads: `https://yourdomain.com/index.php` displays correctly
- [ ] Admin login works: `https://yourdomain.com/admin/login.php`
- [ ] Image upload works: Can upload images in Projects section
- [ ] Images display: Uploaded images appear on frontend
- [ ] Contact form works: Can submit contact form successfully

## Post-Deployment

- [ ] Add initial content (services, projects, team members)
- [ ] Configure site settings in admin panel
- [ ] Test all admin functions (add/edit/delete)
- [ ] Verify mobile responsiveness
- [ ] Check error logs for any issues
- [ ] Set up regular backups in cPanel

## Troubleshooting Quick Reference

**Database connection fails?**
→ Check `.env` file has correct database credentials
→ Verify database user has ALL PRIVILEGES
→ Check database name includes cPanel username prefix

**Image upload fails?**
→ Check `uploads/` directory permissions (755 or 775)
→ Verify subdirectories exist and have correct permissions
→ Check PHP upload limits in cPanel (should be at least 5MB)

**500 Internal Server Error?**
→ Check cPanel error logs
→ Verify `.htaccess` file is correct
→ Check PHP version (should be 7.4+)
→ Verify all files uploaded correctly

**Images not displaying?**
→ Check `SITE_URL` in `.env` matches your domain
→ Verify image paths in database
→ Check `uploads/` directory is web-accessible

---

**Need Help?** Refer to `CPANEL_DEPLOYMENT.md` for detailed instructions.




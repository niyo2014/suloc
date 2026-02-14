# Testing Guide - CICESE Website

## 🧪 Quick Testing Checklist

### Step 1: Environment Setup

1. **Start PHP Server** (if not using Apache/Nginx):
   ```bash
   cd /home/nzimapp/Documents/CICESE
   php -S localhost:8000
   ```

2. **Create Database**:
   ```sql
   CREATE DATABASE cicese_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Update Database Credentials** in `config/database.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'cicese_cms');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   ```

### Step 2: Test Database Connection

1. Visit: `http://localhost:8000/config/test-db.php` (if you create the test file)
   OR
2. Visit: `http://localhost:8000/index.php` - The database tables should auto-create on first load

**Expected Result**: 
- No errors
- Database tables created automatically
- Page loads successfully

### Step 3: Test Frontend (Public Site)

1. **Homepage**: Visit `http://localhost:8000/index.php`
   - ✅ Header and navigation visible
   - ✅ Hero section displays
   - ✅ Services section shows (default services if DB empty)
   - ✅ About section visible
   - ✅ Team section shows
   - ✅ Projects section displays
   - ✅ Contact form visible

2. **Test Navigation**:
   - ✅ Click all navigation links
   - ✅ Smooth scrolling to sections
   - ✅ Mobile menu works (resize browser)

3. **Test Contact Form**:
   - Fill out the contact form
   - Submit it
   - ✅ Should show success message
   - ✅ Data saved to database

### Step 4: Test Admin Dashboard

1. **Login**: Visit `http://localhost:8000/admin/login.php`
   - Username: `admin`
   - Password: `admin123`
   - ✅ Should redirect to dashboard

2. **Dashboard**: 
   - ✅ Statistics cards visible
   - ✅ Recent submissions shown
   - ✅ Navigation menu works

3. **Services Management** (`/admin/services.php`):
   - ✅ Click "Ajouter un Service"
   - ✅ Fill form and save
   - ✅ Service appears in list
   - ✅ Edit a service
   - ✅ Delete a service (with confirmation)

4. **Projects Management** (`/admin/projects.php`):
   - ✅ Add a new project
   - ✅ Edit project
   - ✅ Change project status
   - ✅ Delete project

5. **Team Management** (`/admin/team.php`):
   - ✅ Add team member
   - ✅ Edit member
   - ✅ Delete member

6. **Contact Submissions** (`/admin/submissions.php`):
   - ✅ View submitted forms
   - ✅ Change status (new/read/replied)
   - ✅ View message details

7. **Settings** (`/admin/settings.php`):
   - ✅ Update contact information
   - ✅ Save settings
   - ✅ Verify changes on frontend

### Step 5: Test Dynamic Content

1. **Add Content via Admin**:
   - Add 2-3 services
   - Add 2-3 projects
   - Add 2-3 team members

2. **Verify on Frontend**:
   - Visit `index.php`
   - ✅ New services appear
   - ✅ New projects displayed
   - ✅ New team members shown

### Step 6: Test Form Submission

1. **Submit Contact Form**:
   - Fill all required fields
   - Submit form
   - ✅ Success message appears
   - ✅ Form data in admin submissions

2. **Check Database**:
   ```sql
   SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 1;
   ```
   - ✅ New submission recorded

### Step 7: Test Responsive Design

1. **Resize Browser**:
   - Desktop view (1920px+)
   - Tablet view (768px)
   - Mobile view (375px)
   - ✅ Layout adapts correctly
   - ✅ Mobile menu works

### Step 8: Test JavaScript

1. **Loading Screen**:
   - ✅ Shows on page load
   - ✅ Hides after 1 second

2. **Scroll Effects**:
   - ✅ Header shadow on scroll
   - ✅ Animations trigger on scroll

3. **Chat Widget**:
   - ✅ Opens on button click
   - ✅ Closes properly

4. **Service/Project Cards**:
   - ✅ Clickable
   - ✅ Navigate to detail pages

## 🐛 Common Issues & Solutions

### Issue: "Database connection failed"
**Solution**: 
- Check database credentials in `config/database.php`
- Verify MySQL is running
- Ensure database exists

### Issue: "Tables not created"
**Solution**:
- Check PHP error logs
- Verify database user has CREATE privileges
- Manually run SQL from `config/database.php`

### Issue: "Admin login not working"
**Solution**:
- Verify admin user exists in database
- Check password hash
- Clear browser cookies/session

### Issue: "Form submission fails"
**Solution**:
- Check JavaScript console for errors
- Verify `includes/submit-contact.php` path
- Check PHP error logs

### Issue: "CSS/JS not loading"
**Solution**:
- Ensure auto-detected `SITE_URL` matches the domain/port (override via `.env` if needed)
- Check file paths are correct
- Clear browser cache

## ✅ Success Criteria

Everything is working if:
- ✅ Frontend loads without errors
- ✅ Admin dashboard accessible
- ✅ Can add/edit/delete content
- ✅ Changes reflect on frontend
- ✅ Contact form submits successfully
- ✅ All navigation works
- ✅ Responsive design works
- ✅ No console errors

## 📝 Testing Checklist

Print this checklist and mark as you test:

- [ ] Database connection works
- [ ] Frontend homepage loads
- [ ] Navigation works
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Can add service
- [ ] Can edit service
- [ ] Can delete service
- [ ] Can add project
- [ ] Can edit project
- [ ] Can add team member
- [ ] Settings save correctly
- [ ] Submissions visible in admin
- [ ] Content appears on frontend
- [ ] Mobile responsive works
- [ ] JavaScript animations work
- [ ] No console errors

## 🚀 Next Steps After Testing

1. **Change Admin Password**: Update in database or add password change feature
2. **Add Real Content**: Replace default content with actual CICESE content
3. **Upload Images**: Add real project/service images
4. **Configure Email**: Set up email notifications for form submissions
5. **Production Setup**: Configure for production environment


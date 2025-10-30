# 🎯 FIRST TIME SETUP - WINDOWS POWERSHELL

## Prerequisites Check ✅

Before starting, make sure you have installed:

- [ ] PHP 8.2 or higher (`php -v`)
- [ ] Composer (`composer -V`)
- [ ] Node.js 18+ (`node -v`)
- [ ] NPM (`npm -v`)
- [ ] MySQL or SQLite

---

## 🚀 Step-by-Step Setup (First Time)

### Step 1: Install Dependencies

```powershell
# Install PHP/Laravel dependencies (this may take 2-3 minutes)
composer install

# Install Node.js/React dependencies (this may take 3-5 minutes)
npm install
```

Wait for both to complete successfully before proceeding.

---

### Step 2: Environment Configuration

```powershell
# Copy the environment configuration file
Copy-Item .env.example .env

# Generate Laravel application key
php artisan key:generate
```

---

### Step 3: Database Setup

#### Option A: SQLite (Recommended for Development)

```powershell
# Create empty SQLite database file
New-Item -ItemType File -Path database\database.sqlite -Force

# Update .env file - Open in your editor and change these lines:
# DB_CONNECTION=sqlite
# Comment out or remove: DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
```

Edit `.env` file and set:

```env
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

#### Option B: MySQL

```powershell
# Make sure MySQL is running
# Create a new database named 'laravel12coreui'
```

Edit `.env` file and configure:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel12coreui
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

---

### Step 4: Run Database Migrations

```powershell
# Create database tables
php artisan migrate
```

You should see output like:

```
Migration table created successfully.
Migrating: 0001_01_01_000000_create_users_table
Migrated:  0001_01_01_000000_create_users_table
...
```

---

### Step 5: Verify Installation

```powershell
# Check if everything is working
php artisan --version
# Should show: Laravel Framework 12.x.x

npm list react
# Should show React version

# Optional: Run tests
php artisan test
```

---

### Step 6: Start Development Servers

**IMPORTANT: You need TWO PowerShell terminal windows!**

#### Terminal 1 - Laravel Backend Server

```powershell
# Navigate to project folder (if not already there)
cd j:\Project\laravel12coreui

# Start Laravel development server
php artisan serve
```

You should see:

```
INFO  Server running on [http://127.0.0.1:8000].
Press Ctrl+C to stop the server
```

**Keep this terminal open!** Don't close it.

---

#### Terminal 2 - Vite Frontend Server

Open a NEW PowerShell window:

```powershell
# Navigate to project folder
cd j:\Project\laravel12coreui

# Start Vite development server with hot reload
npm run dev
```

You should see:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  Laravel: http://localhost:8000
```

**Keep this terminal open too!** Don't close it.

---

### Step 7: Open in Browser 🎉

Open your browser and visit:

**http://localhost:8000**

You should see:

- ✅ Laravel + React + CoreUI Dashboard
- ✅ Sidebar with navigation
- ✅ Dashboard page with charts
- ✅ Users page with data table

---

## 🎯 Daily Development Workflow

After the first setup, every day you only need to:

### Option 1: Manual Start (2 terminals)

**Terminal 1:**

```powershell
cd j:\Project\laravel12coreui
php artisan serve
```

**Terminal 2:**

```powershell
cd j:\Project\laravel12coreui
npm run dev
```

### Option 2: PowerShell Script (Automated)

Create a file `start-dev.ps1`:

```powershell
# Start Laravel server in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; php artisan serve"

# Wait a moment
Start-Sleep -Seconds 2

# Start Vite server in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

# Wait a moment
Start-Sleep -Seconds 3

# Open browser
Start-Process "http://localhost:8000"
```

Then run:

```powershell
.\start-dev.ps1
```

---

## 🔍 Verification Checklist

- [ ] `composer install` completed successfully
- [ ] `npm install` completed successfully
- [ ] `.env` file exists and configured
- [ ] Application key generated
- [ ] Database configured (SQLite or MySQL)
- [ ] Migrations ran successfully
- [ ] Laravel server running on port 8000
- [ ] Vite server running (watch mode)
- [ ] Browser shows dashboard at http://localhost:8000
- [ ] Hot reload works (try editing a file)

---

## 🐛 Common Issues & Solutions

### Issue: "composer: command not found"

**Solution:** Install Composer from https://getcomposer.org

### Issue: "npm: command not found"

**Solution:** Install Node.js from https://nodejs.org

### Issue: "Address already in use (port 8000)"

**Solution:**

```powershell
# Use different port
php artisan serve --port=8080
# Then visit http://localhost:8080
```

### Issue: "SQLSTATE[HY000] [2002] Connection refused"

**Solution:**

- Check MySQL is running
- Verify credentials in `.env`
- Or switch to SQLite (easier)

### Issue: Vite shows blank page

**Solution:**

```powershell
# Stop Vite (Ctrl+C)
# Clear cache and restart
Remove-Item -Recurse -Force node_modules\.vite
npm run dev
```

### Issue: Changes not reflecting in browser

**Solution:**

- Make sure Vite is running (`npm run dev`)
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for errors

### Issue: Permission denied errors

**Solution:**

```powershell
# Run PowerShell as Administrator
# Or check folder permissions
```

---

## 📝 Next Steps After Setup

1. **Explore the Dashboard**

   - Click around the interface
   - Check the sidebar navigation
   - View the Dashboard and Users pages

2. **Try Hot Reload**

   - Edit `resources/js/views/dashboard/Dashboard.tsx`
   - Change some text
   - Save the file
   - See instant update in browser!

3. **Check the API**

   - Open browser DevTools (F12)
   - Go to Network tab
   - Navigate to Users page
   - See the API call to `/api/demo/users`

4. **Start Development**
   - Read `DEVELOPMENT.md` for guide
   - Create your first component
   - Add a new route
   - Build your features!

---

## 🆘 Still Having Issues?

1. Check `README.md` for overview
2. Read `TROUBLESHOOTING.md` (if available)
3. Review Laravel logs: `storage/logs/laravel.log`
4. Check browser console for JavaScript errors
5. Verify all prerequisites are installed

---

## ✨ You're Ready!

Your development environment is now set up and ready to go! 🎉

**Happy Coding!** 🚀

---

**Quick Reference:**

- Project URL: http://localhost:8000
- Laravel API: http://localhost:8000/api
- Vite HMR: http://localhost:5173 (auto-proxied)
- Documentation: See all `*.md` files in root folder

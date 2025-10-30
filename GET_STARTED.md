# Laravel 12 + React + TypeScript + CoreUI

# Getting Started in 5 Minutes

## 🚀 Quick Installation (Windows PowerShell)

### Step 1: Install Dependencies (2-3 minutes)

```powershell
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### Step 2: Setup Environment (1 minute)

```powershell
# Copy environment file
Copy-Item .env.example .env

# Generate application key
php artisan key:generate
```

### Step 3: Configure Database (1 minute)

**Option A: Using SQLite (Easiest)**

```powershell
# Edit .env file and set:
# DB_CONNECTION=sqlite
# DB_DATABASE=database/database.sqlite

# Create database file
New-Item -ItemType File -Path database\database.sqlite -Force

# Run migrations
php artisan migrate
```

**Option B: Using MySQL**

```powershell
# Edit .env file and configure:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel12coreui
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Create database in MySQL
# Then run migrations
php artisan migrate
```

### Step 4: Start Development Servers (30 seconds)

**Open TWO PowerShell terminals:**

**Terminal 1 - Laravel Backend:**

```powershell
php artisan serve
```

**Terminal 2 - React Frontend:**

```powershell
npm run dev
```

### Step 5: Open Browser

Visit: **http://localhost:8000**

You should see the Laravel + React + CoreUI dashboard! 🎉

---

## 📱 What You'll See

- **Dashboard** - Overview with charts and statistics
- **Users** - User list with sample data
- **Sidebar Navigation** - Professional CoreUI sidebar
- **Responsive Design** - Works on all devices

---

## 🔥 Hot Reload Enabled

Make changes to any file and see them instantly:

- Edit `resources/js/views/**/*.tsx` for React components
- Edit `routes/api.php` for API endpoints
- Changes auto-refresh in browser!

---

## 🎯 Next Steps

1. **Add Authentication**

   ```powershell
   # Uncomment Sanctum routes in config
   ```

2. **Create Your First Page**

   - Copy `resources/js/views/dashboard/Dashboard.tsx`
   - Create `resources/js/views/yourpage/YourPage.tsx`
   - Add route in `resources/js/App.tsx`

3. **Add API Endpoint**
   - Add route in `routes/api.php`
   - Create controller: `php artisan make:controller Api/YourController`

---

## 🐛 Troubleshooting

**Port 8000 already in use?**

```powershell
php artisan serve --port=8080
```

**Vite not working?**

```powershell
# Stop Vite (Ctrl+C) and restart
npm run dev
```

**Database error?**

```powershell
# Reset database
php artisan migrate:fresh
```

**Clear cache**

```powershell
php artisan cache:clear
php artisan config:clear
```

---

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Development Guide**: See `DEVELOPMENT.md`
- **Deployment Guide**: See `DEPLOYMENT.md`

---

**Happy Coding! 🚀**

Built with ❤️ using Laravel 12, React 18, TypeScript, and CoreUI

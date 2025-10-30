# Installation Guide

## Prerequisites

Make sure you have the following installed:

- **PHP 8.2+** with required extensions
- **Composer** (latest version)
- **Node.js 18+** and npm
- **MySQL/MariaDB** or **PostgreSQL**

## Step-by-Step Installation

### 1. Clone the Project

```bash
git clone <repository-url>
cd laravel12coreui
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database

Edit `.env` file and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel12coreui
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 5. Run Database Migrations

```bash
php artisan migrate
```

### 6. Install Node.js Dependencies

```bash
npm install
```

### 7. Build Frontend Assets

```bash
# For development (with hot reload)
npm run dev

# For production
npm run build
```

### 8. Start the Development Server

Open two terminal windows:

**Terminal 1 - Laravel Server:**

```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**

```bash
npm run dev
```

### 9. Access the Application

Open your browser and visit: `http://localhost:8000`

## Common Issues

### Port Already in Use

If port 8000 is already in use, you can specify a different port:

```bash
php artisan serve --port=8080
```

### Permission Issues

If you encounter permission issues on Linux/Mac:

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Node Modules Issues

If you have issues with node modules:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After installation:

1. Configure your application settings in `.env`
2. Set up Laravel Sanctum for API authentication (if needed)
3. Customize CoreUI theme and components
4. Add your own routes and views
5. Configure email, cache, and queue settings

## Development Workflow

1. Run `php artisan serve` to start Laravel server
2. Run `npm run dev` to start Vite dev server with hot reload
3. Make changes to PHP or React files
4. Changes will auto-reload in the browser

## Production Deployment

Before deploying to production:

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
chmod -R 755 storage bootstrap/cache
```

Make sure to set `APP_DEBUG=false` in your production `.env` file.

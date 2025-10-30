# Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

- [ ] Test application locally
- [ ] Run all tests (`php artisan test`)
- [ ] Update `.env.example` with all required variables
- [ ] Review security settings
- [ ] Update documentation
- [ ] Create backup of current production (if updating)

### Server Requirements

**Minimum Requirements:**

- PHP 8.2 or higher
- MySQL 5.7+ / PostgreSQL 9.6+ / MariaDB 10.3+
- Node.js 18+ and npm
- Composer 2.x
- Nginx or Apache
- SSL Certificate (recommended)

**PHP Extensions:**

- BCMath
- Ctype
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PDO
- Tokenizer
- XML

### Deployment Steps

#### 1. Server Setup

**Ubuntu/Debian:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo apt install php8.2-fpm php8.2-cli php8.2-common php8.2-mysql php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath

# Install MySQL
sudo apt install mysql-server

# Install Nginx
sudo apt install nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

#### 2. Clone Repository

```bash
cd /var/www
sudo git clone <repository-url> laravel12coreui
cd laravel12coreui
sudo chown -R www-data:www-data /var/www/laravel12coreui
```

#### 3. Install Dependencies

```bash
# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node dependencies
npm ci

# Build frontend
npm run build
```

#### 4. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit .env with production settings
nano .env
```

**Important `.env` Settings:**

```env
APP_NAME="Your App Name"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=strong_password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

#### 5. Application Setup

```bash
# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Link storage
php artisan storage:link

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize
php artisan optimize
```

#### 6. Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/laravel12coreui
sudo chmod -R 755 /var/www/laravel12coreui
sudo chmod -R 775 /var/www/laravel12coreui/storage
sudo chmod -R 775 /var/www/laravel12coreui/bootstrap/cache
```

#### 7. Nginx Configuration

Create `/etc/nginx/sites-available/laravel12coreui`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/laravel12coreui/public;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/your_cert.crt;
    ssl_certificate_key /etc/ssl/private/your_key.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/laravel12coreui /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 8. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

#### 9. Setup Process Manager (Optional)

For queue workers, use Supervisor:

```bash
sudo apt install supervisor

# Create config file
sudo nano /etc/supervisor/conf.d/laravel-worker.conf
```

Add:

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/laravel12coreui/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/laravel12coreui/storage/logs/worker.log
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-worker:*
```

### Post-Deployment

#### 1. Test Application

- Visit your domain
- Test all major features
- Check error logs: `tail -f storage/logs/laravel.log`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`

#### 2. Setup Monitoring

- Configure application monitoring (New Relic, Sentry, etc.)
- Set up uptime monitoring
- Configure backup system

#### 3. Performance Optimization

```bash
# Enable OPcache
sudo nano /etc/php/8.2/fpm/php.ini
```

Add/modify:

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
```

```bash
sudo systemctl restart php8.2-fpm
```

### Updating the Application

```bash
# Pull latest code
cd /var/www/laravel12coreui
git pull origin main

# Install dependencies
composer install --optimize-autoloader --no-dev
npm ci
npm run build

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Restart services
sudo systemctl reload php8.2-fpm
sudo systemctl reload nginx
```

### Backup Strategy

**Daily Automated Backup:**

```bash
#!/bin/bash
# /usr/local/bin/backup-laravel.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/laravel12coreui"
APP_DIR="/var/www/laravel12coreui"

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u username -p'password' database_name > $BACKUP_DIR/db_$DATE.sql

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz $APP_DIR

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

Add to crontab:

```bash
sudo crontab -e
```

```
0 2 * * * /usr/local/bin/backup-laravel.sh
```

### Troubleshooting

**500 Internal Server Error:**

- Check Laravel logs: `storage/logs/laravel.log`
- Check Nginx error logs: `/var/log/nginx/error.log`
- Verify file permissions
- Clear all caches

**White Screen:**

- Set `APP_DEBUG=true` temporarily to see errors
- Check PHP-FPM is running: `sudo systemctl status php8.2-fpm`

**Assets Not Loading:**

- Verify `APP_URL` in `.env` is correct
- Run `npm run build` again
- Check Nginx is serving files from `public/` directory

### Security Best Practices

1. Keep software updated
2. Use strong database passwords
3. Enable firewall (UFW)
4. Disable directory listing
5. Use HTTPS only
6. Implement rate limiting
7. Regular security audits
8. Keep backups off-site

### Rollback Procedure

```bash
# If deployment fails, rollback:
cd /var/www/laravel12coreui
git reset --hard HEAD~1
composer install --optimize-autoloader --no-dev
npm ci && npm run build
php artisan migrate:rollback
php artisan cache:clear
php artisan config:cache
```

---

**Support:** For issues, check the documentation or contact your system administrator.

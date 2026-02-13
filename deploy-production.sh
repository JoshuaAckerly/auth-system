#!/bin/bash
# Production Deployment Script for Auth System
# Run this on your AWS EC2 instance

set -e

# Configuration
SSR_PORT=13721
PROJECT_NAME="auth-system"
DEPLOY_PATH="/var/www/auth-system"
PHP_VERSION="8.3"

echo "🚀 Starting production deployment for $PROJECT_NAME"
echo "===================================================="

# Navigate to project directory
cd "$DEPLOY_PATH"

# Pull latest code from Git
echo "📦 Pulling latest code from Git..."
git pull origin main

# Install/Update PHP dependencies (production mode)
echo "🐘 Installing PHP dependencies..."
composer install --no-interaction --prefer-dist --no-progress --optimize-autoloader --classmap-authoritative --no-dev

# Install/Update Node dependencies
echo "📦 Installing Node dependencies..."
npm ci --production=false

# Build frontend assets with SSR
echo "🎨 Building frontend assets and SSR bundle..."
npm run build:ssr

# Ensure SSR environment values exist
if ! grep -q "^INERTIA_SSR_PORT=" .env; then
    echo "INERTIA_SSR_PORT=$SSR_PORT" >> .env
fi

if ! grep -q "^INERTIA_SSR_ENABLED=" .env; then
    echo "INERTIA_SSR_ENABLED=true" >> .env
fi

# Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Ensure writable directories and permissions
echo "🔒 Setting permissions..."
sudo mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
sudo find storage bootstrap/cache -type d -exec chmod 775 {} \;
sudo find storage bootstrap/cache -type f ! -name '.gitignore' -exec chmod 664 {} \;

# Cache Laravel artifacts as the web server user
echo "⚡ Optimizing Laravel..."
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache
sudo -u www-data php artisan event:cache

# Restart PHP-FPM
echo "🔄 Restarting PHP-FPM..."
sudo systemctl reload php${PHP_VERSION}-fpm

# Resolve SSR bundle path
SSR_BUNDLE=""
for candidate in bootstrap/ssr/ssr.js bootstrap/ssr/ssr.mjs bootstrap/ssr/app.js public/js/ssr.js; do
    if [ -f "$candidate" ]; then
        SSR_BUNDLE="$candidate"
        break
    fi
done

# Manage SSR process with PM2
echo "🌟 Managing SSR server with PM2..."
if [ -n "$SSR_BUNDLE" ]; then
    if pm2 list | grep -q "$PROJECT_NAME-ssr"; then
        pm2 restart "$PROJECT_NAME-ssr"
    else
        pm2 start "$SSR_BUNDLE" --name "$PROJECT_NAME-ssr" -- --port=$SSR_PORT
        pm2 save
    fi
else
    echo "⚠️ No SSR bundle found. Skipping PM2 SSR start/restart."
fi

# Restart queue workers if configured
if grep -q "QUEUE_CONNECTION=redis\|QUEUE_CONNECTION=database" .env; then
    echo "🔄 Restarting queue workers..."
    php artisan queue:restart
fi

echo ""
echo "✅ Production deployment completed successfully!"
echo "🔧 SSR configured on port: $SSR_PORT"

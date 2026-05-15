#!/bin/sh

# Exit on error
set -e

# Initialize storage directory if it doesn't exist
if [ ! -d /var/www/storage ]; then
    cp -r /var/www/storage-init /var/www/storage
    chown -R www-data:www-data /var/www/storage
fi

# Run Laravel-specific initialization
php artisan config:cache
php artisan route:cache
php artisan event:cache

# Execute the original command (php-fpm by default)
exec "$@"

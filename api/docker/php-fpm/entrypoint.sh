#!/bin/sh

set -e

if [ ! -d /var/www/storage/framework ]; then
    cp -r /var/www/storage-init/. /var/www/storage/
fi

mkdir -p /var/www/storage/framework/cache/data \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/logs \
    /var/www/bootstrap/cache

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

php artisan config:clear
php artisan migrate --force --no-interaction
php artisan config:cache
php artisan route:cache
php artisan event:cache

exec "$@"

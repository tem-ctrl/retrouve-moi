#!/bin/sh

set -e

if [ ! -d /var/www/storage/framework ]; then
    cp -r /var/www/storage-init/. /var/www/storage/
fi

mkdir -p /var/www/storage/framework/cache/data \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/logs \
    /var/www/bootstrap/cache \
    /var/www/public/uploads/li \
    /var/www/public/uploads/u \
    /var/www/public/uploads/mp \
    /var/www/public/uploads/s

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public/uploads

runuser -u www-data -- php artisan config:clear
runuser -u www-data -- php artisan migrate --force --no-interaction
runuser -u www-data -- php artisan config:cache
runuser -u www-data -- php artisan route:cache
runuser -u www-data -- php artisan event:cache

exec php-fpm

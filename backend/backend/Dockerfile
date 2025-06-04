FROM php:8.3-apache

# Instalar extensiones necesarias + Node.js y npm
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev zip libpng-dev libonig-dev libxml2-dev curl nodejs npm default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql zip

# Activar mod_rewrite para Laravel
RUN a2enmod rewrite

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar el contenido del proyecto
COPY . /var/www/html

# Establecer permisos para Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configuración de Apache personalizada
COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

# Instalar Composer (usamos imagen oficial como fuente)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Instalar dependencias y librerías necesarias de Laravel
RUN composer install \
 && composer require sendgrid/sendgrid \
 && composer require symfony/mailer \
 && composer require --dev phpunit/phpunit \
 && vendor/bin/phpunit --version


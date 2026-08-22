FROM php:8.2-apache

# Instalar extensiones necesarias y utilidades
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    libzip-dev \
    zip \
    curl && \
    docker-php-ext-install pdo pdo_mysql && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Activar mod_rewrite y headers para Laravel
RUN a2enmod rewrite headers

# Establecer directorio de trabajo
WORKDIR /var/www

# Copiar todo el proyecto Laravel
COPY . /var/www/


# Copiar archivo de configuración Apache (opcional)
COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

# Ajustar permisos para Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache && \
    find /var/www/public -name ".htaccess" -exec chown www-data:www-data {} \; && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Instalar Composer y dependencias Laravel
RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/bin/composer
RUN composer install --no-interaction --optimize-autoloader
RUN composer require fruitcake/laravel-cors
RUN composer dump-autoload
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Exponer puerto 80
EXPOSE 80

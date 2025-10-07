FROM php:8.2-apache

# Instalar extensiones necesarias y utilidades
RUN apt-get update && apt-get install -y unzip git libzip-dev zip curl && \
    docker-php-ext-install pdo pdo_mysql && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Activar mod_rewrite para Laravel
RUN a2enmod rewrite

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar el proyecto
COPY . /var/www/html

# Copiar archivo de configuración Apache (opcional)
COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

# Ajustar permisos para Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Instalar Composer y dependencias Laravel + paquetes de correo
RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/bin/composer  
RUN composer install --no-interaction --optimize-autoloader \
    && composer require sendinblue/api-v3-sdk \
    && composer require symfony/mailer
# Activar mod_rewrite y headers para Laravel
RUN a2enmod rewrite headers

# Exponer puerto 80
EXPOSE 80

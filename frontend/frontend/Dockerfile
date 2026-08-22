FROM node:20-alpine AS build
WORKDIR /app

# Solo copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias (esto queda en caché si no cambian)
RUN npm install

# Ahora copiar el resto del proyecto
COPY . .

# Construir producción
RUN npm run build -- --configuration production

# Producción con Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

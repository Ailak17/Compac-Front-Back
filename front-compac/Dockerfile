# Etapa 1: Construcción
FROM node:18 AS builder

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

# Copia los archivos estáticos generados en la etapa de construcción a Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia el archivo de configuración de Nginx si es necesario
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80 para el contenedor
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

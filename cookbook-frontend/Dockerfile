# Stage 1: Build React App
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Default backend URL (can be overridden by environment variable)
ENV BACKEND_URL=http://app:8080

EXPOSE 80

# Nginx will automatically substitute variables in templates/*.template into /etc/nginx/conf.d/
CMD ["nginx", "-g", "daemon off;"]

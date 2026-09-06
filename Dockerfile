# Stage 1: Build Angular app
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies required to build the Angular application
RUN npm ci

# Copy source code
COPY frontend/ ./

# Build Angular app for production
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from builder stage
COPY --from=builder /app/dist/flowio-angular/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider --quiet http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

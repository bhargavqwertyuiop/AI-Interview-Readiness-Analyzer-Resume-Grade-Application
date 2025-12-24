# Multi-stage Dockerfile for Vite-built React app
# Builder: install dependencies and build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build


# Production image: serve static files with nginx
FROM nginx:stable-alpine AS production

# Add curl for healthchecks
RUN apk add --no-cache curl

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Use a custom nginx config if present
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Simple healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

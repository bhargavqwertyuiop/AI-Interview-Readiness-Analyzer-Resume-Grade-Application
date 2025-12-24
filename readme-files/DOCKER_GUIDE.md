# Docker Setup Guide

## Overview

This application is configured to run in Docker using a multi-stage build process. The Dockerfile optimizes build time and production image size by separating the build stage from the runtime stage.

## Files Included

- **Dockerfile** - Multi-stage Docker image definition
- **docker-compose.yml** - Docker Compose configuration for easy deployment
- **.dockerignore** - Excludes unnecessary files from Docker build context

## Quick Start

### Build and Run with Docker Compose (Recommended)

```bash
# Build the Docker image and start the container
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# Stop the application
docker-compose down

# View logs
docker-compose logs -f
```

The application will be accessible at `http://localhost:3000`

### Build and Run with Docker CLI

```bash
# Build the Docker image
docker build -t interview-readiness-analyzer .

# Run the container
docker run -p 3000:3000 interview-readiness-analyzer

# Run in detached mode
docker run -d -p 3000:3000 --name interview-app interview-readiness-analyzer

# Stop the container
docker stop interview-app

# Remove the container
docker rm interview-app

# View logs
docker logs -f interview-app
```

## Docker Architecture

### Multi-Stage Build Process

The Dockerfile uses a two-stage build process for optimal image size and build time:

**Stage 1: Builder**
- Base image: `node:20-alpine`
- Installs dependencies
- Builds the React/Vite application
- Output: Optimized production-ready `dist` folder

**Stage 2: Production**
- Base image: `node:20-alpine`
- Installs `serve` for serving static files
- Copies built application from Stage 1
- Exposed port: 3000
- Health check: Monitors application availability

### Image Size Optimization

- Alpine Linux base image (smaller than standard Linux)
- Multi-stage build eliminates build tools from final image
- `serve` is a lightweight static file server
- `.dockerignore` excludes unnecessary files

## Environment Configuration

### Default Settings
- **Port**: 3000
- **Environment**: production
- **Restart Policy**: unless-stopped (in docker-compose)
- **Health Check**: Every 30 seconds

### Customizing Port

To use a different port, modify `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Expose container port 3000 on host port 8080
```

Or with Docker CLI:

```bash
docker run -p 8080:3000 interview-readiness-analyzer
```

## Health Checks

The container includes a built-in health check that:
- Runs every 30 seconds
- Starts checking after 5 seconds
- Allows 3 consecutive failures before marking container unhealthy
- Timeout: 3 seconds per check

View health status:
```bash
docker ps  # Check HEALTH column
```

## Volume Mounting (Development)

For development with live changes, you can mount the source directory:

```bash
docker run -p 3000:3000 \
  -v $(pwd)/src:/app/src \
  interview-readiness-analyzer
```

Note: This requires rebuilding the application for changes to take effect.

## Networking

The docker-compose file creates a custom bridge network (`interview-network`). This allows:
- Container isolation
- Easy communication between multiple services
- Network policy enforcement

## Storage and Data Persistence

This is a stateless frontend application. Local data is stored in browser storage (localStorage), not Docker volumes. No volume mounting is required unless you need to:
- Persist logs
- Store exported reports
- Cache build artifacts

## Security Considerations

1. **Alpine Linux Base**: Minimal attack surface
2. **Node User**: Consider using non-root user for production
3. **Environment Variables**: Don't hardcode sensitive data
4. **Port Restrictions**: Run behind a reverse proxy (nginx/Apache) in production

### Enhanced Security Example

Create a `.env` file and pass it to Docker:

```bash
docker run --env-file .env -p 3000:3000 interview-readiness-analyzer
```

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker logs interview-app
docker-compose logs app
```

### Port Already in Use

Change the port mapping:
```bash
docker run -p 3001:3000 interview-readiness-analyzer
```

### Build Fails

Clear Docker cache and rebuild:
```bash
docker-compose build --no-cache
```

### Health Check Failing

Verify the application is serving correctly:
```bash
docker exec interview-app curl http://localhost:3000
```

## Production Deployment

### Using Nginx Reverse Proxy

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://interview-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Update `docker-compose.yml` to include Nginx:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./nginx.conf:/etc/nginx/conf.d/default.conf
  depends_on:
    - app
  networks:
    - interview-network
```

### Using Environment Variables

```bash
docker run \
  -p 3000:3000 \
  -e NODE_ENV=production \
  interview-readiness-analyzer
```

## Performance Tuning

### Memory Limits
```bash
docker run -m 512m -p 3000:3000 interview-readiness-analyzer
```

### CPU Limits
```bash
docker run --cpus="0.5" -p 3000:3000 interview-readiness-analyzer
```

## Useful Docker Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View image size
docker images

# Remove unused images
docker image prune

# Remove all stopped containers
docker container prune

# Inspect container details
docker inspect interview-app

# View real-time resource usage
docker stats

# Copy file from container
docker cp interview-app:/app/dist ./local-dist

# Execute command in running container
docker exec interview-app npm list
```

## Docker Registry (Publishing Image)

To push your image to Docker Hub:

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag interview-readiness-analyzer username/interview-readiness-analyzer:1.0.0

# Push to registry
docker push username/interview-readiness-analyzer:1.0.0
```

## Kubernetes Deployment

For Kubernetes, create a deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: interview-readiness-analyzer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: interview-readiness-analyzer
  template:
    metadata:
      labels:
        app: interview-readiness-analyzer
    spec:
      containers:
      - name: app
        image: interview-readiness-analyzer:latest
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - uses: docker/build-push-action@v4
        with:
          push: true
          tags: username/interview-readiness-analyzer:latest
```

## Version History

- **v1.0** - Initial Docker setup
  - Multi-stage build
  - Alpine Linux base
  - Health checks
  - Docker Compose configuration

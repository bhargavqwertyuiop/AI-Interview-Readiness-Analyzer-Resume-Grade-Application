# Deployment Guide

## Quick Deploy Options

### Netlify (Recommended)

1. **Via Netlify Dashboard:**
   - Push your code to GitHub
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

2. **Via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Vercel

1. **Via Vercel Dashboard:**
   - Push your code to GitHub
   - Go to [Vercel](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Click "Deploy"

2. **Via Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel
   ```

### Azure Static Web Apps

1. **Via Azure Portal:**
   - Create a new Static Web App resource
   - Connect to GitHub
   - Build settings:
     - App location: `/`
     - Api location: (leave empty)
     - Output location: `dist`
   - Deploy

2. **Via Azure CLI:**
   ```bash
   az staticwebapp create \
     --name interview-readiness-analyzer \
     --resource-group your-resource-group \
     --location eastus2 \
     --branch main \
     --app-location "/" \
     --output-location "dist"
   ```

## Environment Variables

No environment variables are required for this application as all data is stored in LocalStorage.

## Build Optimization

The production build is optimized automatically by Vite:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

## Post-Deployment

After deployment, your application will be available at the provided URL. All user data is stored locally in the browser's LocalStorage, so no backend is required.

## Custom Domain

All platforms support custom domains:
- **Netlify**: Domain settings → Add custom domain
- **Vercel**: Project settings → Domains
- **Azure**: Custom domains in Static Web App settings


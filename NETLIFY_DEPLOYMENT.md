# FreeGridPaper - Netlify Deployment Guide

## Overview
This package contains everything needed to deploy FreeGridPaper to Netlify. The project will be automatically built and deployed with no additional configuration required.

## What's Included
- **Source Code**: Complete React frontend + Express backend
- **Configuration**: Netlify-ready setup with `netlify.toml`
- **Build Files**: All necessary configuration files (Vite, Tailwind, TypeScript, etc.)

## Deployment Instructions

### Option 1: Deploy via Netlify Web UI (Recommended)

1. **Download the archive**
   - Get `freegridpaper-netlify-deploy.tar.gz` from the attached_assets folder
   - Extract it on your computer using:
     - **Windows 10+**: Native tar support (right-click → Extract)
     - **Windows with 7-Zip**: Right-click → 7-Zip → Extract
     - **Mac/Linux**: `tar -xzf freegridpaper-netlify-deploy.tar.gz`

2. **Push to GitHub**
   - Initialize a Git repository (or use existing)
   - Push the extracted folder to a GitHub repository
   - Command: `git add . && git commit -m "Initial commit" && git push`

3. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and choose your repository
   - Netlify will automatically detect and use `netlify.toml`
   - Click "Deploy site"

4. **Done!**
   - Netlify will automatically:
     - Run `npm install` to install dependencies
     - Run `npm run build` to build the frontend
     - Serve the built files from `dist/public`
   - Your site will be live in a few minutes!

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Extract the archive
tar -xzf freegridpaper-netlify-deploy.tar.gz
cd freegridpaper-netlify-deploy

# Install dependencies
npm install

# Deploy
netlify deploy --prod
```

## File Structure

```
freegridpaper-netlify-deploy/
├── client/                 # React frontend source
├── server/                 # Express backend source
├── shared/                 # Shared types and utilities
├── package.json           # Dependencies and build scripts
├── vite.config.ts         # Frontend build configuration
├── netlify.toml           # Netlify deployment configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## Build Process

When you deploy to Netlify, it automatically:

1. Runs `npm install` to install all dependencies from `package.json`
2. Runs `npm run build` which:
   - Builds the React frontend with Vite
   - Transpiles TypeScript
   - Optimizes assets
   - Generates production bundle in `dist/public`
3. Serves static files from `dist/public`
4. Redirects all routes to `index.html` for SPA routing

## Environment Variables

The app doesn't require any environment variables for basic functionality. However, if you add external APIs later, you can add them in:

- Netlify UI → Site Settings → Build & Deploy → Environment
- Or in a `.env` file (which won't be needed for this static app)

## Troubleshooting

### Build fails with "npm not found"
- This shouldn't happen as Netlify provides Node.js
- Check the build logs in Netlify for specific errors

### Site shows 404 errors
- Verify `netlify.toml` is in the root directory
- Check that the `publish` directory is set to `dist/public`

### Slow first load
- The app bundles many UI components - this is normal
- Consider code-splitting for production optimization

## Support

For Netlify-specific issues, visit: https://docs.netlify.com/

## Local Testing Before Deployment

Before deploying, test locally:

```bash
# Extract and navigate to directory
tar -xzf freegridpaper-netlify-deploy.tar.gz
cd freegridpaper-netlify-deploy

# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:5000
```

## Production Optimization Tips

1. The app generates PDFs client-side with jsPDF - no server processing needed
2. All user settings are stored in localStorage - completely client-side
3. The site is fully static after build - no database or API calls required
4. Consider enabling Netlify's asset optimization in Site Settings

## Next Steps

After deployment:
1. Test all paper generation features
2. Download PDFs and verify they print correctly at 100% scale
3. Test on mobile devices
4. Set up a custom domain if desired (Netlify Settings → Domain Management)

---

**Questions?** Check the Netlify docs or review `netlify.toml` for deployment configuration details.

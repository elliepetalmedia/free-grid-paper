# FreeGridPaper - Netlify Deployment Guide

## Overview
This package contains everything needed to deploy FreeGridPaper to Netlify. The project is deployed from git and built automatically with no additional configuration required.

## Routing model (read this first)
FreeGridPaper is a prerendered static site, not a single-page app with a fallback. Every real route is a prerendered static file under `dist/public/<route>/index.html` (74 routes: 24 templates, 19 guides, 18 presets, 7 categories, 6 pages), with slash canonicals except the root `/`. There is no SPA fallback: unknown URLs return the custom `404.html` with a real 404 status, never the homepage shell. Only three legacy phantom paths 301 to real pages, defined in `netlify.toml`, which is the sole source of truth for redirects: `/templates/poster-hex/` to `/poster-hex/`, `/graph-paper/` to `/graph/`, and `/guides/how-to-print-grid-paper/` to `/guides/how-to-print-at-actual-size/`. `/guides/free-grid-paper-for-teachers/` deliberately has no redirect and must 404. The PWA service worker also has no navigation fallback (`navigateFallback: null` in `vite.config.ts`), so a service-worker-controlled browser cannot serve the homepage shell for an unknown or legacy URL either. See `docs/content-architecture.md` for the canonical URL conventions.

## What's Included
- **Source Code**: Complete React frontend + Express backend (the Express server is the local/production server; Netlify serves the static build)
- **Configuration**: Netlify-ready setup with `netlify.toml`
- **Build Files**: All necessary configuration files (Vite, Tailwind, TypeScript, etc.)

## Deployment Instructions

### Option 1: Deploy via Netlify Web UI (Recommended)

This repo is deployed from git. There is no deploy archive: the old `freegridpaper-netlify-deploy.tar.gz` instructions no longer apply.

1. **Push to GitHub**
   - The repo is `elliepetalmedia/free-grid-paper`, branch `main`
   - Command: `git add . && git commit -m "Initial commit" && git push`

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and choose your repository
   - Netlify will automatically detect and use `netlify.toml`
   - Click "Deploy site"

3. **Done!**
   - Netlify will automatically:
     - Run `npm install` to install dependencies
     - Run `npm test` to check, build, and test (one workflow, one build)
     - Serve the built files from `dist/public`
   - Your site will be live in a few minutes!

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Clone the repo and install dependencies
git clone https://github.com/elliepetalmedia/free-grid-paper.git
cd free-grid-paper
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
└── tailwind.config.ts     # Tailwind CSS configuration
```

## Build Process

When you deploy to Netlify, it automatically:

1. Runs `npm install` to install all dependencies from `package.json`
2. Runs `npm test` (the build command in `netlify.toml`), which runs the full workflow once: type check, build, unit tests, then build-output tests. Tests run after the build on purpose, because `tests/build-outputs.test.ts` verifies what the build actually produced in `dist/public`. The deploy fails if checks, build, or tests fail, and the build runs exactly once.
3. `npm run build` runs previews, Vite, `scripts/prerender.ts` (74 prerendered pages, segmented sitemaps, `robots.txt`, `llms.txt`, `data/template-specs.json`, `404.html` plus `not-found.html`), `scripts/write-headers.ts`, and the production server bundle.
4. Serves static files from `dist/public`. Every real route is a prerendered file; unknown URLs return `404.html` with a 404 status; the three legacy phantom paths 301 to their real pages (see the routing model above).

## Indexing safeguards: production versus preview
- Prerendered canonicals always point at the production origin `https://freegridpaper.com`, never at a `*.netlify.app` preview host, and client metadata does the same (`client/src/lib/canonical.ts`).
- Production pages get `robots` `index,follow,max-image-preview:large`; non-production hosts get `noindex,nofollow` from the client metadata hook.
- `scripts/write-headers.ts` writes an `X-Robots-Tag: noindex, nofollow` `_headers` file for `deploy-preview` and `branch-deploy` contexts only, and removes it for production. Netlify adds that header to deploy previews itself, but not reliably to the most recent branch deploy, so this step covers non-HTML files (PDFs, images, sitemaps) on branch deploys too. Production never gets the file.
- The 404 page is `noindex,nofollow` with no canonical, on both hosts.

## PWA and service worker
- `vite-plugin-pwa` generates the service worker with `registerType: 'autoUpdate'`. It precaches the app shell and assets, and caches document navigations with a `NetworkFirst` strategy (`html-cache`), which only caches successful (200) responses, so it cannot mask a live 301 or 404.
- There is deliberately no navigation fallback: `workbox.navigateFallback` is `null` in `vite.config.ts`. Do not restore it. With a fallback, a service-worker-controlled browser would serve the homepage shell for unknown and legacy URLs and bypass Netlify's 301s and 404s entirely.
- Old service workers migrate automatically on the next online visit (`autoUpdate` forces `skipWaiting` and `clientsClaim`, and `cleanupOutdatedCaches` purges old precaches). A browser that never revisits while online keeps the old worker until it does; there is no server-side way to force it. If a stuck worker is ever observed, unregister it and clear site data in that browser rather than changing code.

## Tests
```bash
npm test          # full workflow from a clean checkout: check, build, unit tests, build-output tests
npm run test:unit # unit tests only (canonical, PDF generators, redirects); no build needed
npm run test:build # build-output tests only; needs a fresh dist/, so run `npm run build` first
```
`npm test` is the one command that works from a clean checkout: it type-checks, builds once, then runs the unit tests and the build-output tests against the fresh `dist/`. The build-output tests fail loudly if `dist/` is missing, so do not run `npm run test:build` without building first. Expected counts in the build-output tests are derived from the content registry, not hard-coded, so adding a page does not require a test edit; the one exception is the clearly labelled content-inventory guard test, which asserts the expected page-count snapshot and must be updated deliberately when content is added or removed. The `write-headers` subprocess tests invoke Node directly (`node --import tsx`, Node >= 20.6) instead of `npx`, so they work on Windows as well as Linux and macOS; Windows execution has not been run in this environment, so on Windows validate with `npm test` from a clean checkout. The redirect and build-output tests verify `netlify.toml` directly, every prerendered page and sitemap entry, the static 404 content, the absence of a service worker navigation fallback, and the production/preview indexing headers. A live Netlify deploy preview still needs a manual check before merging a routing change: a real route returns 200, each phantom URL 301s to its real page, and an unknown URL returns 404 with the custom 404 page, in both a fresh browser session and one controlled by a previously installed service worker.

## Operational caveats
- Adding a route: add it to the content registry (`client/src/content/`), rebuild, and confirm it appears in the sitemap and as a prerendered file. Do not add a redirect for it unless it is a legacy URL with search impressions. Update the content-inventory guard test in `tests/build-outputs.test.ts` deliberately to the new expected page counts; every other test derives its expectations from the registry and needs no edit.
- Adding a redirect: add it to `netlify.toml` only, in both slash and no-slash forms, before the `/*` 404 rule, and update the expected mappings in `tests/redirects.test.ts`. Do not recreate a TypeScript mirror of the redirect list.
- The `/*` 404 rule in `netlify.toml` is kept explicitly even though Netlify is widely documented to serve a publish-root `404.html` natively. Delete it only after a live deploy-preview check proves an unknown path still returns 404 with the custom page and no rule.
- Do not restore the `/*` 200 SPA fallback or a PWA navigation fallback. Either one recreates the soft 404 for unknown and legacy URLs.

## Environment Variables

The app doesn't require any environment variables for basic functionality. However, if you add external APIs later, you can add them in:

- Netlify UI → Site Settings → Build & Deploy → Environment
- Or in a `.env` file (which won't be needed for this static app)

## Troubleshooting

### Build fails with "npm not found"
- This shouldn't happen as Netlify provides Node.js
- Check the build logs in Netlify for specific errors

### Site shows 404 errors
- A 404 for an unknown URL is expected and correct: it serves `404.html` with `noindex,nofollow` and no canonical. Only a 404 for a real prerendered route, a phantom path that should 301, or a missing asset is a fault.
- If a real route 404s, verify `netlify.toml` is in the root directory, the `publish` directory is set to `dist/public`, and the route was prerendered (check `dist/public/<route>/index.html` after a build).
- If a phantom path does not 301, check the redirect ordering in `netlify.toml`: the 301 rules must come before the `/*` 404 rule, and no `_redirects` file may exist (Netlify processes `_redirects` before `netlify.toml`).

### Slow first load
- The app bundles many UI components - this is normal
- Consider code-splitting for production optimization

## Support

For Netlify-specific issues, visit: https://docs.netlify.com/

## Local Testing Before Deployment

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Full workflow: type check, production build, then tests against the fresh build
npm test

# Serve the built static output and check routing by hand:
#   /           -> 200, homepage generator
#   /graph/     -> 200, Standard Graph Paper
#   /graph-paper/ -> 301 to /graph/ on Netlify (the local Express
#                    server has no Netlify redirect rules, so it
#                    serves the 404 page there instead)
#   /nonexistent-test-123/ -> 404 with the custom 404 page
#   /guides/free-grid-paper-for-teachers/ -> 404, no redirect
npx serve dist/public
```

Note: `npm run dev` starts the development server, which does fall back to `index.html` for unknown paths. That is dev-only behaviour and does not reflect production or Netlify routing.

## Production Optimization Tips

1. The app generates PDFs client-side with jsPDF - no server processing needed
2. All user settings are stored in localStorage - completely client-side
3. The site is fully static after build - no database or API calls required. Every real route is a prerendered file with slash canonicals; see the routing model at the top of this file.
4. Consider enabling Netlify's asset optimization in Site Settings

## Next Steps

After deployment:
1. Test all paper generation features
2. Download PDFs and verify they print correctly at 100% scale
3. Test on mobile devices
4. Set up a custom domain if desired (Netlify Settings → Domain Management)

---

**Questions?** Check the Netlify docs or review `netlify.toml` for deployment configuration details.

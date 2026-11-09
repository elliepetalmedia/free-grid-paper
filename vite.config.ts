import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'FreeGridPaper',
        short_name: 'FGP',
        description: 'Free printable grid paper generator',
        theme_color: '#ffffff',
      },
      workbox: {
        // No navigation fallback: vite-plugin-pwa defaults
        // navigateFallback to "index.html", which makes Workbox
        // serve the precached homepage shell for every navigation,
        // including unknown URLs and legacy phantom URLs, before
        // any request reaches Netlify. That silently bypasses the
        // Netlify 301 redirects and the 404 rule for any browser
        // controlled by the service worker, recreating the soft
        // 404 this site removed. Setting navigateFallback to null
        // means no NavigationRoute is generated at all, so
        // navigations go to the network and Netlify serves the
        // prerendered page, the 301, or the 404 as appropriate.
        // The NetworkFirst document cache below is preserved: it
        // only caches successful (200) responses, so it cannot
        // mask a live 301 or 404. Old workers migrate
        // automatically via registerType 'autoUpdate' (skipWaiting
        // and clientsClaim), plus cleanupOutdatedCaches; no manual
        // unregister or cache purge is needed, though a browser
        // that never revisits while online keeps the old worker
        // until it does.
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ request }: any) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: { cacheName: 'html-cache' },
          },
        ]
      }
    }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

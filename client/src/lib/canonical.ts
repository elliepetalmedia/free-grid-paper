// Single source of truth for canonical URLs, shared by the client
// metadata hook, the Home page, and the prerender script.
//
// Why this exists: canonicals must always point at production, even
// when the app is running on a Netlify deploy preview, localhost, or
// any other host. Using window.location.origin for the canonical, as
// the previous client code did, made a preview canonical contradict
// the production canonical in the prerendered HTML, which is exactly
// the kind of conflicting signal search engines should not get.
//
// Trailing slash policy: every canonical path carries a trailing
// slash, except root '/', which already ends in one. App routes stay
// slash free, because Wouter matches those, so this helper also
// derives a canonical path from a route path.

export const PRODUCTION_ORIGIN = 'https://freegridpaper.com';

export const PRODUCTION_HOSTS = ['freegridpaper.com', 'www.freegridpaper.com'] as const;

export const PRODUCTION_ROBOTS = 'index,follow,max-image-preview:large';

export const PREVIEW_ROBOTS = 'noindex,nofollow';

export function canonicalPathForRoute(routePath: string): string {
  if (!routePath || routePath === '/') return '/';
  const withoutSlashes = routePath.replace(/\/+$/, '');
  return withoutSlashes === '' ? '/' : `${withoutSlashes}/`;
}

export function canonicalUrlForPath(canonicalPath: string): string {
  return `${PRODUCTION_ORIGIN}${canonicalPathForRoute(canonicalPath)}`;
}

export function isProductionHost(hostname: string): boolean {
  return (PRODUCTION_HOSTS as readonly string[]).includes(hostname.toLowerCase());
}

export function robotsForHost(hostname: string): string {
  return isProductionHost(hostname) ? PRODUCTION_ROBOTS : PREVIEW_ROBOTS;
}

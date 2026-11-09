// Phantom URLs: paths that do not exist as pages but that search
// engines already show, because the Netlify SPA fallback used to
// serve them as 200 root content. Each one redirects to the real
// page it was evidently meant to be. This list is the single source
// of truth for the 301 rules in netlify.toml, and tests/redirects.test.ts
// verifies the two agree, in order, before the /* 404 rule.
//
// /guides/free-grid-paper-for-teachers/ is deliberately absent: no
// such guide exists, so it must 404 rather than redirect anywhere.

export interface PhantomRedirect {
  /** Canonical (slash) form of the phantom path. */
  from: string;
  /** Canonical (slash) form of the real page. */
  to: string;
}

export const PHANTOM_REDIRECTS: readonly PhantomRedirect[] = [
  { from: '/templates/poster-hex/', to: '/poster-hex/' },
  { from: '/graph-paper/', to: '/graph/' },
  { from: '/guides/how-to-print-grid-paper/', to: '/guides/how-to-print-at-actual-size/' },
] as const;

function normalise(pathname: string): string {
  if (!pathname) return '/';
  const withoutSlashes = pathname.replace(/\/+$/, '');
  return withoutSlashes === '' ? '/' : `${withoutSlashes}/`;
}

/** Resolve a request path to its phantom redirect target, if any.
 * Matches both the slash and the no-slash variant of each phantom
 * path, because Netlify may see either form. Returns undefined for
 * every other path, including unknown paths, which must 404. */
export function resolvePhantomRedirect(pathname: string): string | undefined {
  const normalised = normalise(pathname);
  return PHANTOM_REDIRECTS.find((redirect) => redirect.from === normalised)?.to;
}

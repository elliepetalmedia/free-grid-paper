import { useEffect } from 'react';
import type { CategoryEntry, GuideEntry, PresetEntry, SeoEntry, SitePageEntry, TemplateEntry } from '@/content';
import { canonicalUrlForPath, robotsForHost } from '@/lib/canonical';
import { trackContentPageView } from '@/lib/analytics';

type TrackableEntry = SeoEntry & {
  path?: string;
  canonicalPath?: string;
  id?: string;
  kind?: string;
  categoryId?: string;
};

function ensureMeta(name: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  return meta;
}

function ensureCanonicalLink() {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  return link;
}

// Set the canonical and robots for one page, from one place, so
// client-side navigation cannot leave a previous page's metadata in
// place. Canonicals always point at production, even on a preview
// host, and preview and other non-production hosts get noindex, so a
// deploy preview cannot compete with production in search results.
// Production hosts get the prerendered robots value back, which also
// repairs a noindex left behind by a 404 page.
export function setCanonicalAndRobots(canonicalPath: string, hostname: string) {
  ensureCanonicalLink().setAttribute('href', canonicalUrlForPath(canonicalPath));
  ensureMeta('robots').setAttribute('content', robotsForHost(hostname));
}

export function usePageMetadata(entry: TrackableEntry | undefined) {
  useEffect(() => {
    if (!entry) return;
    document.title = entry.title;

    ensureMeta('description').setAttribute('content', entry.description);

    if (entry.canonicalPath) {
      setCanonicalAndRobots(entry.canonicalPath, window.location.hostname);
    }

    if (entry.path) {
      trackContentPageView({
        page_title: entry.title,
        page_path: entry.path,
        content_kind: entry.kind,
        content_id: entry.id,
        category_id: entry.categoryId,
      });
    }
  }, [entry]);
}

// A 404 page has no canonical of its own. Remove any canonical left
// by the previous page, and noindex it, so a client-side navigation
// to an unknown route cannot leave a real page's canonical in place.
export function useNotFoundMetadata() {
  useEffect(() => {
    document.title = '404 Page Not Found | FreeGridPaper';
    const link = document.querySelector('link[rel="canonical"]');
    if (link) link.remove();
    ensureMeta('robots').setAttribute('content', 'noindex,nofollow');
  }, []);
}

export type MetadataEntry = TemplateEntry | CategoryEntry | PresetEntry | GuideEntry | SitePageEntry;

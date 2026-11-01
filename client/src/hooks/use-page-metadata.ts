import { useEffect } from 'react';
import type { CategoryEntry, GuideEntry, PresetEntry, SeoEntry, SitePageEntry, TemplateEntry } from '@/content';
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

export function usePageMetadata(entry: TrackableEntry) {
  useEffect(() => {
    document.title = entry.title;

    ensureMeta('description').setAttribute('content', entry.description);

    if (entry.canonicalPath) {
      // Canonical must be absolute, not a relative path, and it must
      // match the prerendered canonical, which now carries a trailing
      // slash. Using the page origin keeps this correct on live and on
      // preview hosts, instead of hardcoding the production domain.
      ensureCanonicalLink().setAttribute('href', `${window.location.origin}${entry.canonicalPath}`);
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

export type MetadataEntry = TemplateEntry | CategoryEntry | PresetEntry | GuideEntry | SitePageEntry;

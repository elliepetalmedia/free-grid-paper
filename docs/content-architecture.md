# FreeGridPaper Content Architecture

FreeGridPaper keeps crawlable content, route metadata, internal links, and prerender inputs in `client/src/content`.

## Canonical URL Policy

Existing template routes remain in place. Do not move `/graph`, `/coordinate-plane`, `/cornell-notes`, `/polar-grid`, `/isometric-grid`, `/dot-grid`, `/hex-paper`, `/music-staff`, `/engineering`, `/poster-size`, `/poster-hex`, `/calligraphy`, `/knitting`, `/handwriting`, `/guitar-tab`, `/bass-tab`, `/genkoyoushi`, `/perspective-1`, `/perspective-2`, `/comic-2x3`, `/storyboard`, `/isometric-dots`, `/lined-paper`, or `/checklist` without a separate redirect migration. Their canonical URLs are the same routes with a trailing slash, for example `/graph/`.

Root `/` is the generator itself, with canonical `/`, and is not a redirect to `/templates`. `/templates` remains the browsable library, with its own canonical `/templates/`, following the trailing slash policy below. App routes are written slash free, for example `/templates`, and their canonical versions carry the slash.

New crawlable architecture routes use:

- `/templates`
- `/category/{slug}`
- `/preset/{slug}`
- `/guides/{slug}`
- `/about`
- `/contact`
- `/privacy`

## Adding Content

Add templates in `client/src/content/templates.ts`. Each template needs a stable `id`, canonical `path`, category, title, description, H1, summary, settings, related templates, popular presets, preview image, and social image.

Add category hubs in `client/src/content/categories.ts`. Each category should list child template IDs, related category IDs, related guide IDs, intro copy, and optional FAQs.

Add preset landing pages in `client/src/content/presets.ts`. Each preset must reference a parent template and category, define concrete generator settings, include unique copy, and link to related presets and guides.

Add evergreen guides in `client/src/content/guides.ts`. Each guide should answer one durable printing or template-selection question and link back to relevant templates and presets.

Add trust or site pages in `client/src/content/site-pages.ts`.

## Required Metadata

Every indexable entry must include:

- `title`
- `description`
- `h1`
- `canonicalPath`
- `previewImage`
- `socialImage`
- `summary`
- `updatedAt`
- `body`
- `indexable: true`

Optional but recommended for answer-oriented pages:

- `answerSummary`
- `bestFor`
- `referenceFacts`
- `relatedQuestions`

Preview images currently use static files under `client/public/previews`. Social images use `client/public/og`.

## Internal Linking Rules

- Root is the generator and links to `/templates` from its nav and footer, plus major categories and important starting templates via its Quick Access bar and below-preview content.
- `/templates` links to every category and template.
- Category pages link to child templates, sibling categories, and relevant guides.
- Template pages link to parent category, related templates, and popular presets.
- Preset pages link to parent template, parent category, related presets, and related guides.
- Guide pages link back to relevant templates and presets.

## Anti-Thin-Content Rules

Do not add preset pages that only change a setting value. Each preset page needs a useful summary, at least one explanatory body section, use cases, print tips, and related links.

## Prerender And Sitemap

`scripts/prerender.ts` reads `indexableEntries` from the registry. Pages with `indexable: true` are included in prerender output and `sitemap.xml`. Query-string share URLs are not canonical and are blocked by `robots.txt`.

Canonical URLs carry a trailing slash, except the root `/`, because prerendered pages are served as directory `index.html` files and static hosting serves those at the slash URL. App routes in `path` stay slash free for Wouter, and `canonicalPath` is derived from `path` in `client/src/content/index.ts`. Sitemap `<loc>`, prerender canonical, og:url, JSON-LD URLs, and prerender body links all use the canonical slash version, so a sitemap URL must not redirect to a different canonical. Do not change canonical back to slash free without also changing how the pages are served.

`updatedAt` is also the sitemap `<lastmod>`, the prerender `article:modified_time`, and the JSON-LD `dateModified`, and it is shown on the page as "Updated". Only bump it for a page that actually changed in content or generator behavior. Do not do a blanket date refresh across categories, guides, presets, or site pages that did not change, just to look fresh.

The prerender output also generates:

- visible prerender-only crawl text per route
- `llms.txt`
- `llms-full.txt`
- segmented sitemap files
- `data/template-specs.json`
- `404.html` and `not-found.html`, identical, with static 404 content (heading, explanation, homepage link), `noindex,nofollow`, and no canonical

Routing and redirects: there is no SPA fallback. Netlify serves prerendered files, the three legacy phantom paths 301 to their real pages, and unknown URLs return the custom 404 with a 404 status; `netlify.toml` is the sole source of truth for redirects. The PWA service worker has no navigation fallback (`navigateFallback: null` in `vite.config.ts`). See `NETLIFY_DEPLOYMENT.md` for the full routing model, the PWA behaviour, and the production-versus-preview indexing safeguards.

## Out Of Scope

Analytics expansion and Search Console workflows are intentionally outside this repository remediation. They can be handled as a separate operational workstream.

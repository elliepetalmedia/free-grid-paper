# FreeGridPaper Content Architecture

FreeGridPaper keeps crawlable content, route metadata, internal links, and prerender inputs in `client/src/content`.

## Canonical URL Policy

Existing template routes remain canonical. Do not move `/graph`, `/dot-grid`, `/hex-paper`, `/music-staff`, `/engineering`, `/poster-size`, `/poster-hex`, `/calligraphy`, `/knitting`, `/handwriting`, `/guitar-tab`, `/bass-tab`, `/genkoyoushi`, `/perspective-1`, `/perspective-2`, `/comic-2x3`, `/storyboard`, `/isometric-dots`, `/lined-paper`, or `/checklist` without a separate redirect migration.

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
- `body`
- `indexable: true`

Preview images currently use static files under `client/public/previews`. Social images use `client/public/og`.

## Internal Linking Rules

- Root links to `/templates`, major categories, and important starting templates.
- `/templates` links to every category and template.
- Category pages link to child templates, sibling categories, and relevant guides.
- Template pages link to parent category, related templates, and popular presets.
- Preset pages link to parent template, parent category, related presets, and related guides.
- Guide pages link back to relevant templates and presets.

## Anti-Thin-Content Rules

Do not add preset pages that only change a setting value. Each preset page needs a useful summary, at least one explanatory body section, use cases, print tips, and related links.

## Prerender And Sitemap

`scripts/prerender.ts` reads `indexableEntries` from the registry. Pages with `indexable: true` are included in prerender output and `sitemap.xml`. Query-string share URLs are not canonical and are blocked by `robots.txt`.

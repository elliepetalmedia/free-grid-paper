import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  categories,
  getCategoryById,
  getGuideBySlug,
  getPresetBySlug,
  getPresetsForTemplate,
  getSitePageByPath,
  getTemplateById,
  guides,
  indexableEntries,
  presets,
  sitePages,
  templates,
  type CategoryEntry,
  type FaqEntry,
  type GuideEntry,
  type IndexableEntry,
  type PresetEntry,
  type ReferenceFact,
  type SitePageEntry,
  type TemplateEntry,
} from '../client/src/content/index';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist/public');
const domain = 'https://freegridpaper.com';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function absoluteUrl(pathname: string) {
  return `${domain}${pathname}`;
}

function imageUrl(pathname: string) {
  return pathname.startsWith('http') ? pathname : `${domain}${pathname}`;
}

function renderLinkList(items: Array<{ href: string; label: string }>, title: string) {
  if (!items.length) return '';
  const links = items.map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`).join('');
  return `<section><h2>${escapeHtml(title)}</h2><ul>${links}</ul></section>`;
}

function renderFacts(facts?: ReferenceFact[]) {
  if (!facts?.length) return '';
  const rows = facts
    .map((fact) => `<div><dt>${escapeHtml(fact.label)}</dt><dd>${escapeHtml(fact.value)}</dd></div>`)
    .join('');
  return `<section><h2>Reference facts</h2><dl>${rows}</dl></section>`;
}

function renderQuestions(questions?: FaqEntry[]) {
  if (!questions?.length) return '';
  const entries = questions
    .map((entry) => {
      const link = entry.href ? `<p><a href="${entry.href}">Open related page</a></p>` : '';
      return `<article><h3>${escapeHtml(entry.question)}</h3><p>${escapeHtml(entry.answer)}</p>${link}</article>`;
    })
    .join('');
  return `<section><h2>Related questions</h2>${entries}</section>`;
}

function renderSections(entry: IndexableEntry | SitePageEntry) {
  return entry.body
    .map((section) => {
      const items = section.items?.length
        ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : '';
      return `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p>${items}</section>`;
    })
    .join('');
}

function relatedTemplateLinks(ids: string[]) {
  return ids
    .map(getTemplateById)
    .filter(Boolean)
    .map((entry) => ({ href: entry!.path, label: entry!.label }));
}

function relatedPresetLinks(ids: string[]) {
  return ids
    .map(getPresetBySlug)
    .filter(Boolean)
    .map((entry) => ({ href: entry!.path, label: entry!.label }));
}

function relatedGuideLinks(ids: string[]) {
  return ids
    .map(getGuideBySlug)
    .filter(Boolean)
    .map((entry) => ({ href: entry!.path, label: entry!.h1 }));
}

function routeSpecificBody(entry: IndexableEntry) {
  const heading = `<h1>${escapeHtml(entry.h1)}</h1><p>${escapeHtml(entry.summary)}</p>`;
  const answer = entry.answerSummary ? `<section><h2>Quick answer</h2><p>${escapeHtml(entry.answerSummary)}</p></section>` : '';
  const bestFor = entry.bestFor?.length
    ? `<section><h2>Best for</h2><ul>${entry.bestFor.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`
    : '';
  let related = '';

  if (entry.path === '/templates') {
    related += renderLinkList(
      categories.map((category) => ({ href: category.path, label: category.h1 })),
      'Template categories',
    );
    related += renderLinkList(
      guides.slice(0, 10).map((guide) => ({ href: guide.path, label: guide.h1 })),
      'Popular guides',
    );
  } else if (entry.kind === 'category') {
    related += renderLinkList(
      entry.templateIds.map((id) => getTemplateById(id)).filter(Boolean).map((template) => ({ href: template!.path, label: template!.label })),
      'Templates in this category',
    );
    related += renderLinkList(relatedGuideLinks(entry.relatedGuideIds), 'Guides for this category');
  } else if (entry.kind === 'template') {
    related += renderLinkList(relatedPresetLinks(entry.popularPresetIds), 'Popular presets');
    related += renderLinkList(relatedTemplateLinks(entry.relatedTemplateIds), 'Related templates');
  } else if (entry.kind === 'preset') {
    const template = getTemplateById(entry.templateId);
    const category = getCategoryById(entry.categoryId);
    const parentLinks = [
      template ? { href: template.path, label: template.label } : null,
      category ? { href: category.path, label: category.h1 } : null,
    ].filter(Boolean) as Array<{ href: string; label: string }>;
    related += renderLinkList(parentLinks, 'Start here');
    related += renderLinkList(relatedGuideLinks(entry.relatedGuideIds), 'Related guides');
    related += renderLinkList(relatedPresetLinks(entry.relatedPresetIds), 'Similar presets');
  } else if (entry.kind === 'guide') {
    const primaryLinks = [
      entry.primaryTemplateId ? getTemplateById(entry.primaryTemplateId) : null,
      entry.primaryPresetId ? getPresetBySlug(entry.primaryPresetId) : null,
    ]
      .filter(Boolean)
      .map((item) => ({
        href: item!.path,
        label: 'label' in item! ? item!.label : item!.h1,
      }));
    related += renderLinkList(primaryLinks, 'Best starting pages');
    related += renderLinkList(relatedTemplateLinks(entry.relatedTemplateIds), 'Related templates');
    related += renderLinkList(relatedPresetLinks(entry.relatedPresetIds), 'Related presets');
  } else if (entry.kind === 'site') {
    related += renderLinkList(
      categories.map((category) => ({ href: category.path, label: category.h1 })),
      'Browse by category',
    );
  }

  const faqs = entry.faqs?.length
    ? `<section><h2>Frequently asked questions</h2>${entry.faqs.map((faq) => `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`).join('')}</section>`
    : '';

  return `
    <main data-prerender-only="true">
      <article>
        ${heading}
        ${answer}
        ${renderFacts(entry.referenceFacts)}
        ${bestFor}
        ${renderSections(entry)}
        ${faqs}
        ${renderQuestions(entry.relatedQuestions)}
        ${related}
        ${entry.updatedAt ? `<p>Updated ${escapeHtml(entry.updatedAt)}</p>` : ''}
      </article>
    </main>
  `;
}

function breadcrumbsFor(entry: IndexableEntry) {
  const crumbs = [{ name: 'Templates', item: absoluteUrl('/templates') }];

  if (entry.path === '/' || entry.path === '/templates') return crumbs;

  if (entry.kind === 'template') {
    const category = getCategoryById(entry.categoryId);
    if (category) crumbs.push({ name: category.h1, item: absoluteUrl(category.path) });
    crumbs.push({ name: entry.h1, item: absoluteUrl(entry.path) });
  } else if (entry.kind === 'category') {
    crumbs.push({ name: entry.h1, item: absoluteUrl(entry.path) });
  } else if (entry.kind === 'preset') {
    const category = getCategoryById(entry.categoryId);
    const template = getTemplateById(entry.templateId);
    if (category) crumbs.push({ name: category.h1, item: absoluteUrl(category.path) });
    if (template) crumbs.push({ name: template.label, item: absoluteUrl(template.path) });
    crumbs.push({ name: entry.h1, item: absoluteUrl(entry.path) });
  } else {
    crumbs.push({ name: entry.h1, item: absoluteUrl(entry.path) });
  }

  return crumbs;
}

function schemaFor(entry: IndexableEntry) {
  const canonicalUrl = absoluteUrl(entry.canonicalPath);
  const graph: Record<string, unknown>[] = [
    {
      '@type': entry.kind === 'category' || entry.path === '/templates' ? 'CollectionPage' : 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      name: entry.title,
      description: entry.description,
      url: canonicalUrl,
      isPartOf: { '@id': `${domain}/#website` },
      dateModified: entry.updatedAt,
      about: { '@id': `${canonicalUrl}#topic` },
    },
    {
      '@type': 'Organization',
      '@id': `${domain}/#publisher`,
      name: 'Ellie Petal Media',
      url: `${domain}/about`,
      sameAs: [`${domain}/about`, `${domain}/contact`],
    },
    {
      '@type': 'WebSite',
      '@id': `${domain}/#website`,
      url: `${domain}/`,
      name: 'FreeGridPaper',
      description: 'Printable paper generator and reference library with vector PDF export.',
      publisher: { '@id': `${domain}/#publisher` },
    },
  ];

  if (entry.path === '/templates') {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${domain}/#software`,
      name: 'FreeGridPaper Generator',
      url: `${domain}/`,
      description: 'Free online tool to generate and download custom printable stationery in vector PDF format.',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': `${domain}/#publisher` },
    });
    graph.push({
      '@type': 'Dataset',
      '@id': `${domain}/data/template-specs.json#dataset`,
      name: 'FreeGridPaper template specs',
      description: 'Structured template, preset, and guide metadata for printable paper resources.',
      url: `${domain}/data/template-specs.json`,
      creator: { '@id': `${domain}/#publisher` },
    });
  }

  const crumbs = breadcrumbsFor(entry);
  if (crumbs.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    });
  }

  if (entry.referenceFacts?.length) {
    graph.push({
      '@type': 'DefinedTermSet',
      '@id': `${canonicalUrl}#facts`,
      name: `${entry.h1} reference facts`,
      hasDefinedTerm: entry.referenceFacts.map((fact) => ({
        '@type': 'DefinedTerm',
        name: fact.label,
        description: fact.value,
        inDefinedTermSet: `${canonicalUrl}#facts`,
      })),
    });
  }

  if (entry.kind === 'guide') {
    graph.push({
      '@type': 'Article',
      '@id': `${canonicalUrl}#article`,
      headline: entry.h1,
      description: entry.description,
      author: { '@id': `${domain}/#publisher` },
      publisher: { '@id': `${domain}/#publisher` },
      dateModified: entry.updatedAt,
      mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
    });
  }

  if (entry.id === 'how-to-print-at-actual-size') {
    graph.push({
      '@type': 'HowTo',
      '@id': `${canonicalUrl}#howto`,
      name: entry.h1,
      description: entry.description,
      step: [
        { '@type': 'HowToStep', name: 'Export the PDF', text: 'Open the template or preset page and download the PDF.' },
        { '@type': 'HowToStep', name: 'Disable scaling', text: 'Choose Actual Size or 100% scale and turn off Fit to Page.' },
        { '@type': 'HowToStep', name: 'Verify one measurement', text: 'Measure one printed square, line gap, or hex before printing multiple copies.' },
      ],
    });
  }

  if (entry.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: entry.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  if (entry.kind === 'category') {
    graph.push({
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#itemlist`,
      itemListElement: entry.templateIds.map((id, index) => {
        const template = getTemplateById(id);
        return {
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(template?.path ?? '/templates'),
          name: template?.label ?? id,
        };
      }),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function metadataTags(entry: IndexableEntry) {
  const canonicalUrl = absoluteUrl(entry.canonicalPath);
  const social = imageUrl(entry.socialImage);
  const schema = JSON.stringify(schemaFor(entry));

  return `
      <meta name="description" content="${escapeHtml(entry.description)}" />
      <link rel="canonical" href="${canonicalUrl}" />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <meta property="og:title" content="${escapeHtml(entry.title)}" />
      <meta property="og:description" content="${escapeHtml(entry.description)}" />
      <meta property="og:url" content="${canonicalUrl}" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="${social}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="article:modified_time" content="${escapeHtml(entry.updatedAt)}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${escapeHtml(entry.title)}" />
      <meta name="twitter:description" content="${escapeHtml(entry.description)}" />
      <meta name="twitter:image" content="${social}" />
      <script type="application/ld+json">${schema}</script>
    `;
}

function buildTemplateSpecExport() {
  return {
    generatedAt: new Date().toISOString(),
    site: {
      name: 'FreeGridPaper',
      domain,
      llms: [`${domain}/llms.txt`, `${domain}/llms-full.txt`],
      sitemap: `${domain}/sitemap.xml`,
    },
    templates: templates.map((entry) => ({
      id: entry.id,
      label: entry.label,
      path: absoluteUrl(entry.path),
      categoryId: entry.categoryId,
      title: entry.title,
      summary: entry.summary,
      answerSummary: entry.answerSummary,
      settings: entry.settings,
      relatedTemplateIds: entry.relatedTemplateIds,
      popularPresetIds: entry.popularPresetIds,
      updatedAt: entry.updatedAt,
    })),
    presets: presets.map((entry) => ({
      id: entry.id,
      label: entry.label,
      path: absoluteUrl(entry.path),
      templateId: entry.templateId,
      categoryId: entry.categoryId,
      summary: entry.summary,
      answerSummary: entry.answerSummary,
      settings: entry.settings,
      updatedAt: entry.updatedAt,
    })),
    guides: guides.map((entry) => ({
      id: entry.id,
      title: entry.h1,
      path: absoluteUrl(entry.path),
      summary: entry.summary,
      answerSummary: entry.answerSummary,
      relatedTemplateIds: entry.relatedTemplateIds,
      relatedPresetIds: entry.relatedPresetIds,
      updatedAt: entry.updatedAt,
    })),
  };
}

function buildLlmsTxt() {
  const topGuides = [
    'graph-paper-sizes-explained',
    'best-dot-grid-spacing-for-bullet-journaling',
    'college-ruled-vs-wide-ruled',
    'common-hex-grid-sizes',
    'how-to-print-at-actual-size',
  ]
    .map(getGuideBySlug)
    .filter(Boolean) as GuideEntry[];

  const topPresets = [
    'five-mm-graph-paper',
    'quarter-inch-graph-paper',
    'a4-dot-grid-paper',
    'one-inch-hex-grid-paper',
    'college-ruled-paper',
  ]
    .map(getPresetBySlug)
    .filter(Boolean) as PresetEntry[];

  return [
    '# FreeGridPaper',
    '',
    '> FreeGridPaper is a printable-paper generator and reference site for graph paper, dot grids, ruled paper, music paper, hex maps, storyboards, and specialty stationery.',
    '',
    '## Canonical starting pages',
    `- Templates: ${absoluteUrl('/templates')}`,
    `- FAQ: ${absoluteUrl('/faq')}`,
    `- About: ${absoluteUrl('/about')}`,
    '',
    '## High-value guides',
    ...topGuides.map((guide) => `- ${guide.h1}: ${absoluteUrl(guide.path)}`),
    '',
    '## Stable presets',
    ...topPresets.map((preset) => `- ${preset.label}: ${absoluteUrl(preset.path)}`),
    '',
    '## Data',
    `- Template specs JSON: ${absoluteUrl('/data/template-specs.json')}`,
    `- Sitemap index: ${absoluteUrl('/sitemap.xml')}`,
    '',
    '## Notes',
    '- Prefer canonical template, preset, and guide pages over query-string generator URLs.',
    '- Printable measurements are intended to be used with Actual Size or 100% print scaling.',
  ].join('\n');
}

function buildLlmsFullTxt() {
  const lines = [
    '# FreeGridPaper full discovery file',
    '',
    '## Categories',
    ...categories.flatMap((category) => [
      `- ${category.h1}: ${absoluteUrl(category.path)}`,
      `  Summary: ${category.summary}`,
    ]),
    '',
    '## Templates',
    ...templates.flatMap((template) => [
      `- ${template.label}: ${absoluteUrl(template.path)}`,
      `  Summary: ${template.summary}`,
    ]),
    '',
    '## Guides',
    ...guides.flatMap((guide) => [
      `- ${guide.h1}: ${absoluteUrl(guide.path)}`,
      `  Answer: ${guide.answerSummary ?? guide.summary}`,
    ]),
  ];

  return lines.join('\n');
}

function writeSitemaps(entries: IndexableEntry[]) {
  const groups: Record<string, IndexableEntry[]> = {
    templates: entries.filter((entry) => entry.kind === 'template'),
    presets: entries.filter((entry) => entry.kind === 'preset'),
    guides: entries.filter((entry) => entry.kind === 'guide'),
    categories: entries.filter((entry) => entry.kind === 'category'),
    pages: entries.filter((entry) => entry.kind === 'site'),
  };

  const sitemapFiles = Object.entries(groups).map(([name, items]) => {
    const fileName = `sitemap-${name}.xml`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items
      .map((entry) => `  <url>\n    <loc>${absoluteUrl(entry.canonicalPath)}</loc>\n    <lastmod>${entry.updatedAt}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${entry.kind === 'site' ? '0.9' : '0.8'}</priority>\n  </url>`)
      .join('\n')}\n</urlset>\n`;
    fs.writeFileSync(path.resolve(distPath, fileName), xml, 'utf-8');
    return fileName;
  });

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapFiles
    .map((fileName) => `  <sitemap>\n    <loc>${absoluteUrl(`/${fileName}`)}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n  </sitemap>`)
    .join('\n')}\n</sitemapindex>\n`;

  fs.writeFileSync(path.resolve(distPath, 'sitemap.xml'), indexXml, 'utf-8');
}

async function prerender() {
  const indexHtmlPath = path.resolve(distPath, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`Error: index.html not found in ${distPath}. Build the client first.`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  const visibleEntries = indexableEntries.filter((candidate) => candidate.indexable);

  for (const entry of visibleEntries) {
    const routeDir = entry.path === '/' ? distPath : path.resolve(distPath, entry.path.slice(1));
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    let html = templateHtml.replace(/<title>(.*?)<\/title>/, `<title>${escapeHtml(entry.title)}</title>`);
    const descRegex = /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/;

    if (descRegex.test(html)) {
      html = html.replace(descRegex, metadataTags(entry));
    } else {
      html = html.replace('</head>', `${metadataTags(entry)}</head>`);
    }

    html = html.replace('<div id="root"></div>', `${routeSpecificBody(entry)}<div id="root"></div>`);
    fs.writeFileSync(path.resolve(routeDir, 'index.html'), html, 'utf-8');
    console.log(`Prerendered: ${entry.path}`);
  }

  writeSitemaps(visibleEntries);
  console.log('Generated segmented sitemaps');

  const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /*?*\n\nSitemap: ${domain}/sitemap.xml\n`;
  fs.writeFileSync(path.resolve(distPath, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('Generated robots.txt');

  fs.writeFileSync(path.resolve(distPath, 'llms.txt'), buildLlmsTxt(), 'utf-8');
  fs.writeFileSync(path.resolve(distPath, 'llms-full.txt'), buildLlmsFullTxt(), 'utf-8');
  console.log('Generated llms discovery files');

  const dataDir = path.resolve(distPath, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(path.resolve(dataDir, 'template-specs.json'), JSON.stringify(buildTemplateSpecExport(), null, 2), 'utf-8');
  console.log('Generated template-specs.json');

  const config404 = { title: '404 Not Found - FreeGridPaper', desc: 'The page you are looking for could not be found.' };
  let html404 = templateHtml.replace(/<title>(.*?)<\/title>/, `<title>${config404.title}</title>`);
  html404 = html404.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${config404.desc}" />\n<meta name="robots" content="noindex" />`,
  );
  fs.writeFileSync(path.resolve(distPath, 'not-found.html'), html404, 'utf-8');
  console.log('Generated not-found.html');
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});

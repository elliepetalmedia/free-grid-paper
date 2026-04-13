import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  categories,
  getCategoryById,
  getPresetBySlug,
  getTemplateById,
  indexableEntries,
  presets,
  sitePages,
  templates,
  type IndexableEntry,
} from "../client/src/content/index";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist/public");
const domain = "https://freegridpaper.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function absoluteUrl(pathname: string) {
  return `${domain}${pathname}`;
}

function imageUrl(pathname: string) {
  return pathname.startsWith("http") ? pathname : `${domain}${pathname}`;
}

function breadcrumbsFor(entry: IndexableEntry) {
  const crumbs = [{ name: "Home", item: absoluteUrl("/") }];

  if (entry.path === "/") return crumbs;

  if (entry.kind === "template") {
    const category = getCategoryById(entry.categoryId);
    crumbs.push({ name: "Templates", item: absoluteUrl("/templates") });
    if (category) crumbs.push({ name: category.h1, item: absoluteUrl(category.path) });
    crumbs.push({ name: entry.h1, item: absoluteUrl(entry.path) });
  } else if (entry.kind === "category") {
    crumbs.push({ name: "Templates", item: absoluteUrl("/templates") });
    crumbs.push({ name: entry.h1, item: absoluteUrl(entry.path) });
  } else if (entry.kind === "preset") {
    const category = getCategoryById(entry.categoryId);
    const template = getTemplateById(entry.templateId);
    crumbs.push({ name: "Templates", item: absoluteUrl("/templates") });
    if (category) crumbs.push({ name: category.h1, item: absoluteUrl(category.path) });
    if (template) crumbs.push({ name: template.label, item: absoluteUrl(template.path) });
    crumbs.push({ name: entry.h1, item: absoluteUrl(entry.path) });
  } else if (entry.kind === "guide") {
    crumbs.push({ name: "Guides", item: absoluteUrl("/templates") });
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
      "@type": entry.kind === "category" || entry.path === "/templates" ? "CollectionPage" : "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      "name": entry.title,
      "description": entry.description,
      "url": canonicalUrl,
      "isPartOf": { "@id": `${domain}/#website` },
    },
  ];

  if (entry.path === "/") {
    graph.push(
      {
        "@type": "WebSite",
        "@id": `${domain}/#website`,
        "url": `${domain}/`,
        "name": "FreeGridPaper",
        "description": entry.description,
        "publisher": { "@type": "Organization", "name": "FreeGridPaper" },
      },
      {
        "@type": "WebApplication",
        "@id": `${domain}/#software`,
        "name": "FreeGridPaper Generator",
        "url": `${domain}/`,
        "description": "Free online tool to generate and download custom printable stationery in vector PDF format.",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      },
    );
  }

  const crumbs = breadcrumbsFor(entry);
  if (crumbs.length > 1) {
    graph.push({
      "@type": "BreadcrumbList",
      "itemListElement": crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.item,
      })),
    });
  }

  if (entry.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "mainEntity": entry.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function routeSpecificBody(entry: IndexableEntry) {
  if (entry.path === "/") {
    const categoryLinks = categories.slice(0, 4)
      .map((category) => `<a href="${category.path}">${escapeHtml(category.h1)}</a>`)
      .join(" ");
    return `<section aria-label="FreeGridPaper overview"><h1>${escapeHtml(entry.h1)}</h1><p>${escapeHtml(entry.description)}</p><nav>${categoryLinks}<a href="/templates">Templates</a></nav></section>`;
  }

  if (entry.path === "/templates") {
    const templateLinks = templates
      .map((template) => `<li><a href="${template.path}">${escapeHtml(template.label)}</a></li>`)
      .join("");
    return `<section><h1>${escapeHtml(entry.h1)}</h1><p>${escapeHtml(entry.description)}</p><ul>${templateLinks}</ul></section>`;
  }

  if (entry.kind === "category") {
    const templateLinks = entry.templateIds
      .map((id) => getTemplateById(id))
      .filter(Boolean)
      .map((template) => `<li><a href="${template!.path}">${escapeHtml(template!.label)}</a></li>`)
      .join("");
    return `<section><h1>${escapeHtml(entry.h1)}</h1><p>${escapeHtml(entry.description)}</p><ul>${templateLinks}</ul></section>`;
  }

  if (entry.kind === "preset") {
    const template = getTemplateById(entry.templateId);
    return `<section><h1>${escapeHtml(entry.h1)}</h1><p>${escapeHtml(entry.description)}</p>${template ? `<a href="${template.path}">${escapeHtml(template.label)}</a>` : ""}</section>`;
  }

  if (entry.kind === "guide") {
    const links = [
      ...entry.relatedTemplateIds.map((id) => getTemplateById(id)?.path),
      ...entry.relatedPresetIds.map((id) => getPresetBySlug(id)?.path),
    ]
      .filter(Boolean)
      .map((href) => `<a href="${href}">${escapeHtml(href!)}</a>`)
      .join(" ");
    return `<section><h1>${escapeHtml(entry.h1)}</h1><p>${escapeHtml(entry.description)}</p><nav>${links}</nav></section>`;
  }

  return `<section><h1>${escapeHtml(entry.h1)}</h1><p>${escapeHtml(entry.description)}</p></section>`;
}

function metadataTags(entry: IndexableEntry) {
  const canonicalUrl = absoluteUrl(entry.canonicalPath);
  const social = imageUrl(entry.socialImage);
  const schema = JSON.stringify(schemaFor(entry));

  return `
      <meta name="description" content="${escapeHtml(entry.description)}" />
      <link rel="canonical" href="${canonicalUrl}" />
      <meta property="og:title" content="${escapeHtml(entry.title)}" />
      <meta property="og:description" content="${escapeHtml(entry.description)}" />
      <meta property="og:url" content="${canonicalUrl}" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="${social}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${escapeHtml(entry.title)}" />
      <meta name="twitter:description" content="${escapeHtml(entry.description)}" />
      <meta name="twitter:image" content="${social}" />
      <script type="application/ld+json">${schema}</script>
    `;
}

async function prerender() {
  const indexHtmlPath = path.resolve(distPath, "index.html");
  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`Error: index.html not found in ${distPath}. Build the client first.`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, "utf-8");
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const entry of indexableEntries.filter((candidate) => candidate.indexable)) {
    const routeDir = entry.path === "/" ? distPath : path.resolve(distPath, entry.path.slice(1));
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    let html = templateHtml.replace(/<title>(.*?)<\/title>/, `<title>${escapeHtml(entry.title)}</title>`);

    const descRegex = /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/;
    if (descRegex.test(html)) {
      html = html.replace(descRegex, metadataTags(entry));
    } else {
      html = html.replace("</head>", `${metadataTags(entry)}</head>`);
    }

    const hiddenContent = `
      <div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
        ${routeSpecificBody(entry)}
      </div>
    `;

    html = html.replace('<div id="root"></div>', `${hiddenContent}<div id="root"></div>`);
    fs.writeFileSync(path.resolve(routeDir, "index.html"), html, "utf-8");
    console.log(`Prerendered: ${entry.path}`);

    sitemapXml += `  <url>\n    <loc>${absoluteUrl(entry.canonicalPath)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${entry.path === "/" ? "1.0" : "0.8"}</priority>\n  </url>\n`;
  }

  sitemapXml += `</urlset>\n`;
  fs.writeFileSync(path.resolve(distPath, "sitemap.xml"), sitemapXml, "utf-8");
  console.log("Generated sitemap.xml");

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /*?*

Sitemap: ${domain}/sitemap.xml
`;
  fs.writeFileSync(path.resolve(distPath, "robots.txt"), robotsTxt, "utf-8");
  console.log("Generated robots.txt");

  const config404 = { title: "404 Not Found - FreeGridPaper", desc: "The page you are looking for could not be found." };
  let html404 = templateHtml.replace(/<title>(.*?)<\/title>/, `<title>${config404.title}</title>`);
  html404 = html404.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${config404.desc}" />\n<meta name="robots" content="noindex" />`,
  );
  fs.writeFileSync(path.resolve(distPath, "not-found.html"), html404, "utf-8");
  console.log("Generated not-found.html");
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});

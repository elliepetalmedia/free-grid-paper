import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist/public");

// Using a simplified preset config for generation
const ROUTES = {
  '/': { title: 'FreeGridPaper - Free Printable Grid Paper Generator', h1: 'FreeGridPaper', desc: 'Generate custom printable grid paper, dot grids, lined paper, music staves, and checklists instantly.' },
  '/hex-paper': { title: 'Free Printable Hex Grid Paper | FreeGridPaper', h1: 'Hex Grid Paper', desc: 'Free hexagonal graph paper PDF generator. Perfect for organic chemistry, D&D maps, and strategy games.' },
  '/music-staff': { title: 'Blank Sheet Music PDF | FreeGridPaper', h1: 'Blank Sheet Music', desc: 'Free printable blank sheet music. Customize staves per page. Professional quality PDF staff paper for composers.' },
  '/engineering': { title: 'Engineering Graph Paper | FreeGridPaper', h1: 'Engineering Graph Paper', desc: 'Create and download custom engineering graph paper.' },
  '/poster-size': { title: 'Poster Size Grid Paper | FreeGridPaper', h1: 'Poster Size Graph', desc: 'Create and download poster-sized custom graph paper.' },
  '/poster-hex': { title: 'Poster Size Hex Grid for D&D | FreeGridPaper', h1: 'Poster Size Hex (D&D)', desc: 'Generate poster-sized hex grid paper.' },
  '/calligraphy': { title: 'Calligraphy Practice Paper | FreeGridPaper', h1: 'Calligraphy Practice Paper', desc: 'Free printable calligraphy guide sheets with 55° slant lines. Master Copperplate and Spencerian scripts.' },
  '/knitting': { title: 'Knitting & Cross-Stitch Graph Paper | FreeGridPaper', h1: 'Knitting Graph Paper', desc: 'Customizable knitting and cross-stitch graph paper. Adjust grid ratio to match your gauge.' },
  '/graph': { title: 'Standard Graph Paper | FreeGridPaper', h1: 'Standard Graph Paper', desc: 'Create and download custom graph paper PDFs. Adjust grid lines, color, and spacing.' },
  '/dot-grid': { title: 'Dot Grid Paper | FreeGridPaper', h1: 'Dot Grid Paper', desc: 'Download free printable dot grid paper. Customize dot size, spacing, and opacity.' },
  '/handwriting': { title: 'Handwriting Practice Paper | FreeGridPaper', h1: 'Handwriting Practice Paper', desc: 'Free printable handwriting paper for primary school. 3-line guides with dashed midlines.' },
  '/guitar-tab': { title: 'Guitar Tablature PDF | FreeGridPaper', h1: 'Guitar Tablature', desc: 'Clean, customizable guitar tab paper. 6-line staves with adjustable spacing.' },
  '/bass-tab': { title: 'Bass Tablature PDF | FreeGridPaper', h1: 'Bass Tablature', desc: 'Free printable bass tab paper. 4-line staves designed for bass guitar transcription.' },
  '/genkoyoushi': { title: 'Genkoyoushi Japanese Manuscript Paper | FreeGridPaper', h1: 'Genkoyoushi Paper', desc: 'Traditional Japanese Genkoyoushi paper for kanji practice. Square grids with quarter-split guides.' },
  '/perspective-1': { title: '1-Point Perspective Grid | FreeGridPaper', h1: '1-Point Perspective', desc: 'Download 1-point perspective grids. Helper guides for architectural sketches.' },
  '/perspective-2': { title: '2-Point Perspective Grid | FreeGridPaper', h1: '2-Point Perspective', desc: 'Download 2-point perspective grids. Helper guides for 3D illustration.' },
  '/comic-2x3': { title: 'Comic Book Template (2x3) | FreeGridPaper', h1: 'Comic Layout (2x3)', desc: 'Printable comic book page templates. Standard panel layouts for manga and comics.' },
  '/storyboard': { title: 'Storyboard Template | FreeGridPaper', h1: 'Storyboard Template', desc: 'Professional storyboard templates with 16:9 frames and note lines. Ideal for video production planning.' },
  '/isometric-dots': { title: 'Isometric Dot Grid Paper | FreeGridPaper', h1: 'Isometric Dot Grid', desc: 'Printable isometric dot paper for 3D sketching and architectural drawing.' },
  '/lined-paper': { title: 'Lined Paper PDF | FreeGridPaper', h1: 'Lined Paper', desc: 'Generate free printable lined paper. Choose College Ruled or Wide Ruled.' },
  '/checklist': { title: 'Printable Checklist Paper | FreeGridPaper', h1: 'Checklist Paper', desc: 'Stay organized with free printable checklist templates. Standard lined paper with checkboxes.' },
  '/faq': { title: 'Frequently Asked Questions | FreeGridPaper', h1: 'Frequently Asked Questions', desc: 'Answers to common questions about generating and printing grid paper PDFs on FreeGridPaper.' },
};

async function prerender() {
  const indexHtmlPath = path.resolve(distPath, "index.html");
  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`Error: index.html not found in ${distPath}. Build the client first.`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, "utf-8");

  // Also we want to keep schema.org data in head but let's make it more robust.
  const domain = "https://freegridpaper.com";
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const [route, config] of Object.entries(ROUTES)) {
    const routeDir = route === "/" ? distPath : path.resolve(distPath, route.slice(1));
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    const canonicalUrl = `${domain}${route}`;

    // Schema specific to WebPage
    const routeSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": config.title,
      "description": config.desc,
      "url": canonicalUrl
    };

    const schemaString = JSON.stringify(routeSchema);

    const titleRegex = /<title>(.*?)<\/title>/;
    const descRegex = /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/;
    
    let html = templateHtml.replace(titleRegex, `<title>${config.title}</title>`);
    
    const newTags = `
      <meta name="description" content="${config.desc}" />
      <link rel="canonical" href="${canonicalUrl}" />
      <meta property="og:title" content="${config.title}" />
      <meta property="og:description" content="${config.desc}" />
      <meta property="og:url" content="${canonicalUrl}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${config.title}" />
      <meta name="twitter:description" content="${config.desc}" />
      <script type="application/ld+json">${schemaString}</script>
    `;

    if (descRegex.test(html)) {
      html = html.replace(descRegex, newTags);
    } else {
      // If missing, inject before </head>
      html = html.replace('</head>', `${newTags}</head>`);
    }

    // Inject crawler-friendly hidden H1 in body
    const headerHtml = `
      <div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
        <h1>${config.h1}</h1>
        <p>${config.desc}</p>
      </div>
    `;
    
    html = html.replace('<div id="root"></div>', `${headerHtml}<div id="root"></div>`);

    fs.writeFileSync(path.resolve(routeDir, "index.html"), html, "utf-8");
    console.log(`Prerendered: ${route}`);

    sitemapXml += `  <url>\n    <loc>${canonicalUrl}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
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

  // Create a 404.html template based on the generated HTML and default strings
  const route404Dir = distPath;
  const config404 = { title: "404 Not Found - FreeGridPaper", h1: "404 Not Found", desc: "The page you are looking for could not be found." };
  let html404 = templateHtml.replace(/<title>(.*?)<\/title>/, `<title>${config404.title}</title>`);
  
  html404 = html404.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, 
    `<meta name="description" content="${config404.desc}" />\n<meta name="robots" content="noindex" />`);
  fs.writeFileSync(path.resolve(route404Dir, "not-found.html"), html404, "utf-8");
  console.log("Generated not-found.html");
}

prerender().catch(err => {
  console.error(err);
  process.exit(1);
});

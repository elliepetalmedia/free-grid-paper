import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { indexableEntries } from '../client/src/content/index';

// Build-output tests: these verify what npm run build actually
// produced in dist/public, not what the source code intends.
// They must run AFTER a build, which is why the Netlify build
// command is `npm run check && npm run build && npm test`: tests
// run against the fresh dist. Running them without a build fails
// loudly with the message below, instead of silently passing on
// stale output. Locally: run `npm run build` first, then `npm test`.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distPath = path.join(repoRoot, 'dist', 'public');

function requireDist(): void {
  assert.ok(
    fs.existsSync(path.join(distPath, 'index.html')),
    'dist/public/index.html is missing: run `npm run build` before `npm test`',
  );
}

// Prerender escapes HTML entities in titles and descriptions
// (a title such as "D&D" is written as "D&amp;D"), so assertions
// against built HTML must compare the escaped form.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function distFileFor(canonicalPath: string): string {
  return canonicalPath === '/'
    ? path.join(distPath, 'index.html')
    : path.join(distPath, canonicalPath.slice(1), 'index.html');
}

function readDist(canonicalPath: string): string {
  requireDist();
  return fs.readFileSync(distFileFor(canonicalPath), 'utf-8');
}

test('every indexable route has a prerendered HTML artifact with correct metadata', () => {
  requireDist();
  // 74 routes: templates 24, guides 19, presets 18, categories 7, pages 6.
  assert.equal(indexableEntries.length, 74, `expected 74 indexable entries, got ${indexableEntries.length}`);
  const byKind = new Map<string, number>();
  for (const entry of indexableEntries) byKind.set(entry.kind, (byKind.get(entry.kind) ?? 0) + 1);
  assert.equal(byKind.get('template'), 24);
  assert.equal(byKind.get('guide'), 19);
  assert.equal(byKind.get('preset'), 18);
  assert.equal(byKind.get('category'), 7);
  assert.equal(byKind.get('site'), 6);

  for (const entry of indexableEntries) {
    const html = readDist(entry.canonicalPath);
    assert.ok(
      html.includes(`<title>${escapeHtml(entry.title)}</title>`),
      `${entry.canonicalPath} is missing its title`,
    );
    assert.ok(
      html.includes(`<link rel="canonical" href="https://freegridpaper.com${entry.canonicalPath}" />`),
      `${entry.canonicalPath} is missing its production slash canonical`,
    );
    assert.ok(
      html.includes('<meta name="robots" content="index,follow,max-image-preview:large" />'),
      `${entry.canonicalPath} is missing its indexable robots meta`,
    );
    assert.ok(
      html.includes(`<meta property="og:url" content="https://freegridpaper.com${entry.canonicalPath}" />`),
      `${entry.canonicalPath} is missing its og:url`,
    );
    assert.ok(!html.includes('netlify.app'), `${entry.canonicalPath} leaks a preview host into prerendered output`);
    assert.ok(html.includes('data-prerender-only'), `${entry.canonicalPath} is missing prerendered body content`);
  }
});

test('sitemap entries match the registry and the built files', () => {
  requireDist();
  const indexXml = fs.readFileSync(path.join(distPath, 'sitemap.xml'), 'utf-8');
  const expectedSegments = [
    ['sitemap-templates.xml', 24],
    ['sitemap-presets.xml', 18],
    ['sitemap-guides.xml', 19],
    ['sitemap-categories.xml', 7],
    ['sitemap-pages.xml', 6],
  ] as const;
  for (const [fileName, count] of expectedSegments) {
    assert.ok(indexXml.includes(`/${fileName}`), `sitemap index is missing ${fileName}`);
    const xml = fs.readFileSync(path.join(distPath, fileName), 'utf-8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    assert.equal(locs.length, count, `${fileName} should list ${count} URLs, got ${locs.length}`);
    for (const loc of locs) {
      const url = new URL(loc);
      assert.equal(url.origin, 'https://freegridpaper.com', `${loc} is not a production URL`);
      assert.ok(fs.existsSync(distFileFor(url.pathname)), `sitemap URL ${loc} has no prerendered file`);
      assert.ok(
        indexableEntries.some((entry) => entry.canonicalPath === url.pathname),
        `sitemap URL ${loc} is not an indexable canonical path`,
      );
    }
  }
  const allLocs = expectedSegments
    .flatMap(([fileName]) => [...fs.readFileSync(path.join(distPath, fileName), 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)])
    .map((match) => match[1]);
  assert.equal(allLocs.length, 74);
  for (const phantom of ['/templates/poster-hex/', '/graph-paper/', '/guides/how-to-print-grid-paper/']) {
    assert.ok(!allLocs.includes(`https://freegridpaper.com${phantom}`), `phantom ${phantom} must not be in the sitemap`);
  }
  assert.ok(
    !allLocs.includes('https://freegridpaper.com/guides/free-grid-paper-for-teachers/'),
    'the teachers guide must not be in the sitemap',
  );
});

test('404 pages are identical, static, noindex, and have no canonical', () => {
  requireDist();
  const file404 = path.join(distPath, '404.html');
  const notFound = path.join(distPath, 'not-found.html');
  assert.ok(fs.existsSync(file404), 'dist/public/404.html is missing');
  assert.ok(fs.existsSync(notFound), 'dist/public/not-found.html is missing');
  const html404 = fs.readFileSync(file404, 'utf-8');
  const htmlNotFound = fs.readFileSync(notFound, 'utf-8');
  assert.equal(html404, htmlNotFound, '404.html and not-found.html must be identical');

  assert.ok(html404.includes('<title>404 Page Not Found | FreeGridPaper</title>'), 'static 404 title is wrong');
  assert.ok(html404.includes('<meta name="robots" content="noindex,nofollow" />'), 'static 404 must be noindex,nofollow');
  assert.ok(!html404.includes('rel="canonical"'), 'static 404 must have no canonical link');
  assert.ok(!html404.includes('index,follow'), 'static 404 must not carry indexable robots');

  // Meaningful static content, visible with JavaScript disabled:
  // a heading, a brief explanation, and a homepage link, outside
  // the React root so it is hidden (not duplicated) once the app
  // loads, via the data-prerender-only rule in client/index.html.
  assert.ok(html404.includes('<h1 class="text-2xl font-bold text-gray-900">404 Page Not Found</h1>'));
  assert.ok(html404.includes('The page you are looking for could not be found.'));
  assert.ok(html404.includes('<a href="/">Return to the homepage</a>'));
  assert.ok(html404.includes('data-prerender-only="true"'), 'static 404 content must be marked prerender-only');
  const rootIndex = html404.indexOf('<div id="root"></div>');
  const staticIndex = html404.indexOf('404 Page Not Found</h1>');
  assert.ok(staticIndex !== -1 && staticIndex < rootIndex, 'static 404 content must be outside the React root');
  // The static classes must exist in the built CSS, or the page
  // would render unstyled for no-JavaScript visitors.
  const cssFiles = fs.readdirSync(path.join(distPath, 'assets')).filter((file) => file.endsWith('.css'));
  assert.ok(cssFiles.length > 0, 'no built CSS found');
  const css = cssFiles.map((file) => fs.readFileSync(path.join(distPath, 'assets', file), 'utf-8')).join('\n');
  for (const className of ['min-h-screen', 'bg-gray-50', 'max-w-md', 'text-2xl', 'font-bold', 'text-gray-900', 'text-sm', 'text-gray-600']) {
    assert.ok(css.includes(`.${className}`), `built CSS is missing .${className} used by the static 404 page`);
  }
});

test('service worker has no navigation fallback to the homepage', () => {
  requireDist();
  const swPath = path.join(distPath, 'sw.js');
  assert.ok(fs.existsSync(swPath), 'dist/public/sw.js is missing');
  const sw = fs.readFileSync(swPath, 'utf-8');
  // A NavigationRoute bound to index.html would serve the homepage
  // shell for every navigation, including unknown and phantom URLs,
  // bypassing Netlify 301s and 404s for service-worker-controlled
  // browsers. Its absence is the behaviour this test guards: a
  // regression restoring navigateFallback must fail here.
  assert.ok(!sw.includes('NavigationRoute'), 'service worker must not contain a NavigationRoute');
  assert.ok(!sw.includes('createHandlerBoundToURL'), 'service worker must not bind navigations to a URL');
  assert.ok(!sw.includes('navigateFallback'), 'service worker must not contain a navigate fallback');
  // The intended document caching strategy is preserved.
  assert.ok(sw.includes('NetworkFirst'), 'service worker must keep the NetworkFirst document strategy');
  assert.ok(sw.includes('html-cache'), 'service worker must keep the html-cache name');

  const viteConfig = fs.readFileSync(path.join(repoRoot, 'vite.config.ts'), 'utf-8');
  assert.ok(
    viteConfig.includes('navigateFallback: null'),
    'vite.config.ts must set workbox navigateFallback to null',
  );
});

test('production and preview indexing protections in built output', () => {
  requireDist();
  // Every prerendered canonical is the production origin, never a
  // preview host, even when the build runs in a preview context.
  for (const entry of indexableEntries) {
    const html = readDist(entry.canonicalPath);
    assert.ok(!html.includes('netlify.app'), `${entry.canonicalPath} leaks a preview host`);
  }
  // robots.txt points crawlers at the production sitemap.
  const robots = fs.readFileSync(path.join(distPath, 'robots.txt'), 'utf-8');
  assert.ok(robots.includes('Allow: /'));
  assert.ok(robots.includes('Sitemap: https://freegridpaper.com/sitemap.xml'));

  // write-headers.ts is the preview safeguard for non-HTML files.
  // Run it as a subprocess in each CONTEXT and restore dist state.
  const headersPath = path.join(distPath, '_headers');
  const hadHeaders = fs.existsSync(headersPath);
  const originalHeaders = hadHeaders ? fs.readFileSync(headersPath, 'utf-8') : null;
  try {
    for (const [context, expectFile, expectContent] of [
      ['production', false, null],
      ['deploy-preview', true, 'X-Robots-Tag: noindex, nofollow'],
      ['branch-deploy', true, 'X-Robots-Tag: noindex, nofollow'],
    ] as const) {
      if (fs.existsSync(headersPath)) fs.unlinkSync(headersPath);
      const result = spawnSync('npx', ['tsx', 'scripts/write-headers.ts'], {
        cwd: repoRoot,
        env: { ...process.env, CONTEXT: context },
        encoding: 'utf-8',
      });
      assert.equal(result.status, 0, `write-headers failed for CONTEXT=${context}: ${result.stderr}`);
      assert.equal(fs.existsSync(headersPath), expectFile, `CONTEXT=${context} _headers presence is wrong`);
      if (expectContent) {
        assert.ok(fs.readFileSync(headersPath, 'utf-8').includes(expectContent));
      }
    }
    // Unset CONTEXT leaves a _headers file unchanged.
    fs.writeFileSync(headersPath, 'sentinel\n');
    const unset = spawnSync('npx', ['tsx', 'scripts/write-headers.ts'], {
      cwd: repoRoot,
      env: { ...process.env, CONTEXT: undefined },
      encoding: 'utf-8',
    });
    assert.equal(unset.status, 0, `write-headers failed for unset CONTEXT: ${unset.stderr}`);
    assert.equal(fs.readFileSync(headersPath, 'utf-8'), 'sentinel\n', 'unset CONTEXT must leave _headers unchanged');
  } finally {
    if (originalHeaders === null) {
      if (fs.existsSync(headersPath)) fs.unlinkSync(headersPath);
    } else {
      fs.writeFileSync(headersPath, originalHeaders, 'utf-8');
    }
  }
});

test('built discovery files and template specs are present and consistent', () => {
  requireDist();
  for (const fileName of ['llms.txt', 'llms-full.txt', 'robots.txt']) {
    assert.ok(fs.existsSync(path.join(distPath, fileName)), `dist/public/${fileName} is missing`);
  }
  const specs = JSON.parse(fs.readFileSync(path.join(distPath, 'data', 'template-specs.json'), 'utf-8')) as {
    templates: unknown[];
    presets: unknown[];
    guides: unknown[];
  };
  assert.equal(specs.templates.length, 24);
  assert.equal(specs.presets.length, 18);
  assert.equal(specs.guides.length, 19);
});

test('no prerendered page links to a phantom URL or a missing internal path', () => {
  requireDist();
  const phantomSources = new Set([
    '/templates/poster-hex/',
    '/templates/poster-hex',
    '/graph-paper/',
    '/graph-paper',
    '/guides/how-to-print-grid-paper/',
    '/guides/how-to-print-grid-paper',
  ]);
  const htmlFiles: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'index.html') htmlFiles.push(full);
    }
  };
  walk(distPath);
  assert.ok(htmlFiles.length >= 74, `expected at least 74 prerendered HTML files, got ${htmlFiles.length}`);

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    for (const match of html.matchAll(/href="(\/[^"#]*)"/g)) {
      const href = match[1];
      assert.ok(!phantomSources.has(href), `${file} links to phantom URL ${href}`);
      const target = href.split('?')[0];
      const targetPath = target === '/'
        ? path.join(distPath, 'index.html')
        : target.endsWith('/')
          ? path.join(distPath, target.slice(1), 'index.html')
          : path.join(distPath, target.slice(1));
      assert.ok(fs.existsSync(targetPath), `${file} links to missing internal path ${href}`);
    }
  }
});

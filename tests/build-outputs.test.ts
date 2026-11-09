import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { guides, indexableEntries, presets, templates } from '../client/src/content/index';

// Build-output tests: these verify what npm run build actually
// produced in dist/public, not what the source code intends.
// They run as part of `npm test`, which builds first, or
// standalone as `npm run test:build` after `npm run build`.
// Running them without a build fails loudly with the message
// below, instead of silently passing on stale output.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distPath = path.join(repoRoot, 'dist', 'public');

// Run scripts/write-headers.ts portably: invoking Node directly
// through process.execPath with `--import tsx` works on Linux,
// macOS, and Windows alike. The previous `npx tsx` invocation
// fails on Windows, where npx resolves to a .cmd shim that
// spawnSync cannot launch without a shell. `node --import tsx`
// needs Node >= 20.6 (tsx 4.x). No `shell: true` is used.
function runWriteHeaders(context: string | undefined): ReturnType<typeof spawnSync> {
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/write-headers.ts'], {
    cwd: repoRoot,
    env: { ...process.env, CONTEXT: context },
    encoding: 'utf-8',
  });
  assert.equal(
    result.error,
    undefined,
    `write-headers failed to launch for CONTEXT=${context ?? 'unset'}: ${result.error}`,
  );
  assert.equal(
    result.status,
    0,
    `write-headers failed for CONTEXT=${context ?? 'unset'}: exit ${result.status}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
  );
  return result;
}

function requireDist(): void {
  assert.ok(
    fs.existsSync(path.join(distPath, 'index.html')),
    'dist/public/index.html is missing: run `npm test` (which builds first) or `npm run build` before `npm run test:build`',
  );
}

// Expected counts are derived from the authoritative content
// registry, never hard-coded: a legitimate new page must not
// require a test edit. The only hard-coded counts in this file
// live in the clearly labelled content-inventory guard test
// below, which is an intentional snapshot, not a build check.
function entriesByKind(kind: string) {
  return indexableEntries.filter((entry) => entry.kind === kind);
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
  // Registry shape, derived from the registry itself: every entry
  // must have a unique slash canonical (root excepted), so a
  // duplicate or missing route is caught without hard-coding how
  // many pages the site has today.
  assert.ok(indexableEntries.length > 0, 'the content registry has no indexable entries');
  const canonicalPaths = indexableEntries.map((entry) => entry.canonicalPath);
  assert.equal(new Set(canonicalPaths).size, canonicalPaths.length, 'duplicate canonical paths in the registry');
  for (const canonicalPath of canonicalPaths) {
    assert.ok(
      canonicalPath === '/' || canonicalPath.endsWith('/'),
      `canonical path ${canonicalPath} must carry a trailing slash`,
    );
  }

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

// CONTENT-INVENTORY GUARD (intentional snapshot, not a build
// check): this is the one place that asserts exact page counts.
// It exists to catch accidental content loss, for example a
// deleted template or guide that the registry-derived tests
// below would silently accept because they follow the registry.
// When a page is legitimately added or removed, update these
// numbers deliberately in this test only. Counts as of 2026-11-09:
// 74 total indexable pages: templates 24, guides 19, presets 18,
// categories 7, site pages 6.
test('content inventory guard: registry size matches the expected snapshot', () => {
  assert.equal(indexableEntries.length, 74, `expected 74 indexable entries, got ${indexableEntries.length}`);
  assert.equal(entriesByKind('template').length, 24);
  assert.equal(entriesByKind('guide').length, 19);
  assert.equal(entriesByKind('preset').length, 18);
  assert.equal(entriesByKind('category').length, 7);
  assert.equal(entriesByKind('site').length, 6);
});

test('sitemap entries match the registry and the built files', () => {
  requireDist();
  // Expected segments are derived from the registry by kind, so
  // adding a page updates the expectation automatically; the
  // inventory guard above is what catches accidental loss.
  const expectedSegments: ReadonlyArray<readonly [string, string[]]> = [
    ['sitemap-templates.xml', entriesByKind('template').map((entry) => entry.canonicalPath)],
    ['sitemap-presets.xml', entriesByKind('preset').map((entry) => entry.canonicalPath)],
    ['sitemap-guides.xml', entriesByKind('guide').map((entry) => entry.canonicalPath)],
    ['sitemap-categories.xml', entriesByKind('category').map((entry) => entry.canonicalPath)],
    ['sitemap-pages.xml', entriesByKind('site').map((entry) => entry.canonicalPath)],
  ];
  const indexXml = fs.readFileSync(path.join(distPath, 'sitemap.xml'), 'utf-8');
  const indexedFiles = [...indexXml.matchAll(/<loc>[^<]*\/([^<]+\.xml)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(
    [...indexedFiles].sort(),
    expectedSegments.map(([fileName]) => fileName).sort(),
    'sitemap index must list exactly the five expected segment files',
  );
  const allLocs: string[] = [];
  for (const [fileName, expectedPaths] of expectedSegments) {
    assert.ok(indexXml.includes(`/${fileName}`), `sitemap index is missing ${fileName}`);
    const xml = fs.readFileSync(path.join(distPath, fileName), 'utf-8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    // Set equality, not just a count: a missing, duplicate, or
    // unexpected URL fails, and the comparison is order-free.
    const expectedLocs = expectedPaths.map((pathname) => `https://freegridpaper.com${pathname}`);
    assert.equal(new Set(locs).size, locs.length, `${fileName} lists duplicate URLs`);
    assert.deepEqual([...locs].sort(), [...expectedLocs].sort(), `${fileName} does not match its registry entries`);
    for (const loc of locs) {
      const url = new URL(loc);
      assert.equal(url.origin, 'https://freegridpaper.com', `${loc} is not a production URL`);
      assert.ok(fs.existsSync(distFileFor(url.pathname)), `sitemap URL ${loc} has no prerendered file`);
    }
    allLocs.push(...locs);
  }
  assert.equal(allLocs.length, indexableEntries.length, 'total sitemap URLs must equal the registry size');
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
      runWriteHeaders(context);
      assert.equal(fs.existsSync(headersPath), expectFile, `CONTEXT=${context} _headers presence is wrong`);
      if (expectContent) {
        assert.ok(fs.readFileSync(headersPath, 'utf-8').includes(expectContent));
      }
    }
    // Unset CONTEXT leaves a _headers file unchanged.
    fs.writeFileSync(headersPath, 'sentinel\n');
    runWriteHeaders(undefined);
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
  // template-specs.json must mirror the registry exactly: same
  // entries by id and by canonical path, no missing or extra
  // entries. Counts are derived from the registry, so adding a
  // page updates the expectation automatically.
  const specs = JSON.parse(fs.readFileSync(path.join(distPath, 'data', 'template-specs.json'), 'utf-8')) as {
    templates: Array<{ id: string; path: string }>;
    presets: Array<{ id: string; path: string }>;
    guides: Array<{ id: string; path: string }>;
  };
  for (const [specEntries, registryEntries, label] of [
    [specs.templates, templates, 'templates'],
    [specs.presets, presets, 'presets'],
    [specs.guides, guides, 'guides'],
  ] as const) {
    assert.deepEqual(
      [...specEntries.map((entry) => entry.id)].sort(),
      [...registryEntries.map((entry) => entry.id)].sort(),
      `template-specs.json ${label} ids do not match the registry`,
    );
    assert.deepEqual(
      [...specEntries.map((entry) => entry.path)].sort(),
      [...registryEntries.map((entry) => `https://freegridpaper.com${entry.canonicalPath}`)].sort(),
      `template-specs.json ${label} paths do not match the registry`,
    );
  }
  // llms-full.txt must list every template, guide, and category
  // canonical URL from the registry, and llms.txt must point at
  // the sitemap and the full discovery file.
  const llmsFull = fs.readFileSync(path.join(distPath, 'llms-full.txt'), 'utf-8');
  for (const entry of [...templates, ...guides, ...entriesByKind('category')]) {
    assert.ok(
      llmsFull.includes(`https://freegridpaper.com${entry.canonicalPath}`),
      `llms-full.txt is missing ${entry.canonicalPath}`,
    );
  }
  const llms = fs.readFileSync(path.join(distPath, 'llms.txt'), 'utf-8');
  assert.ok(llms.includes('https://freegridpaper.com/sitemap.xml'), 'llms.txt is missing the sitemap URL');
  assert.ok(
    llms.includes('https://freegridpaper.com/data/template-specs.json'),
    'llms.txt is missing the template-specs URL',
  );
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
  // Exactly one index.html per visible registry entry: a missing
  // file means a route was not prerendered, and an extra one means
  // unexpected output. 404.html and not-found.html are not named
  // index.html, so they are not counted here.
  const expectedHtmlFiles = indexableEntries.filter((entry) => entry.indexable).length;
  assert.equal(
    htmlFiles.length,
    expectedHtmlFiles,
    `expected ${expectedHtmlFiles} prerendered HTML files, got ${htmlFiles.length}`,
  );

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

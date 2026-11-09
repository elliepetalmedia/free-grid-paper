import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PHANTOM_REDIRECTS, resolvePhantomRedirect } from '../client/src/lib/redirects';
import { getTemplateByPath } from '../client/src/content/index';

// Phantom URLs are paths that do not exist as pages but that search
// engines already show, because the old Netlify SPA fallback served
// them as 200 root content. Each one must 301 to the real page, and
// every other unknown path must 404 instead of resolving to a real
// template or to the homepage.
test('phantom redirects map exactly to the three real pages', () => {
  assert.deepEqual(
    PHANTOM_REDIRECTS.map((redirect) => [redirect.from, redirect.to]),
    [
      ['/templates/poster-hex/', '/poster-hex/'],
      ['/graph-paper/', '/graph/'],
      ['/guides/how-to-print-grid-paper/', '/guides/how-to-print-at-actual-size/'],
    ],
  );
});

test('phantom redirects match slash and no-slash variants', () => {
  assert.equal(resolvePhantomRedirect('/templates/poster-hex/'), '/poster-hex/');
  assert.equal(resolvePhantomRedirect('/templates/poster-hex'), '/poster-hex/');
  assert.equal(resolvePhantomRedirect('/graph-paper/'), '/graph/');
  assert.equal(resolvePhantomRedirect('/graph-paper'), '/graph/');
  assert.equal(resolvePhantomRedirect('/guides/how-to-print-grid-paper/'), '/guides/how-to-print-at-actual-size/');
  assert.equal(resolvePhantomRedirect('/guides/how-to-print-grid-paper'), '/guides/how-to-print-at-actual-size/');
});

test('the teachers guide has no redirect and must 404', () => {
  assert.equal(resolvePhantomRedirect('/guides/free-grid-paper-for-teachers/'), undefined);
  assert.equal(resolvePhantomRedirect('/guides/free-grid-paper-for-teachers'), undefined);
});

test('real pages are not phantom redirects, and the homepage is not one', () => {
  assert.equal(resolvePhantomRedirect('/'), undefined);
  assert.equal(resolvePhantomRedirect('/graph/'), undefined);
  assert.equal(resolvePhantomRedirect('/poster-hex/'), undefined);
  assert.equal(resolvePhantomRedirect('/templates/'), undefined);
});

test('unknown paths resolve to no template', () => {
  for (const pathname of [
    '/templates/poster-hex/',
    '/graph-paper/',
    '/guides/how-to-print-grid-paper/',
    '/guides/free-grid-paper-for-teachers/',
    '/nonexistent-test-123/',
  ]) {
    assert.equal(getTemplateByPath(pathname), undefined, `${pathname} must not resolve to a template`);
  }
  // Unknown paths with no phantom redirect must 404, not redirect.
  assert.equal(resolvePhantomRedirect('/guides/free-grid-paper-for-teachers/'), undefined);
  assert.equal(resolvePhantomRedirect('/nonexistent-test-123/'), undefined);
});

// netlify.toml is what Netlify actually enforces, so the test reads
// it and verifies it agrees with the mapping above, in order: every
// phantom 301 (both variants) before the /* 404 rule, and no /*
// 200 SPA fallback left behind to swallow unknown URLs.
test('netlify.toml 301s the phantoms and 404s everything else', () => {
  const tomlPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../netlify.toml');
  const toml = fs.readFileSync(tomlPath, 'utf-8');

  const blocks = toml.split('[[redirects]]').slice(1);
  const rules = blocks.map((block) => {
    const from = block.match(/from\s*=\s*"([^"]*)"/)?.[1];
    const to = block.match(/to\s*=\s*"([^"]*)"/)?.[1];
    const status = block.match(/status\s*=\s*(\d+)/)?.[1];
    return { from, to, status };
  });

  const phantomRules = rules.filter((rule) => rule.status === '301');
  for (const redirect of PHANTOM_REDIRECTS) {
    for (const from of [redirect.from, redirect.from.replace(/\/$/, '')]) {
      assert.ok(
        phantomRules.some((rule) => rule.from === from && rule.to === redirect.to),
        `netlify.toml is missing a 301 from ${from} to ${redirect.to}`,
      );
    }
  }

  const fallbackIndex = rules.findIndex((rule) => rule.from === '/*');
  assert.notEqual(fallbackIndex, -1, 'netlify.toml is missing the /* catch-all rule');
  assert.equal(rules[fallbackIndex].to, '/404.html');
  assert.equal(rules[fallbackIndex].status, '404');
  const lastPhantomIndex = Math.max(
    ...PHANTOM_REDIRECTS.flatMap((redirect) => [
      rules.findIndex((rule) => rule.from === redirect.from),
      rules.findIndex((rule) => rule.from === redirect.from.replace(/\/$/, '')),
    ]),
  );
  assert.ok(fallbackIndex > lastPhantomIndex, 'the /* 404 rule must come after every phantom 301');

  assert.ok(
    !rules.some((rule) => rule.from === '/*' && rule.to === '/index.html' && rule.status === '200'),
    'netlify.toml still has the /* 200 SPA fallback',
  );
});

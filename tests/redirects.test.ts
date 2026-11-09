import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getTemplateByPath, indexableEntries } from '../client/src/content/index';

// Phantom URLs are paths that do not exist as pages but that search
// engines already show, because the old Netlify SPA fallback served
// them as 200 root content. netlify.toml is the sole source of truth
// for the redirects: it is the only file Netlify enforces, and no
// runtime code uses these mappings (the earlier TypeScript mirror,
// client/src/lib/redirects.ts, was deleted in this remediation
// because it duplicated netlify.toml and was imported only by this
// test). The expected mappings below are test literals, not a second
// config: they assert what netlify.toml must contain.
// Each phantom 301s to the real page, and every other unknown path
// must 404 instead of resolving to a real template or to the
// homepage.
const EXPECTED_PHANTOM_REDIRECTS: ReadonlyArray<readonly [string, string]> = [
  ['/templates/poster-hex/', '/poster-hex/'],
  ['/graph-paper/', '/graph/'],
  ['/guides/how-to-print-grid-paper/', '/guides/how-to-print-at-actual-size/'],
];

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

interface RedirectRule {
  from: string | undefined;
  to: string | undefined;
  status: string | undefined;
  force: boolean;
}

// Parse the [[redirects]] blocks of netlify.toml structurally. This
// is deliberately not a full TOML parser: the file is small and the
// test asserts the exact fields it cares about, and fails loudly if
// a block is missing a field instead of silently skipping it.
function parseNetlifyRedirects(): RedirectRule[] {
  const toml = fs.readFileSync(path.join(repoRoot, 'netlify.toml'), 'utf-8');
  return toml
    .split('[[redirects]]')
    .slice(1)
    .map((block) => ({
      from: block.match(/from\s*=\s*"([^"]*)"/)?.[1],
      to: block.match(/to\s*=\s*"([^"]*)"/)?.[1],
      status: block.match(/status\s*=\s*(\d+)/)?.[1],
      force: /force\s*=\s*true/.test(block),
    }));
}

test('netlify.toml 301s all three phantom URLs, slash and no-slash', () => {
  const rules = parseNetlifyRedirects();
  const phantomRules = rules.filter((rule) => rule.status === '301');

  // Exactly the three expected mappings, in both forms, nothing more.
  assert.equal(phantomRules.length, EXPECTED_PHANTOM_REDIRECTS.length * 2);
  for (const [from, to] of EXPECTED_PHANTOM_REDIRECTS) {
    for (const variant of [from, from.replace(/\/$/, '')]) {
      const rule = phantomRules.find((candidate) => candidate.from === variant);
      assert.ok(rule, `netlify.toml is missing a 301 from ${variant}`);
      assert.equal(rule.to, to, `301 from ${variant} must go to ${to}`);
      assert.equal(rule.force, false, `301 from ${variant} must not force past an existing file`);
    }
  }

  // Every redirect destination is a real indexable page, so a 301
  // cannot land on another phantom or a missing page, and no
  // redirect chains or loops: no target is itself a redirect source.
  const sources = new Set(phantomRules.map((rule) => rule.from));
  for (const [, to] of EXPECTED_PHANTOM_REDIRECTS) {
    assert.ok(
      indexableEntries.some((entry) => entry.canonicalPath === to),
      `redirect target ${to} is not an indexable page`,
    );
    assert.ok(!sources.has(to), `redirect target ${to} is itself a redirect source`);
  }
  assert.equal(new Set(phantomRules.map((rule) => rule.from)).size, phantomRules.length, 'duplicate redirect sources');
});

test('the teachers guide has no redirect and must 404', () => {
  const rules = parseNetlifyRedirects();
  assert.ok(
    !rules.some((rule) => rule.from?.includes('free-grid-paper-for-teachers')),
    'the teachers guide must not have a redirect rule',
  );
  assert.equal(getTemplateByPath('/guides/free-grid-paper-for-teachers/'), undefined);
  assert.equal(getTemplateByPath('/guides/free-grid-paper-for-teachers'), undefined);
});

test('real pages are not redirect sources, and the homepage is not one', () => {
  const rules = parseNetlifyRedirects();
  const sources = rules.map((rule) => rule.from);
  for (const pathname of ['/', '/graph/', '/poster-hex/', '/templates/']) {
    assert.ok(!sources.includes(pathname), `${pathname} must not be a redirect source`);
  }
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
});

test('netlify.toml has exactly one catch-all, last, 404ing to /404.html', () => {
  const rules = parseNetlifyRedirects();

  // No competing _redirects file: Netlify processes _redirects
  // before netlify.toml, so a stray one could silently override it.
  assert.ok(!fs.existsSync(path.join(repoRoot, '_redirects')), 'a _redirects file would override netlify.toml');
  assert.ok(
    !fs.existsSync(path.join(repoRoot, 'client', 'public', '_redirects')),
    'a _redirects file in client/public would override netlify.toml',
  );

  const catchAlls = rules.filter((rule) => rule.from === '/*');
  assert.equal(catchAlls.length, 1, 'there must be exactly one /* catch-all rule');
  const catchAll = catchAlls[0];
  assert.equal(catchAll.to, '/404.html');
  assert.equal(catchAll.status, '404');
  assert.equal(rules.indexOf(catchAll), rules.length - 1, 'the /* 404 rule must be last, after every 301');

  assert.ok(
    !rules.some((rule) => rule.from === '/*' && rule.to === '/index.html' && rule.status === '200'),
    'netlify.toml still has the /* 200 SPA fallback',
  );
});

test('phantom redirect sources have no prerendered file and are not in the sitemap', () => {
  // Netlify serves an existing static file before a non-forced
  // redirect, so a phantom source with a prerendered file would
  // never 301. This guards that shadowing, using the content
  // registry: no phantom source is an indexable canonical path.
  const canonicalPaths = new Set(indexableEntries.map((entry) => entry.canonicalPath));
  for (const [from] of EXPECTED_PHANTOM_REDIRECTS) {
    assert.ok(!canonicalPaths.has(from), `phantom source ${from} is an indexable page`);
    assert.ok(!canonicalPaths.has(from.replace(/\/$/, '')), `phantom source ${from} is an indexable page`);
  }
  assert.ok(!canonicalPaths.has('/guides/free-grid-paper-for-teachers/'));
});

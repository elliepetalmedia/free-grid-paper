import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PRODUCTION_ORIGIN,
  canonicalPathForRoute,
  canonicalUrlForPath,
  isProductionHost,
  robotsForHost,
} from '../client/src/lib/canonical';
import { getTemplateByPath, indexableEntries, sitePages } from '../client/src/content/index';

// Canonicals must always point at production, even when the app runs
// on a Netlify preview, because a preview canonical contradicting the
// prerendered production canonical is a conflicting search signal.
test('canonical URLs always use the production origin', () => {
  assert.equal(canonicalUrlForPath('/graph/'), 'https://freegridpaper.com/graph/');
  assert.equal(canonicalUrlForPath('/'), 'https://freegridpaper.com/');
  assert.equal(PRODUCTION_ORIGIN, 'https://freegridpaper.com');
});

test('canonical paths carry a trailing slash, except root', () => {
  assert.equal(canonicalPathForRoute('/graph'), '/graph/');
  assert.equal(canonicalPathForRoute('/graph/'), '/graph/');
  assert.equal(canonicalPathForRoute('/'), '/');
  assert.equal(canonicalPathForRoute('/templates'), '/templates/');
  assert.equal(canonicalPathForRoute('/guides/how-to-plot-points-on-a-coordinate-plane'), '/guides/how-to-plot-points-on-a-coordinate-plane/');
});

test('every indexable entry has a slash canonical, root excepted', () => {
  assert.ok(indexableEntries.length >= 74, `expected at least 74 indexable entries, got ${indexableEntries.length}`);
  for (const entry of indexableEntries) {
    if (entry.canonicalPath === '/') continue;
    assert.ok(entry.canonicalPath.endsWith('/'), `${entry.id} canonicalPath ${entry.canonicalPath} lacks a trailing slash`);
    assert.equal(entry.path, entry.canonicalPath.replace(/\/$/, ''), `${entry.id} route path and canonical path disagree`);
    assert.equal(
      canonicalUrlForPath(entry.canonicalPath),
      `https://freegridpaper.com${entry.canonicalPath}`,
    );
  }
});

test('site pages include root, templates, and faq with slash canonicals', () => {
  const byPath = new Map(sitePages.map((page) => [page.path, page]));
  assert.equal(byPath.get('/')?.canonicalPath, '/');
  assert.equal(byPath.get('/templates')?.canonicalPath, '/templates/');
  assert.equal(byPath.get('/faq')?.canonicalPath, '/faq/');
});

test('preview and other non-production hosts are noindex, production is not', () => {
  assert.equal(robotsForHost('freegridpaper.com'), 'index,follow,max-image-preview:large');
  assert.equal(robotsForHost('www.freegridpaper.com'), 'index,follow,max-image-preview:large');
  assert.equal(robotsForHost('deploy-preview-1--freegridpaper.netlify.app'), 'noindex,nofollow');
  assert.equal(robotsForHost('localhost'), 'noindex,nofollow');
  assert.equal(isProductionHost('freegridpaper.com'), true);
  assert.equal(isProductionHost('deploy-preview-1--freegridpaper.netlify.app'), false);
});

// Trailing slash template lookup: /graph/ must resolve to graph
// paper, not fall back to the default dot grid paper.
test('trailing slash URLs resolve to the correct template', () => {
  assert.equal(getTemplateByPath('/graph')?.id, 'graph-paper');
  assert.equal(getTemplateByPath('/graph/')?.id, 'graph-paper');
  assert.equal(getTemplateByPath('/graph///')?.id, 'graph-paper');
  assert.equal(getTemplateByPath('/dot-grid/')?.id, 'dot-grid');
  assert.equal(getTemplateByPath('/music-staff/')?.id, 'music-staff');
  assert.equal(getTemplateByPath('/coordinate-plane/')?.id, 'coordinate-plane');
  assert.equal(getTemplateByPath('/cornell-notes/')?.id, 'cornell-notes');
  assert.equal(getTemplateByPath('/polar-grid/')?.id, 'polar-grid');
  assert.equal(getTemplateByPath('/isometric-grid/')?.id, 'isometric-grid');
  assert.equal(getTemplateByPath('/'), undefined);
  assert.equal(getTemplateByPath('/no-such-template/'), undefined);
});

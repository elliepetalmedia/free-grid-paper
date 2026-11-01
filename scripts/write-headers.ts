import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Write a Netlify _headers file for non-production deploys only.
// Netlify adds X-Robots-Tag: noindex to Deploy Previews and older
// branch deploys, but not to the most recent branch deploy for a
// branch, so that deploy can be indexed. Client-side robots meta
// only covers HTML pages that run JavaScript, so a PDF, image, or
// sitemap fetched directly from a branch deploy would have no
// protection at all. This step closes that gap with a response
// header that covers every file type, scoped by Netlify's CONTEXT
// environment variable, which is 'production', 'deploy-preview',
// or 'branch-deploy' on Netlify. Production never gets the file:
// if a previous build left one behind, it is removed. Local builds,
// where CONTEXT is unset, are left alone, because dist is not
// deployed from a local machine in this project.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publishDir = path.resolve(__dirname, '../dist/public');
const headersPath = path.join(publishDir, '_headers');
const context = process.env.CONTEXT;

if (context === 'production') {
  if (fs.existsSync(headersPath)) fs.unlinkSync(headersPath);
  console.log('write-headers: production, no X-Robots-Tag file');
} else if (context === 'deploy-preview' || context === 'branch-deploy') {
  fs.mkdirSync(publishDir, { recursive: true });
  fs.writeFileSync(headersPath, '/*\n  X-Robots-Tag: noindex, nofollow\n');
  console.log(`write-headers: ${context}, wrote X-Robots-Tag noindex to dist/public/_headers`);
} else {
  console.log(`write-headers: CONTEXT ${context ?? 'unset'}, leaving dist/public/_headers unchanged`);
}

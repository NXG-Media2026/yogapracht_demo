/**
 * Post-build script: bundelt dist/server/entry.mjs tot dist/client/_worker.js
 * zodat Cloudflare Pages de SSR routes (bijv. /keystatic) kan afhandelen.
 *
 * Cloudflare Pages Advanced Mode:
 * - _worker.js in de output directory wordt automatisch als Worker gebruikt
 * - Statische bestanden worden eerst geserveerd, rest gaat naar de Worker
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

// Bundle server entry into a single _worker.js
console.log('Bundling server entry into _worker.js for Cloudflare Pages...');
execSync(
  'npx esbuild dist/server/entry.mjs --bundle --outfile=dist/client/_worker.js --format=esm --target=es2022 --external:cloudflare:* --external:node:*',
  { stdio: 'inherit' }
);

// Create _routes.json to tell Pages which routes need the Worker
// Alles wat niet in "include" staat wordt als static asset geserveerd
const routesConfig = {
  version: 1,
  include: [
    '/keystatic',
    '/keystatic/*',
    '/_image',
  ],
  exclude: [],
};

writeFileSync('dist/client/_routes.json', JSON.stringify(routesConfig, null, 2));
console.log('Created _routes.json for Cloudflare Pages routing.');
console.log('Done! Ready for Cloudflare Pages deployment.');

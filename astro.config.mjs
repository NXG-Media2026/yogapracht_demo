import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';

// Dev: node adapter voor lokaal. Productie: cloudflare adapter voor /keystatic SSR.
const isDev = process.argv.includes('dev');

let adapter;
if (isDev) {
  adapter = (await import('@astrojs/node')).default({ mode: 'standalone' });
} else {
  adapter = (await import('@astrojs/cloudflare')).default();
}

export default defineConfig({
  site: 'https://www.yogapracht.com',
  output: 'static',
  trailingSlash: 'never',
  adapter,
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    mdx(),
    keystatic(),
    sitemap({
      filter: (page) =>
        !page.includes('/keystatic') &&
        !page.includes('/privacy') &&
        !page.includes('/voorwaarden'),
      lastmod: new Date(),
    }),
  ],
});

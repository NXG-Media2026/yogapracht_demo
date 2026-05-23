import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// Keystatic CMS alleen in dev-mode (lokaal content beheren)
const isDev = process.argv.includes('dev');

let keystatic, nodeAdapter;
if (isDev) {
  keystatic = (await import('@keystatic/astro')).default;
  nodeAdapter = (await import('@astrojs/node')).default;
}

export default defineConfig({
  site: 'https://www.yogapracht.com',
  output: isDev ? 'hybrid' : 'static',
  trailingSlash: 'never',
  ...(isDev ? { adapter: nodeAdapter({ mode: 'standalone' }) } : {}),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    mdx(),
    ...(isDev ? [keystatic()] : []),
    sitemap({
      filter: (page) => !page.includes('/keystatic'),
      lastmod: new Date(),
    }),
  ],
});

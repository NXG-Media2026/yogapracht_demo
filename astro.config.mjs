import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://www.yogapracht.com',
  output: 'static',
  trailingSlash: 'never',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    mdx(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/keystatic'),
    }),
  ],
});

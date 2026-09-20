// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * The canonical origin drives sitemap, RSS, Open Graph and canonical tags.
 * Override it per environment with PUBLIC_SITE_URL (see .env.example).
 */
const site = process.env.PUBLIC_SITE_URL ?? 'https://devtoolsdk.com';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: {
    // 'directory' keeps a guide overview and its chapters in one tree
    // (guides/docker/index.html, guides/docker/installation/index.html) rather
    // than a `guides/docker.html` file sitting beside a `guides/docker/`
    // directory. Both work; this one leaves no sibling name to resolve.
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

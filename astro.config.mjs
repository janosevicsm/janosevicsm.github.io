// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static site for the GitHub Pages user site (no `base`: it is served from the domain root).
export default defineConfig({
  site: 'https://janosevicsm.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});

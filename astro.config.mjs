import { defineConfig } from 'astro/config';
import { redirects } from './src/data/redirects.mjs';

export default defineConfig({
  site: 'https://havocwatches.co.uk',
  output: 'static',
  build: { format: 'file' },
  trailingSlash: 'ignore',
  scopedStyleStrategy: 'class',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  redirects: Object.fromEntries(Object.entries(redirects).filter(([k]) => !/\.(xml|rss)$/.test(k))),
  server: { port: 4331 },
  devToolbar: { enabled: false },
});

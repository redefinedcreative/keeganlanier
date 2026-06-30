// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical site URL — drives sitemap + canonical links. Update if the final domain differs.
  site: 'https://keeganlanier.com',

  build: {
    // Inline the (small) stylesheet into <head> so there's no render-blocking CSS
    // request and @font-face is discovered immediately from the HTML.
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});
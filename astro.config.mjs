// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical site URL — drives sitemap + canonical links. Update if the final domain differs.
  site: 'https://keeganlanier.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});
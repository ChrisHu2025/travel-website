import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { resolve } from 'path';

export default defineConfig({
  site: 'https://explorechina.travel',
  integrations: [tailwind()],
  experimental: {
    contentLayer: true  // 关键：启用内容层API
  },
  vite: {
    resolve: {
      alias: {
        '@layouts': resolve('./src/layouts'),
        '@components': resolve('./src/components'),
        '@content': resolve('./src/content'),
        '@pages': resolve('./src/pages'),
        '@styles': resolve('./src/styles')
      }
    }
  }
});
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { resolve } from 'path';

export default defineConfig({
  site: 'https://explorechina.travel',  // 移除多余空格
  integrations: [tailwind()],
  experimental: {
    contentLayer: true  // 启用Content Layer API
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
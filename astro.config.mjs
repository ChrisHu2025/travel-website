// astro.config.mjs
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';
import { resolve } from 'path';

export default defineConfig({
  site: 'https://explorechina.travel',
  integrations: [tailwind()],
  adapter: vercel({
    // ✅ 关键修复：显式指定 Vercel 支持的运行时
    runtime: 'nodejs20.x' // 或 'nodejs18.x' → 但必须用字符串形式且 Vercel 认可
  }),
  output: 'hybrid',
  experimental: {
    contentLayer: true
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

// astro.config.mjs
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless'; // ✅ 修正：明确指定 serverless 子路径
import { defineConfig } from 'astro/config';
import { resolve } from 'path';

export default defineConfig({
  site: 'https://explorechina.travel',
  integrations: [tailwind()],
  adapter: vercel(), // ✅ 使用 serverless 适配器
  output: 'hybrid', // ✅ 必须为 'hybrid' 才能同时支持静态页和 API 路由
  experimental: {
    contentLayer: true // 启用 Content Layer API（按需保留）
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

// astro.config.mjs
import netlify from '@astrojs/netlify';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { resolve } from 'path';

export default defineConfig({
  site: 'https://explorechina.travel',

  // ✅ 确保这里没有 react()，除非你明确在 .astro 文件中使用了 React 组件
  // 如果之前报错涉及 React 版本冲突，且你只在 admin 中用 CDN 加载 CMS，这里不加 react() 是最安全的
  integrations: [tailwind()],

  // ✅ 关键：使用 Netlify 适配器
  adapter: netlify(),

  // Netlify 支持 hybrid (混合渲染) 和 server (SSR)
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

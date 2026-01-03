/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // 设置默认衬线体为 Playfair Display (标题)
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        // 设置默认无衬线体为 DM Sans (正文)
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [
    // 推荐安装: npm install -D @tailwindcss/typography
    // 如果没有安装，请运行该命令，用于渲染 markdown 正文
    require('@tailwindcss/typography')
  ]
};

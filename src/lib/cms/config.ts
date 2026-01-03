// src/lib/cms/config.ts

// 1. 定义标准区域 (Single Source of Truth)
// GEO Note: 固定枚举值有助于 AI 建立清晰的地理实体关系
export const REGIONS = [
  'North China',
  'Northeast China',
  'East China',
  'Central China',
  'South China',
  'Southwest China',
  'Northwest China',
  'Hong Kong, Macau & Taiwan'
] as const;

// 2. 定义标准季节 (Fixed Options)
// GEO Note: 包含具体的月份说明，有助于 AI 精准匹配时间相关的搜索意图
export const SEASONS = [
  'Spring (Mar-May)',
  'Summer (Jun-Aug)',
  'Autumn (Sep-Nov)',
  'Winter (Dec-Feb)',
  'All Year'
] as const;

export const cmsConfig = {
  // Netlify Identity + Git Gateway 标准配置
  backend: {
    name: 'git-gateway',
    branch: 'main'
  },

  // 站点基础信息
  site_url: 'https://explorechina.travel',
  display_url: 'https://explorechina.travel',

  // 图片存储配置
  // Decap CMS 会将上传的图片存入 GitHub 的这个目录
  media_folder: 'public/images/uploads',
  // Decap CMS 会在 Markdown 前端数据中写入这个路径
  public_folder: '/images/uploads',

  load_config_file: false,

  collections: [
    // ---------------------------------------------------------
    // 1. Destinations (目的地)
    // ---------------------------------------------------------
    {
      name: 'destinations',
      label: 'Destinations',
      label_singular: 'Destination',
      folder: 'src/content/destinations',
      create: true,
      slug: '{{slug}}',
      fields: [
        { label: 'Title', name: 'title', widget: 'string', required: true },
        { label: 'Region', name: 'region', widget: 'select', options: REGIONS, required: true },
        { label: 'City', name: 'city', widget: 'string', required: true },
        // ✅ 修改：多选下拉菜单，确保数据结构化
        {
          label: 'Best Season',
          name: 'best_season',
          widget: 'select',
          multiple: true,
          options: SEASONS,
          required: true,
          hint: 'Select all seasons that apply.'
        },
        { label: 'Card Title', name: 'card_title', widget: 'string', required: true },
        { label: 'Card Summary', name: 'card_summary', widget: 'text', required: true },
        { label: 'Summary', name: 'summary', widget: 'text', required: true },
        { label: 'Cover Image', name: 'image', widget: 'image', required: true },
        { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
        {
          label: 'Path (URL)',
          name: 'path',
          widget: 'string',
          required: true,
          hint: 'Format: city/slug (e.g. beijing/forbidden-city)'
        },
        { label: 'Content', name: 'body', widget: 'markdown', required: true }
      ]
    },

    // ---------------------------------------------------------
    // 2. In-Season (当季推荐)
    // ---------------------------------------------------------
    {
      name: 'in-season',
      label: 'In-Season',
      label_singular: 'Seasonal Highlight',
      folder: 'src/content/in-season',
      create: true,
      slug: '{{slug}}',
      fields: [
        { label: 'Title', name: 'title', widget: 'string', required: true },
        { label: 'Region', name: 'region', widget: 'select', options: REGIONS, required: true },
        { label: 'City', name: 'city', widget: 'string', required: true },
        // ✅ 修改：使用统一常量
        {
          label: 'Best Season',
          name: 'best_season',
          widget: 'select',
          multiple: true,
          options: SEASONS,
          required: true
        },
        { label: 'Card Title', name: 'card_title', widget: 'string', required: true },
        { label: 'Card Summary', name: 'card_summary', widget: 'text', required: true },
        { label: 'Summary', name: 'summary', widget: 'text', required: true },
        { label: 'Cover Image', name: 'image', widget: 'image', required: true },
        { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
        { label: 'Path (URL)', name: 'path', widget: 'string', required: true },
        { label: 'Content', name: 'body', widget: 'markdown', required: true }
      ]
    },

    // ---------------------------------------------------------
    // 3. Resorts (度假胜地)
    // ---------------------------------------------------------
    {
      name: 'resorts',
      label: 'Resorts',
      label_singular: 'Resort',
      folder: 'src/content/resorts',
      create: true,
      slug: '{{slug}}',
      fields: [
        { label: 'Title', name: 'title', widget: 'string', required: true },
        { label: 'Region', name: 'region', widget: 'select', options: REGIONS, required: true },
        { label: 'City', name: 'city', widget: 'string', required: true },
        {
          label: 'Category',
          name: 'category',
          widget: 'select',
          options: ['Beach', 'Mountain', 'Urban', 'Desert', 'Cultural'],
          default: 'Beach'
        },
        // ✅ 修改：使用统一常量
        {
          label: 'Best Season',
          name: 'best_season',
          widget: 'select',
          multiple: true,
          options: SEASONS,
          required: true
        },
        { label: 'Card Title', name: 'card_title', widget: 'string', required: true },
        { label: 'Card Summary', name: 'card_summary', widget: 'text', required: true },
        { label: 'Summary', name: 'summary', widget: 'text', required: true },
        { label: 'Cover Image', name: 'image', widget: 'image', required: true },
        { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
        { label: 'Path (URL)', name: 'path', widget: 'string', required: true },
        { label: 'Content', name: 'body', widget: 'markdown', required: true }
      ]
    },

    // ---------------------------------------------------------
    // 4. Stories (旅行故事)
    // ---------------------------------------------------------
    {
      name: 'stories',
      label: 'Stories',
      label_singular: 'Story',
      folder: 'src/content/stories',
      create: true,
      slug: '{{slug}}',
      fields: [
        { label: 'Title', name: 'title', widget: 'string', required: true },
        { label: 'Region', name: 'region', widget: 'select', options: REGIONS, required: true },
        { label: 'City', name: 'city', widget: 'string', required: true },
        // ✅ 修改：使用统一常量
        {
          label: 'Best Season',
          name: 'best_season',
          widget: 'select',
          multiple: true,
          options: SEASONS,
          required: true
        },
        { label: 'Card Title', name: 'card_title', widget: 'string', required: true },
        { label: 'Card Summary', name: 'card_summary', widget: 'text', required: true },
        { label: 'Summary', name: 'summary', widget: 'text', required: true },
        { label: 'Cover Image', name: 'image', widget: 'image', required: true },
        { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
        { label: 'Author', name: 'author', widget: 'string', required: true },
        { label: 'Date', name: 'date', widget: 'datetime', required: true },
        { label: 'Path (URL)', name: 'path', widget: 'string', required: true },
        { label: 'Content', name: 'body', widget: 'markdown', required: true }
      ]
    },

    // ---------------------------------------------------------
    // 5. Homepage Configuration
    // ---------------------------------------------------------
    {
      name: 'homepage',
      label: 'Homepage',
      files: [
        {
          label: 'Hero Content',
          name: 'hero',
          file: 'src/content/homepage/hero.yaml',
          fields: [
            { label: 'Main Title', name: 'title', widget: 'string' },
            { label: 'Description', name: 'description', widget: 'string' },
            { label: 'Background Image', name: 'image', widget: 'image' }
          ]
        },
        {
          label: 'Current Display Section',
          name: 'current-display',
          file: 'src/content/homepage/current-display.yaml',
          fields: [
            {
              label: 'Left Top Card',
              name: 'left_top_card',
              widget: 'relation',
              collection: 'destinations',
              search_fields: ['title'],
              value_field: '{{slug}}',
              display_fields: ['title']
            },
            {
              label: 'Left Bottom Card',
              name: 'left_bottom_card',
              widget: 'relation',
              collection: 'in-season',
              search_fields: ['title'],
              value_field: '{{slug}}',
              display_fields: ['title']
            },
            {
              label: 'Middle Top Card',
              name: 'middle_top_card',
              widget: 'relation',
              collection: 'destinations',
              search_fields: ['title'],
              value_field: '{{slug}}',
              display_fields: ['title']
            },
            {
              label: 'Middle Bottom Card',
              name: 'middle_bottom_card',
              widget: 'relation',
              collection: 'resorts',
              search_fields: ['title'],
              value_field: '{{slug}}',
              display_fields: ['title']
            },
            {
              label: 'Right Cards',
              name: 'right_cards',
              widget: 'list',
              field: {
                label: 'Card',
                name: 'card',
                widget: 'relation',
                collection: 'stories',
                search_fields: ['title'],
                value_field: '{{slug}}',
                display_fields: ['title']
              }
            }
          ]
        }
        // GEO Note: Removed 'Scroll Sections' to simplify homepage for now based on your previous request to simplify
        // If you need it back, you can add it here.
      ]
    }
  ]
};

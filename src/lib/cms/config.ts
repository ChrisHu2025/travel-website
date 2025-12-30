// src/lib/cms/config.ts

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

export type Region = (typeof REGIONS)[number];

export const cmsConfig = {
  // ✅ 关键修改：使用 Netlify 专属的 git-gateway
  backend: {
    name: 'git-gateway',
    branch: 'main'
  },
  site_url: 'https://explorechina.travel',
  display_url: 'https://explorechina.travel',
  media_folder: 'public/images/uploads',
  public_folder: '/images/uploads',
  load_config_file: false,
  collections: [
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
        { label: 'Best Season', name: 'best_season', widget: 'list', required: true }, // 注意：之前建议改为list支持多选
        { label: 'Card Title', name: 'card_title', widget: 'string', required: true },
        { label: 'Card Summary', name: 'card_summary', widget: 'text', required: true },
        { label: 'Summary', name: 'summary', widget: 'text', required: true },
        { label: 'Cover Image', name: 'image', widget: 'image', required: true },
        { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
        // ✅ 核心逻辑字段
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
        { label: 'Best Season', name: 'best_season', widget: 'list', required: true },
        { label: 'Card Title', name: 'card_title', widget: 'string', required: true },
        { label: 'Card Summary', name: 'card_summary', widget: 'text', required: true },
        { label: 'Summary', name: 'summary', widget: 'text', required: true },
        { label: 'Cover Image', name: 'image', widget: 'image', required: true },
        { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
        { label: 'Path (URL)', name: 'path', widget: 'string', required: true },
        { label: 'Content', name: 'body', widget: 'markdown', required: true }
      ]
    },
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
        { label: 'Best Season', name: 'best_season', widget: 'list', required: true },
        { label: 'Card Title', name: 'card_title', widget: 'string', required: true },
        { label: 'Card Summary', name: 'card_summary', widget: 'text', required: true },
        { label: 'Summary', name: 'summary', widget: 'text', required: true },
        { label: 'Cover Image', name: 'image', widget: 'image', required: true },
        { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
        { label: 'Path (URL)', name: 'path', widget: 'string', required: true },
        { label: 'Content', name: 'body', widget: 'markdown', required: true }
      ]
    },
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
        { label: 'Best Season', name: 'best_season', widget: 'list', required: true },
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
            // 这里的 relation 引用是基于文件名(slug)的，这没问题，Decap CMS 内部会处理
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
      ]
    }
  ]
};

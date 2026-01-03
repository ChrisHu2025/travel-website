// src/lib/cms/config.ts

// 1. 定义标准区域
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

// 2. 定义标准季节 (固定5个选项)
export const SEASONS = [
  'Spring (Mar-May)',
  'Summer (Jun-Aug)',
  'Autumn (Sep-Nov)',
  'Winter (Dec-Feb)',
  'All Year'
] as const;

const commonFields = [
  // H1 标题
  {
    label: 'Full Title (H1)',
    name: 'title',
    widget: 'string',
    required: true,
    hint: 'SEO Title for the page header'
  },

  // 核心元数据 (Travel Essentials)
  { label: 'Region', name: 'region', widget: 'select', options: REGIONS, required: true },
  { label: 'City', name: 'city', widget: 'string', required: true },
  {
    label: 'Best Season',
    name: 'best_season',
    widget: 'select',
    multiple: true,
    options: SEASONS,
    required: true,
    hint: 'Select all that apply'
  },

  // 卡片展示专用 (不显示在正文)
  {
    label: 'Card Title (Short)',
    name: 'card_title',
    widget: 'string',
    required: true,
    hint: 'Short title for grid view'
  },
  {
    label: 'Card Summary',
    name: 'card_summary',
    widget: 'text',
    required: true,
    hint: 'Short description for grid view'
  },

  // SEO & Intro
  {
    label: 'SEO Summary / Intro',
    name: 'summary',
    widget: 'text',
    required: true,
    hint: 'Appears at the top of the article body'
  },

  // 封面图 (单张)
  { label: 'Cover Image', name: 'image', widget: 'image', required: true },

  { label: 'Featured', name: 'featured', widget: 'boolean', default: false },

  // 逻辑 URL
  {
    label: 'URL Path',
    name: 'path',
    widget: 'string',
    required: true,
    hint: 'Format: city/slug (e.g. beijing/forbidden-city)'
  },

  // 正文 (支持插入多图 + Alt Text)
  { label: 'Content', name: 'body', widget: 'markdown', required: true }
];

export const cmsConfig = {
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
      fields: commonFields
    },
    {
      name: 'stories',
      label: 'Stories',
      label_singular: 'Story',
      folder: 'src/content/stories',
      create: true,
      slug: '{{slug}}',
      fields: [
        // Stories 需要额外的 Author 和 Date 字段
        ...commonFields.slice(0, 9), // 复用前面的通用字段
        { label: 'Author', name: 'author', widget: 'string', default: 'Explore China Team' },
        {
          label: 'Publish Date',
          name: 'date',
          widget: 'datetime',
          format: 'YYYY-MM-DD',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: false
        },
        ...commonFields.slice(9) // Path & Body
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
        ...commonFields.slice(0, 3), // Title, Region, City
        {
          label: 'Category',
          name: 'category',
          widget: 'select',
          options: ['Beach', 'Mountain', 'Urban', 'Cultural'],
          default: 'Beach'
        },
        ...commonFields.slice(3)
      ]
    },
    {
      name: 'in-season',
      label: 'In-Season',
      label_singular: 'Recommendation',
      folder: 'src/content/in-season',
      create: true,
      slug: '{{slug}}',
      fields: commonFields
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

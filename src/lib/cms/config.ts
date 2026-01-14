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

export const SEASONS = [
  'Spring (Mar-May)',
  'Summer (Jun-Aug)',
  'Autumn (Sep-Nov)',
  'Winter (Dec-Feb)',
  'All Year'
] as const;

// 通用基础字段
const baseFields = [
  { label: 'Full Title (H1)', name: 'title', widget: 'string', required: true, hint: 'SEO Title' },
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
  {
    label: 'Card Title (Short)',
    name: 'card_title',
    widget: 'string',
    required: true,
    hint: 'For grid view'
  },
  {
    label: 'Card Summary',
    name: 'card_summary',
    widget: 'text',
    required: true,
    hint: 'For grid view'
  },
  { label: 'SEO Summary / Intro', name: 'summary', widget: 'text', required: true },
  { label: 'Cover Image', name: 'image', widget: 'image', required: true },
  { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
  {
    label: 'URL Path',
    name: 'path',
    widget: 'string',
    required: true,
    hint: 'Format: city/slug (e.g. beijing/forbidden-city)'
  },
  { label: 'Content', name: 'body', widget: 'markdown', required: true }
];

// Destinations 专用扩展字段
const destinationFields = [
  ...baseFields,
  {
    label: 'Image Gallery',
    name: 'gallery',
    widget: 'list',
    summary: '{{fields.image}}',
    field: { label: 'Image', name: 'image', widget: 'image' },
    required: false,
    hint: 'Upload 3-5 images for the carousel display.'
  },
  {
    label: 'Key Highlights',
    name: 'highlights',
    widget: 'list',
    summary: '{{fields.point}}',
    field: { label: 'Point', name: 'point', widget: 'string' },
    min: 3,
    max: 3,
    required: false,
    hint: 'Add exactly 3 points: 2 subjective experiences + 1 objective fact.'
  }
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
    // ✨ 新增：城市管理 (Cities)
    {
      name: 'cities',
      label: 'Cities (Cover Images)',
      label_singular: 'City Profile',
      folder: 'src/content/cities',
      create: true,
      slug: '{{slug}}',
      fields: [
        {
          label: 'City Name',
          name: 'title',
          widget: 'string',
          required: true,
          hint: 'Must match the City field in Destinations exactly (e.g. Beijing)'
        },
        { label: 'Region', name: 'region', widget: 'select', options: REGIONS, required: true },
        {
          label: 'City Cover Image',
          name: 'image',
          widget: 'image',
          required: true,
          hint: 'High quality cover for L1 Index page'
        },
        {
          label: 'City Description',
          name: 'description',
          widget: 'text',
          required: false,
          hint: 'Short intro for L1 page'
        }
      ]
    },
    // 1. Destinations
    {
      name: 'destinations',
      label: 'Destinations',
      label_singular: 'Destination',
      folder: 'src/content/destinations',
      create: true,
      slug: '{{slug}}',
      fields: destinationFields
    },
    // 2. Stories
    {
      name: 'stories',
      label: 'Stories',
      label_singular: 'Story',
      folder: 'src/content/stories',
      create: true,
      slug: '{{slug}}',
      fields: [
        ...baseFields.slice(0, 9),
        { label: 'Author', name: 'author', widget: 'string', default: 'Explore China Team' },
        {
          label: 'Publish Date',
          name: 'date',
          widget: 'datetime',
          format: 'YYYY-MM-DD',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: false
        },
        ...baseFields.slice(9)
      ]
    },
    // 3. Resorts
    {
      name: 'resorts',
      label: 'Resorts',
      label_singular: 'Resort',
      folder: 'src/content/resorts',
      create: true,
      slug: '{{slug}}',
      fields: [
        ...baseFields.slice(0, 3),
        {
          label: 'Category',
          name: 'category',
          widget: 'select',
          options: ['Beach', 'Mountain', 'Urban', 'Cultural'],
          default: 'Beach'
        },
        ...baseFields.slice(3)
      ]
    },
    // 4. In-Season
    {
      name: 'in-season',
      label: 'In-Season',
      label_singular: 'Recommendation',
      folder: 'src/content/in-season',
      create: true,
      slug: '{{slug}}',
      fields: baseFields
    },
    // 5. Homepage
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

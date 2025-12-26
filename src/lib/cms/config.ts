// src/lib/cms/config.ts

export const cmsConfig = {
  backend: {
    name: 'github',
    repo: 'ChrisHu2025/travel-website',
    branch: 'main',
    auth_type: 'oauth',
    auth_endpoint: 'https://explorechina.travel/api/decap-cms-github'
  },
  site_url: 'https://explorechina.travel',
  display_url: 'https://explorechina.travel',
  media_folder: 'public/images/uploads',
  public_folder: '/images/uploads',
  load_config_file: false,
  collections: [
    {
      name: 'destinations',
      label: '推荐目的地',
      label_singular: '目的地',
      folder: 'src/content/destinations',
      create: true,
      slug: '{{slug}}',
      fields: [
        { label: '标题', name: 'title', widget: 'string', required: true },
        { label: 'Region', name: 'region', widget: 'string', required: true },
        { label: 'City', name: 'city', widget: 'string', required: true },
        { label: 'Summary', name: 'summary', widget: 'string', required: true },
        { label: 'Best Season', name: 'season', widget: 'string', required: true },
        { label: 'Cover Image', name: 'image', widget: 'image', required: true },
        { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
        { label: 'Detailed Introduction', name: 'body', widget: 'markdown', required: true }
      ]
    },
    {
      name: 'in-season',
      label: '当季推荐',
      label_singular: '季节目的地',
      folder: 'src/content/in-season',
      create: true,
      slug: '{{slug}}',
      fields: [
        { label: '标题', name: 'title', widget: 'string', required: true },
        {
          label: 'Season',
          name: 'season',
          widget: 'string',
          required: true,
          hint: 'e.g., Spring, Summer, Autumn, Winter or specific months'
        },
        { label: 'Region', name: 'region', widget: 'string', required: true },
        {
          label: 'Summary',
          name: 'summary',
          widget: 'string',
          required: true,
          hint: 'Short description for card display (80-120 characters)'
        },
        {
          label: 'Best Time',
          name: 'best_time',
          widget: 'string',
          required: true,
          hint: 'Most specific optimal viewing period'
        },
        {
          label: 'Cover Image',
          name: 'image',
          widget: 'image',
          required: true,
          hint: 'Main hero image for the seasonal destination'
        },
        {
          label: 'Featured',
          name: 'featured',
          widget: 'boolean',
          default: false,
          hint: 'Mark for homepage and featured sections'
        },
        {
          label: 'Detailed Description',
          name: 'body',
          widget: 'markdown',
          required: true,
          hint: 'Full detailed description with history, best practices, and travel tips'
        },
        {
          label: 'Must-See Features',
          name: 'features',
          widget: 'list',
          hint: 'List of key attractions or viewing spots'
        },
        {
          label: 'Travel Tips',
          name: 'travel_tips',
          widget: 'list',
          hint: 'Practical advice for visitors'
        }
      ]
    },
    {
      name: 'resorts',
      label: '度假胜地',
      label_singular: '度假村',
      folder: 'src/content/resorts',
      create: true,
      slug: '{{slug}}',
      fields: [
        { label: 'Resort Name', name: 'title', widget: 'string', required: true },
        {
          label: 'Category',
          name: 'category',
          widget: 'string',
          required: true,
          hint: 'Beach, Mountain, Cultural, Spa, etc.'
        },
        { label: 'Location', name: 'location', widget: 'string', required: true },
        {
          label: 'Summary',
          name: 'summary',
          widget: 'string',
          required: true,
          hint: 'Short description for card display (80-120 characters)'
        },
        {
          label: 'Best Season',
          name: 'season',
          widget: 'string',
          required: true,
          hint: 'Peak season or best time to visit'
        },
        {
          label: 'Cover Image',
          name: 'image',
          widget: 'image',
          required: true,
          hint: 'Main hero image for the resort'
        },
        {
          label: 'Featured',
          name: 'featured',
          widget: 'boolean',
          default: false,
          hint: 'Mark for homepage and featured sections'
        },
        {
          label: 'Detailed Description',
          name: 'body',
          widget: 'markdown',
          required: true,
          hint: 'Full detailed description with amenities, activities, and travel tips'
        },
        {
          label: 'Amenities',
          name: 'amenities',
          widget: 'list',
          hint: 'List of resort facilities and services'
        },
        {
          label: 'Travel Tips',
          name: 'travel_tips',
          widget: 'list',
          hint: 'Practical advice for visitors'
        }
      ]
    },
    {
      name: 'stories',
      label: '旅行故事',
      label_singular: '故事',
      folder: 'src/content/stories',
      create: true,
      slug: '{{slug}}',
      fields: [
        { label: 'Story Title', name: 'title', widget: 'string', required: true },
        { label: 'City', name: 'city', widget: 'string', required: true },
        { label: 'Author', name: 'author', widget: 'string', required: true },
        { label: 'Date', name: 'date', widget: 'datetime', required: true },
        { label: 'Excerpt', name: 'excerpt', widget: 'text', required: true },
        { label: 'Cover Image', name: 'image', widget: 'image', required: true },
        { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
        { label: 'Season', name: 'season', widget: 'string' },
        { label: 'Reading Time', name: 'reading_time', widget: 'number' },
        { label: 'Tags', name: 'tags', widget: 'list' },
        { label: 'Full Story', name: 'body', widget: 'markdown', required: true }
      ]
    },
    {
      name: 'homepage',
      label: '首页配置',
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
              value_field: 'title'
            },
            {
              label: 'Left Bottom Card',
              name: 'left_bottom_card',
              widget: 'relation',
              collection: 'in-season',
              search_fields: ['title'],
              value_field: 'title'
            },
            {
              label: 'Middle Top Card',
              name: 'middle_top_card',
              widget: 'relation',
              collection: 'destinations',
              search_fields: ['title'],
              value_field: 'title'
            },
            {
              label: 'Middle Bottom Card',
              name: 'middle_bottom_card',
              widget: 'relation',
              collection: 'resorts',
              search_fields: ['title'],
              value_field: 'title'
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
                value_field: 'title'
              }
            }
          ]
        },
        {
          label: 'Scroll Sections',
          name: 'scroll-sections',
          file: 'src/content/homepage/scroll-sections.yaml',
          fields: [
            {
              label: 'Destinations Section',
              name: 'destinations_section',
              widget: 'relation',
              collection: 'destinations',
              multiple: true,
              max: 3,
              search_fields: ['title'],
              value_field: 'title'
            },
            {
              label: 'In Season Section',
              name: 'in_season_section',
              widget: 'relation',
              collection: 'in-season',
              multiple: true,
              max: 3,
              search_fields: ['title'],
              value_field: 'title'
            },
            {
              label: 'Resorts Section',
              name: 'resorts_section',
              widget: 'relation',
              collection: 'resorts',
              multiple: true,
              max: 3,
              search_fields: ['title'],
              value_field: 'title'
            },
            {
              label: 'Stories Section',
              name: 'stories_section',
              widget: 'relation',
              collection: 'stories',
              multiple: true,
              max: 3,
              search_fields: ['title'],
              value_field: 'title'
            }
          ]
        }
      ]
    }
  ]
};

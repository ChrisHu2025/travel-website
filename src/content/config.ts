// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const REGIONS = [
  'North China',
  'Northeast China',
  'East China',
  'Central China',
  'South China',
  'Southwest China',
  'Northwest China',
  'Hong Kong, Macau & Taiwan'
] as const;

// 通用 Schema
const commonSchema = z.object({
  title: z.string(),
  region: z.enum(REGIONS),
  city: z.string(),
  best_season: z.array(z.string()),
  card_title: z.string().max(50, 'Card title too long'),
  card_summary: z.string(),
  summary: z.string(),
  image: z.string(),
  featured: z.boolean().default(false),
  path: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/, "Path must be 'city/slug'"),
  // Destinations 专用可选字段
  gallery: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  // Stories 专用可选字段
  author: z.string().optional(),
  date: z.date().optional(),
  // Resorts 专用可选字段
  category: z.string().optional()
});

// ✨ 新增：Cities Schema
const citiesSchema = z.object({
  title: z.string(), // City Name
  region: z.enum(REGIONS),
  image: z.string(), // Cover Image
  description: z.string().optional()
});

const destinations = defineCollection({ type: 'content', schema: commonSchema });
const inSeason = defineCollection({ type: 'content', schema: commonSchema });
const resorts = defineCollection({ type: 'content', schema: commonSchema });
const stories = defineCollection({ type: 'content', schema: commonSchema });
const cities = defineCollection({ type: 'content', schema: citiesSchema });

export const collections = {
  destinations,
  'in-season': inSeason,
  resorts,
  stories,
  cities // 导出 cities
};

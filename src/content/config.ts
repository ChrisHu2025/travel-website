import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// 基础schema - 所有集合共享
const baseSchema = z.object({
  title: z.string(),
  image: z.string().url(),
  summary: z.string(),
  body: z.string().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  date: z.coerce.date().optional(),
  author: z.string().optional(),
  author_bio: z.string().optional(),
  introduction: z.string().optional(),
  introduction_title: z.string().optional(),
  best_time: z.string().optional(),
  getting_there: z.string().optional(),
  local_tips: z.string().optional(),
  cultural_notes: z.string().optional(),
  subtitle: z.string().optional()
});

// destinations: 需要 region, city, season
const destinationsSchema = baseSchema.extend({
  region: z.string(),
  city: z.string(),
  season: z.string()
});

// stories: 需要 city, author, date, excerpt
const storiesSchema = baseSchema.extend({
  city: z.string(),
  author: z.string(),
  date: z.coerce.date(),
  excerpt: z.string()
});

// in-season: 需要 season, region
const inSeasonSchema = baseSchema.extend({
  season: z.string(),
  region: z.string()
});

// resorts: 需要 category, location
const resortsSchema = baseSchema.extend({
  category: z.string(),
  location: z.string()
});

// 定义集合 - 使用新版API
const destinations = defineCollection({
  type: 'content',
  schema: destinationsSchema
});

const stories = defineCollection({
  type: 'content',
  schema: storiesSchema
});

const inSeason = defineCollection({
  type: 'content',
  schema: inSeasonSchema
});

const resorts = defineCollection({
  type: 'content',
  schema: resortsSchema
});

export const collections = {
  destinations,
  stories,
  'in-season': inSeason,
  resorts
};
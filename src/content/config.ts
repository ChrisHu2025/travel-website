import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// 定义集合Schema
const baseSchema = z.object({
  title: z.string(),
  image: z.string().url(),
  summary: z.string(),  // 确保所有集合都有summary字段
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

// 扩展特定集合的Schema
const destinationsSchema = baseSchema.extend({
  region: z.string(),
  city: z.string(),
  season: z.string()
});

const storiesSchema = baseSchema.extend({
  city: z.string(),
  excerpt: z.string(),
  author: z.string(),  // 确保有author字段
  date: z.coerce.date() // 确保有date字段
});

const inSeasonSchema = baseSchema.extend({
  season: z.string(),
  region: z.string()
});

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
  'in-season': inSeason,  // 保持字符串键名
  resorts
};
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// 定义集合Schema
const destinationsSchema = z.object({
  title: z.string(),
  region: z.string(),
  city: z.string(),
  season: z.string(),
  image: z.string().url(),
  summary: z.string(),
  body: z.string().optional(),
  featured: z.boolean().optional(),
  introduction: z.string().optional(),
  introduction_title: z.string().optional(),
  best_time: z.string().optional(),
  getting_there: z.string().optional(),
  local_tips: z.string().optional(),
  cultural_notes: z.string().optional(),
  author: z.string().optional(),
  author_bio: z.string().optional(),
  date: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  subtitle: z.string().optional()
});

const storiesSchema = z.object({
  title: z.string(),
  city: z.string(),
  author: z.string(),
  date: z.coerce.date(),
  excerpt: z.string(),
  image: z.string().url(),
  body: z.string(),
  featured: z.boolean().optional(),
  introduction: z.string().optional(),
  introduction_title: z.string().optional(),
  best_time: z.string().optional(),
  getting_there: z.string().optional(),
  local_tips: z.string().optional(),
  cultural_notes: z.string().optional(),
  author_bio: z.string().optional(),
  tags: z.array(z.string()).optional(),
  subtitle: z.string().optional()
});

const inSeasonSchema = z.object({
  title: z.string(),
  season: z.string(),
  region: z.string(),
  summary: z.string(),
  image: z.string().url(),
  body: z.string().optional(),
  featured: z.boolean().optional(),
  introduction: z.string().optional(),
  introduction_title: z.string().optional(),
  best_time: z.string().optional(),
  getting_there: z.string().optional(),
  local_tips: z.string().optional(),
  cultural_notes: z.string().optional(),
  author: z.string().optional(),
  author_bio: z.string().optional(),
  date: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  subtitle: z.string().optional()
});

const resortsSchema = z.object({
  title: z.string(),
  category: z.string(),
  location: z.string(),
  summary: z.string(),
  image: z.string().url(),
  body: z.string().optional(),
  featured: z.boolean().optional(),
  introduction: z.string().optional(),
  introduction_title: z.string().optional(),
  best_time: z.string().optional(),
  getting_there: z.string().optional(),
  local_tips: z.string().optional(),
  cultural_notes: z.string().optional(),
  author: z.string().optional(),
  author_bio: z.string().optional(),
  date: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  subtitle: z.string().optional()
});

// 定义集合 - 使用正确的名称
const destinations = defineCollection({
  type: 'content',
  schema: destinationsSchema
});

const stories = defineCollection({
  type: 'content',
  schema: storiesSchema
});

// 关键修正：使用 'in-season' 而不是 'inSeason'
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
  'in-season': inSeason,  // 关键修正：使用字符串键名
  resorts
};
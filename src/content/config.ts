import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// 基础Schema
const baseSchema = z.object({
  title: z.string(),
  image: z.string().url(),
  summary: z.string().optional(),
  featured: z.boolean().optional()
});

// 目的地Schema
const destinationsSchema = baseSchema.extend({
  region: z.string(),
  city: z.string(),
  season: z.string(),
  body: z.string().optional()
});

// 故事Schema
const storiesSchema = baseSchema.extend({
  city: z.string(),
  author: z.string(),
  date: z.coerce.date(),
  excerpt: z.string(),
  body: z.string().optional()
});

// 简化的集合定义
const destinations = defineCollection({
  type: 'content',
  schema: destinationsSchema
});

const stories = defineCollection({
  type: 'content',
  schema: storiesSchema
});

export const collections = {
  destinations,
  stories
};
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// 简化的集合Schema
const destinationsSchema = z.object({
  title: z.string(),
  region: z.string(),
  city: z.string(),
  season: z.string(),
  image: z.string().url(),
  summary: z.string(),
  featured: z.boolean().optional()
});

const storiesSchema = z.object({
  title: z.string(),
  city: z.string(),
  author: z.string(),
  date: z.coerce.date(),
  excerpt: z.string(),
  image: z.string().url(),
  featured: z.boolean().optional()
});

// 简化的集合定义 (不使用loader)
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
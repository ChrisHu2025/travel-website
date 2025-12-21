import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 定义集合Schema
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

// 使用正确的内容层API
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
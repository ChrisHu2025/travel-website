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
  featured: z.boolean().optional()
});

const storiesSchema = z.object({
  title: z.string(),
  city: z.string(),
  author: z.string(),
  date: z.coerce.date(),
  excerpt: z.string(),
  image: z.string().url(),
  body: z.string().optional(),
  featured: z.boolean().optional()
});

const inSeasonSchema = z.object({
  title: z.string(),
  season: z.string(),
  region: z.string(),
  summary: z.string(),
  image: z.string().url(),
  body: z.string().optional(),
  featured: z.boolean().optional()
});

const resortsSchema = z.object({
  title: z.string(),
  category: z.string(),
  location: z.string(),
  summary: z.string(),
  image: z.string().url(),
  body: z.string().optional(),
  featured: z.boolean().optional()
});

// 定义集合
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
  inSeason,
  resorts
};
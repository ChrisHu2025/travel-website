// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// 1. 定义区域枚举 (Single Source of Truth)
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

// 2. 定义通用数据模型 (Unified Schema)
// 适用于 destinations, in-season, resorts, stories
const commonSchema = z.object({
  title: z.string(),
  region: z.enum(REGIONS),
  city: z.string(),
  // 必须是数组，例如 ["Spring (Mar-May)", "Autumn (Sep-Nov)"]
  best_season: z.array(z.string()),
  card_title: z.string().max(50, 'Card title too long'), // 稍微放宽一点限制用于测试
  card_summary: z.string(),
  summary: z.string(),
  image: z.string(),
  featured: z.boolean().default(false),
  // 核心逻辑字段：URL 路径
  path: z
    .string()
    .regex(
      /^[a-z0-9-]+\/[a-z0-9-]+$/,
      "Path must be in format 'city/slug' (e.g. beijing/forbidden-city)"
    )
});

// 3. 应用 Schema 到各个集合
const destinations = defineCollection({
  type: 'content',
  schema: commonSchema
});

const inSeason = defineCollection({
  type: 'content',
  schema: commonSchema
});

const resorts = defineCollection({
  type: 'content',
  schema: commonSchema
});

const stories = defineCollection({
  type: 'content',
  schema: commonSchema
});

// 4. 导出集合
export const collections = {
  destinations,
  'in-season': inSeason,
  resorts,
  stories
};

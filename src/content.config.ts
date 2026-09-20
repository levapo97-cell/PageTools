import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** One side of a head-to-head comparison. */
const toolSchema = z.object({
  name: z.string(),
  vendor: z.string().optional(),
  url: z.url().optional(),
  /** 0–5, one decimal. Drives the star widget and the Review schema. */
  rating: z.number().min(0).max(5),
  pricing: z.string(),
  bestFor: z.string(),
  pros: z.array(z.string()).min(1),
  cons: z.array(z.string()).min(1),
});

/** One row of the side-by-side comparison table. */
const comparisonRowSchema = z.object({
  feature: z.string(),
  a: z.string(),
  b: z.string(),
  winner: z.enum(['a', 'b', 'tie']).default('tie'),
});

const reviews = defineCollection({
  loader: glob({ base: './src/content/reviews', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(120),
      description: z.string().min(50).max(300),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('The DevToolSDK Team'),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      /** Overall editorial score for the comparison, 0–5. */
      rating: z.number().min(0).max(5),
      /** Name of the tool that wins overall, or "It depends". */
      verdict: z.string(),
      summary: z.string(),
      tools: z.array(toolSchema).min(1).max(2),
      comparison: z.array(comparisonRowSchema).default([]),
      image: image().optional(),
      imageAlt: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(120),
      description: z.string().min(50).max(300),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('The DevToolSDK Team'),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      image: image().optional(),
      imageAlt: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { reviews, articles };

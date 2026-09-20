import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * One file per guide section, grouped in a folder named after the tool slug:
 *   src/content/guides/docker/installation.md  ->  /guides/docker/installation
 * The tool is therefore the first path segment of the entry id.
 */
const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().max(120),
    description: z.string().min(50).max(300),
    /** Position in the tool's curriculum, 1-based. */
    order: z.number().int().positive(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('The DevToolSDK Team'),
    tags: z.array(z.string()).default([]),
    /** Renders as a HowTo in structured data when true. */
    howto: z.boolean().default(false),
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

export const collections = { guides, articles };

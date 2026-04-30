import { defineCollection, z } from 'astro:content';

const wineShops = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.date(),
    location: z.string(),
    best_for: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(true),
  }),
});

const wineries = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.date(),
    region: z.string(),
    grapes: z.string(),
    price_range: z.string(),
    draft: z.boolean().default(true),
  }),
});

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.date(),
    topic: z.string(),
    draft: z.boolean().default(true),
  }),
});

const bottleNotes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    producer: z.string(),
    region: z.string(),
    grape: z.string(),
    vintage: z.number(),
    price_approx: z.string(),
    date: z.date(),
    draft: z.boolean().default(true),
  }),
});

export const collections = {
  'wine-shops': wineShops,
  'wineries': wineries,
  'guides': guides,
  'bottle-notes': bottleNotes,
};

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(160).optional(),
    publishDate: z.string().optional(),
    coverImage: z.string().optional(),
  }),
});

const faqs = defineCollection({
  type: 'data',
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(0),
    page: z.enum(['home', 'about', 'services']).default('home'),
  }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    text: z.string(),
    rating: z.number().min(1).max(5).default(5),
  }),
});

const settings = defineCollection({
  type: 'data',
  schema: z.record(z.any()),
});

export const collections = { blog, faqs, testimonials, settings };

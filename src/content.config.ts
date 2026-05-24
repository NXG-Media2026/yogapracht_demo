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
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(0),
    page: z.enum(['home', 'about', 'services']).default('home'),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    text: z.string(),
    rating: z.number().min(1).max(5).default(5),
  }),
});

const diensten = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/diensten' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    voorWie: z.string().optional(),
    praktisch: z.string().optional(),
    prijs: z.string().optional(),
  }),
});

const producten = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/producten' }),
  schema: z.object({
    name: z.string(),
    price: z.string(),
    description: z.string().optional(),
    longDescription: z.string().optional(),
    features: z.string().optional(),
    ctaText: z.string().optional(),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,md,mdx}', base: 'src/content/settings' }),
});

export const collections = { blog, faqs, testimonials, diensten, producten, settings };

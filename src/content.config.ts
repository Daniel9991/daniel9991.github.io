// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';

// 2. Import loader(s)
import { file } from 'astro/loaders';

// 3. Import Zod
import { z } from 'astro/zod';

// 4. Define your collection(s)
const projects = defineCollection({
  loader: file("src/data/projects.json"),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    id: z.string(),
    url: z.string().url(),
    technologies: z.array(z.string()),
    imgName: z.string()
  })
});

const socialLinks = defineCollection({
  loader: file("src/data/social-links.json"),
  schema: z.object({
    id: z.string(),
    iconSrc: z.string(),
    link: z.string().url(),
  })
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { projects, socialLinks };
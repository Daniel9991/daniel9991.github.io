// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

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
    imgName: z.string(),
    overview: z.array(z.string()).or(z.undefined())
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

const blogs = defineCollection({
    loader: glob({pattern: '**/[^_]*.md', base: "./src/blog"}),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        author: z.string(),
    })
    
})

const navigation = defineCollection({
  loader: file("src/data/navigation.json"),
  schema: z.object({
    id: z.string(),
    text: z.string(),
    url: z.string()
  })
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { navigation, projects, socialLinks, blogs };

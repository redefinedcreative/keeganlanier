import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Blog collection — scaffolded and launch-ready. Not surfaced in the v1 nav.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

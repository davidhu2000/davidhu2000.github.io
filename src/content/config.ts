import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: ({ image }) => {
    return z.object({
      title: z.string(),
      description: z.string(),
      heroImage: image(),
      pubDate: z.string(),
      tags: z.array(z.string()),
    });
  },
});

export const collections = {
  blog: blogCollection,
};

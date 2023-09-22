import type { ImageMetadata } from "astro";

export interface IPostFrontmatter {
  layout: string;
  title: string;
  description: string;
  pubDate: string;
  heroImage: string;
  tags: string[];
  readingTime: string;
  file: string;
  heroImageMetadata: ImageMetadata;
}

import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import { remarkReadingTime } from "./plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://davidhu.io",
  integrations: [
    mdx({
      remarkPlugins: [remarkReadingTime],
    }),
    sitemap(),
    tailwind(),
    image(),
  ],
});

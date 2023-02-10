import rss, { pagesGlobToRssItems } from "@astrojs/rss";

import { SITE } from "../config";

export async function get() {
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: import.meta.env.SITE,
    items: await pagesGlobToRssItems(import.meta.glob("./blog/*.{md,mdx}")),
  });
}

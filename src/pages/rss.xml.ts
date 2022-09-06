import rss from "@astrojs/rss";

import { SITE } from "../config";

export const get = () => {
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: import.meta.env.SITE,
    items: import.meta.glob("./blog/**/*.{md,mdx}"),
  });
};

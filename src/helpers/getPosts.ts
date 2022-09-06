import type { MarkdownInstance } from "astro";

import type { IPostFrontmatter } from "./frontmatter";

export type TPost = MarkdownInstance<IPostFrontmatter>;

function sortPosts(a: TPost, b: TPost) {
  return new Date(b.frontmatter.pubDate).valueOf() - new Date(a.frontmatter.pubDate).valueOf();
}

export function getPosts() {
  const postsMap = import.meta.glob<TPost>("../pages/blog/*.{md,mdx}", {
    eager: true,
  });

  const posts = Object.values(postsMap);

  return posts.sort(sortPosts);
}

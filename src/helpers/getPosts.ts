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

  const images = import.meta.glob("../assets/blog/**/*", {
    eager: true,
  });

  Object.keys(postsMap).forEach((key) => {
    const post = postsMap[key];

    if (!post) {
      return;
    }

    const heroImageKey = post.frontmatter.heroImage;

    post.frontmatter.heroImageMetadata = images[heroImageKey].default as ImageMetadata;
  });

  const posts = Object.values(postsMap);

  return posts.sort(sortPosts);
}

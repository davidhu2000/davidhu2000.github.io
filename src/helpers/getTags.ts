import type { TPost } from "./getPosts";

export function getTags(posts: TPost[]) {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => tags.add(tag.toLowerCase()));
  });

  return Array.from(tags);
}

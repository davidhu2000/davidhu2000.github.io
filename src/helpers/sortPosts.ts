import type { MarkdownInstance } from "astro";
import type { IPostFrontmatter } from "./frontmatter";

export type TPost = MarkdownInstance<IPostFrontmatter>;

export function sortPosts(a: TPost, b: TPost) {
  return (
    new Date(b.frontmatter.pubDate).valueOf() -
    new Date(a.frontmatter.pubDate).valueOf()
  );
}

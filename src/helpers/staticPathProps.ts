import { CollectionEntry } from "astro:content";

export interface IPageProps {
  page: {
    url: {
      prev?: string;
      next?: string;
    };
    data: CollectionEntry<"blog">;
    currentPage: number;
  };
}

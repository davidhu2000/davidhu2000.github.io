import type { TPost } from "./getPosts";

export interface IPageProps {
  page: {
    url: {
      prev?: string;
      next?: string;
    };
    data: TPost[];
  };
}

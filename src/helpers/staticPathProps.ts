import type { TPost } from "./getPosts";

export interface IPageProps {
  page: {
    data: TPost[];
    currentPage: number;
    url: { prev: string; next: string };
  };
}

export interface IStaticPathProps {
  paginate: (
    posts: TPost[],
    options: {
      pageSize: number;
      params?: { tag: string; tags: string };
      props?: { tag: string };
    }
  ) => IPageProps;
}

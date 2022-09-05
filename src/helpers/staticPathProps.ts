import type { TPost } from "./getPosts";

export interface IPageProps {
  page: {
    data: TPost[];
    currentPage: number;
    url: { prev: string; next: string };
  };
}

export interface IStaticPathProps<Params = undefined, Props = undefined> {
  paginate: (
    posts: TPost[],
    options: {
      pageSize: number;
      params?: Params;
      props?: Props;
    }
  ) => IPageProps;
}

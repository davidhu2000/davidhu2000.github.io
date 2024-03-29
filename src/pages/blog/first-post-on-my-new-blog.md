---
layout: "../../layouts/BlogPost.astro"
title: "First Post on My New Blog"
description: "How did I like using Astro to rebuild my personal site?"
pubDate: "2022-08-30"
heroImage: "../assets/blog/first-post-on-my-new-blog/hero-image.webp"
tags: ["astro", "web-performance"]
---

A few weeks ago, I decided to start building a blog, on top of rebuilding my site. A big decision is choosing a framework. I had a few simple requirements

1. No backend for now. The page should be served statically, so I needed static site generation (SSG).
2. Has to be a framework I have never used before. This is more for personal learning than a technical reason. So, sorry NextJS.
3. Seems like I should've had another reason, so this is to complete the trio.

As I started comparing frameworks, two stood out to me: Gatsby and Astro.

Both can handle SSG. But what stood out to me about Astro (besides being the new shiny new thing), is partial hydration. Because I'm mostly using static content, minimizing javascript is a huge, huge plus. Astro also does a great job comparing itself to other frameworks in their [docs](https://docs.astro.build/en/comparing-astro-vs-other-tools/#gatsby-vs-astro). The performance difference between Astro and Gatsby blew me away. I ran my own lighthouse tests, and Astro's doc site nearly gets 100 across the board.

Now I'm sold, going to try Astro!

I found a template I liked called [AstroWind](https://astrowind.vercel.app/) and started my rebuild journey. Unfortunately, I ran into some startup issues as AstroWind is built using javascript, and I decided to run `npm create astro@latest` and migrated piece by piece from the template into the new site.

I found Astro very easy to learn. The only thing that took me a bit to understand is how to pass props around to different components. There are still a few things I have yet to figure out.

In the `BlogList.astro` file, I used the `getStaticPaths` function, which receives a `paginate` function as a prop. And I had to define the interface myself and did not find any predefined types for the function. (Please let me know if I missed something obvious)

```ts
import { TPost, sortPosts } from "../../helpers/getPosts";

interface Props {
  page: {
    data: TPost[];
    currentPage: number;
    url: { prev: string; next: string };
  };
}

interface IStaticPathProps {
  paginate: (posts: TPost[], { pageSize }: { pageSize: number }) => Props;
}

export async function getStaticPaths({ paginate }: IStaticPathProps) {
  const posts = ((await Astro.glob("../blog/*.{md,mdx}")) as TPost[]).sort(sortPosts);

  return paginate(posts, {
    pageSize: SITE.postsPerPage,
  });
}
```

While not a huge issue, I'd still prefer to have something along the lines of

```ts
export async function getStaticPaths({ paginate }: GetStaticPathProps<TPost>) {
```

similar to what we have with NextJs.

I also find it interesting that in the case below, `greeting` is typed as `number | string` when I expected a type error.

```astro
---
interface Props {
  name: string;
  greeting?: number;
}
let { greeting = "Hello", name } = Astro.props;

greeting = "world";
---

<h1>{greeting}, {name}</h1>
```

From docs:

> Astro supports typing your component props via TypeScript. To enable, export a TypeScript Props interface from your Astro component.

So maybe it's more for convenience than actual strict type checking?

In any case, I'm super excited to run measurements against the new blog site and compare it to that of my old portfolio site (which looked awful on mobile view).

Stay tuned for the measurement results!

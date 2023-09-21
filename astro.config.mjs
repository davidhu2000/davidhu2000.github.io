import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";

import { remarkReadingTime } from "./plugins/remark-reading-time.mjs";

async function fetchTheme(name) {
  const res = await fetch(
    `https://raw.githubusercontent.com/shikijs/shiki/main/packages/shiki/themes/${name}.json`
  );
  return await res.json();
}

const dark = await fetchTheme("github-dark");

console.log("successfully fetched dark theme");

const light = await fetchTheme("min-light");

console.log("successfully fetched light theme");

/** @type {import('rehype-pretty-code').Options} */
const options = {
  theme: {
    dark,
    light,
  },
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    if (!node.properties.className) {
      node.properties.className = [];
    }

    node.properties.className.push("highlighted");
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ["word"];
  },
};

// https://astro.build/config
export default defineConfig({
  site: "https://www.davidhu.io",
  integrations: [mdx(), sitemap(), tailwind(), prefetch()],
  markdown: {
    syntaxHighlight: false,
    // TODO: this plugin does not work for mdx files, need to figure out why
    rehypePlugins: [[rehypePrettyCode, options]],
    remarkPlugins: [remarkReadingTime],
  },
});

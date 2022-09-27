import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";

import { remarkReadingTime } from "./plugins/remark-reading-time.mjs";

const options = {
  theme: "github-dark",
  // TODO: figure out how to toggle themes properly
  // theme: {
  //   dark: "github-dark",
  //   light: "github-light",
  // },
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  // Feel free to add classNames that suit your docs
  onVisitHighlightedLine(node) {
    console.log("here");
    console.log(node);
    node.properties.className.push("highlighted");
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ["word"];
  },
};

// https://astro.build/config
export default defineConfig({
  site: "https://www.davidhu.io",
  integrations: [mdx(), sitemap(), tailwind(), image(), prefetch()],
  markdown: {
    syntaxHighlight: false,
    extendDefaultPlugins: true,
    // TODO: this plugin does not work for mdx files, need to figure out why
    rehypePlugins: [[rehypePrettyCode, options]],
    remarkPlugins: [remarkReadingTime],
  },
});

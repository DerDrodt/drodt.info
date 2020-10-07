import fs from "fs";
import path from "path";
import mdIt from "markdown-it";
import footNote from "markdown-it-footnote";
import anchor from "markdown-it-anchor";
import { extractFrontmatter } from "../../util/markdown";
import type { Post } from "../../types/post";

export default function getPosts(): Post[] {
  return fs
    .readdirSync("content/blog")
    .map((file) => {
      if (path.extname(file) !== ".md") return;

      const match = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/.exec(file);
      if (!match) throw new Error(`Invalid filename '${file}'`);

      const [, pubDate, slug] = match;

      const markdown = fs.readFileSync(`content/blog/${file}`, "utf-8");

      const { content, metadata } = extractFrontmatter(markdown);

      const date = new Date(`${pubDate} UTC+2`);
      metadata.pubDate = pubDate;
      metadata.lang = metadata.lang ?? "en";
      metadata.dateString = new Intl.DateTimeFormat(metadata.lang, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
      const tagString = (metadata.tags as unknown) as string;
      metadata.tags = tagString.split(", ");

      const quotes = metadata.lang === "de" ? `„“‚‘` : `“”‘’`;

      const md = mdIt({
        typographer: true,
        quotes,
      })
        .use(footNote)
        .use(anchor, {
          permalink: true,
          permalinkBefore: false,
          permalinkSymbol: "🔗",
          permalinkHref: (fragment: string) => `blog/${slug}#${fragment}`,
        });

      customizeRules(md, slug, metadata.lang);

      const html: string = md.render(
        content.replace(/^\t+/gm, (match) => match.split("\t").join("  ")),
      );

      return {
        html,
        metadata,
        slug,
      };
    })
    .sort((a, b) => (a.metadata.pubDate < b.metadata.pubDate ? 1 : -1));
}

const customizeRules = (md: any, slug: string, lang: string) => {
  // Customize footnotes

  md.renderer.rules.footnote_ref = (
    tokens: any[],
    idx: number,
    options: any,
    env: any,
    slf: any,
  ) => {
    const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    const caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
    let refId = id;

    if (tokens[idx].meta.subId > 0) {
      refId += ":" + tokens[idx].meta.subId;
    }

    return `<sup class="footnote-ref"><a href="blog/${slug}#fn${id}" id="fnref${refId}">${caption}</a></sup>`;
  };

  md.renderer.rules.footnote_anchor = (
    tokens: any[],
    idx: number,
    options: any,
    env: any,
    slf: any,
  ) => {
    var id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);

    if (tokens[idx].meta.subId > 0) {
      id += ":" + tokens[idx].meta.subId;
    }

    /* ↩ with escape code to prevent display as Apple Emoji on iOS */
    return ` <a href="blog/${slug}#fnref${id}" class="footnote-backref">↩︎</a>`;
  };

  md.renderer.rules.footnote_block_open = (
    tokens: any,
    idx: number,
    options: any,
  ) => {
    return `${
      options.xhtmlOut
        ? '<hr class="footnotes-sep" />'
        : '<hr class="footnotes-sep">'
    }
        <section class="footnotes">
        <h3>${lang === "en" ? "Footnotes" : "Fußnoten"}</h3>
        <ol class="footnotes-list">
`;
  };
};

import fs from "fs";
import path from "path";
import md from "markdown-it";
import footNote from "markdown-it-footnote";
import anchor from "markdown-it-anchor";
import { extractFrontmatter } from "../../util/markdown";
import { makeSlugProcessor } from "../../util/slug";
import { SLUG_PRESERVE_UNICODE } from "../../../config";
import type { Post } from "../../types/post";

const makeSlug = makeSlugProcessor(SLUG_PRESERVE_UNICODE);

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

      const date = new Date(`${pubDate} EDT`);
      metadata.pubDate = pubDate;
      metadata.dateString = date.toDateString();
      const tagString = (metadata.tags as unknown) as string;
      metadata.tags = tagString.split(", ");
      metadata.lang = metadata.lang ?? "en";

      const quotes = metadata.lang === "de" ? `„“‚‘` : `“”‘’`;

      const renderer = md({
        typographer: true,
        quotes,
      })
        .use(footNote)
        .use(anchor, {
          permalink: true,
          permalinkBefore: false,
          permalinkSymbol: "🔗",
          permalinkHref: (fragment) => `blog/${slug}#${fragment}`,
        });

      const html: string = renderer.render(
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

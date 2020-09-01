import type { Metadata } from "../types/post";

export function extractFrontmatter(
  markdown: string,
): { metadata: Metadata; content: string } {
  const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
  const frontMatter = match[1];
  const content = markdown.slice(match[0].length);

  const metadata = {};
  frontMatter.split("\n").forEach((pair) => {
    const colonIndex = pair.indexOf(":");
    metadata[pair.slice(0, colonIndex).trim()] = pair
      .slice(colonIndex + 1)
      .trim();
  });

  return { metadata: (metadata as unknown) as Metadata, content };
}

export function linkRenderer(href: string, title: string, text: string) {
  let target_attr = "";
  let title_attr = "";

  if (href.startsWith("http")) {
    target_attr = ' target="_blank"';
  }

  if (title !== null) {
    title_attr = ` title="${title}"`;
  }

  return `<a href="${href}"${target_attr}${title_attr} rel="noopener noreferrer">${text}</a>`;
}

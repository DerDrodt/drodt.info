import type { PageLoad } from "./$types";

export const load: PageLoad = async function ({ fetch, url }) {
  const res = await fetch("blog.json");
  const posts = await res.json();

  return { posts, tag: url.searchParams.get("tag") };
};

import type { Post } from "src/types/post";
import posts from "./_posts";
import type { RequestHandler } from "./__types/[slug].json";

const lookup = new Map<string, string>();

posts().forEach((post) => {
  lookup.set(post.slug, JSON.stringify(post));
});

const get: RequestHandler = ({ params }) => {
  const slug = params.slug;
  if (lookup.has(slug)) {
    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: lookup.get(slug),
    };
  } else {
    return {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        message: `Not found`,
      },
    };
  }
};

export { get };

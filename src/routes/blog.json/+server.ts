import type { RequestHandler } from "./$types";
import posts from "./_posts";

const contents = JSON.stringify(
  posts().map((post) => {
    return {
      metadata: post.metadata,
      slug: post.slug,
    };
  }),
);

const get: RequestHandler = ({ params }) => {
  return new Response(contents, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};

export { get };

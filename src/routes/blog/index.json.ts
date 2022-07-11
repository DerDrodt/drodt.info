import type { RequestHandler } from "./__types/index.json";
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
  return {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: contents,
  };
};

export { get };

throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");


// @migration task: Check imports
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
  return {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: contents,
  };
};

export { get };

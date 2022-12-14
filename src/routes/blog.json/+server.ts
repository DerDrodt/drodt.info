import type { RequestHandler } from './$types';
import posts from '$lib/gen-posts';

const contents = JSON.stringify(
	posts().map((post) => {
		return {
			metadata: post.metadata,
			slug: post.slug
		};
	})
);

const GET: RequestHandler = () => {
	return new Response(contents, {
		headers: { 'Content-Type': 'application/json; charset=utf-8' }
	});
};

export { GET };

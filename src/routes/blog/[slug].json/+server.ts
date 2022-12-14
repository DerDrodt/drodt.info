import posts from '../_posts';
import type { RequestHandler } from './$types';

const lookup = new Map<string, string>();

posts().forEach((post) => {
	lookup.set(post.slug, JSON.stringify(post));
});

const GET: RequestHandler = ({ params }) => {
	const slug = params.slug;
	if (lookup.has(slug)) {
		return new Response(lookup.get(slug), {
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		});
	} else {
		return new Response('Not found', {
			status: 404,
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		});
	}
};

export { GET };

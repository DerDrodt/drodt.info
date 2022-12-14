import type { RequestHandler } from './$types';
import feed from '$lib/gen-feed';

enum FeedType {
	Rss,
	Json,
	Atom
}

const getFeedType = (type: string): FeedType | undefined => {
	switch (type) {
		case 'rss':
			return FeedType.Rss;
		case 'json':
			return FeedType.Json;
		case 'atom':
			return FeedType.Atom;
		default:
			undefined;
	}
};

const calculateFeed = (type: FeedType): string => {
	switch (type) {
		case FeedType.Rss:
			return feed.rss2();
		case FeedType.Json:
			return feed.json1();
		case FeedType.Atom:
			return feed.atom1();
	}
};

const getContentType = (type: FeedType): string => {
	if (type === FeedType.Json) return 'application/json';
	return 'application/xml';
};

const cache = new Map<FeedType, string>();

const GET: RequestHandler = ({ url }) => {
	const ty = url.searchParams.get('type');

	if (ty === undefined || !(typeof ty === 'string')) {
		return new Response(JSON.stringify(new Error(`Unknown feed type ${ty}`)), {
			status: 400
		});
	}

	const feedType = getFeedType(ty);
	if (feedType === undefined)
		return new Response(JSON.stringify(new Error(`Unknown feed type ${ty}`)), {
			status: 400
		});
	if (!cache.has(feedType)) {
		cache.set(feedType, calculateFeed(feedType));
	}

	return new Response(cache.get(feedType), {
		headers: { 'Content-Type': getContentType(feedType) }
	});
};

export { GET };

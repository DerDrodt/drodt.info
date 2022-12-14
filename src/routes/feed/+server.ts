throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import type { RequestHandler } from "./$types";
import feed from "./_feed";

enum FeedType {
  Rss,
  Json,
  Atom,
}

const getFeedType = (type: string): FeedType | undefined => {
  switch (type) {
    case "rss":
      return FeedType.Rss;
    case "json":
      return FeedType.Json;
    case "atom":
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
  if (type === FeedType.Json) return "application/json";
  return "application/xml";
};

const cache = new Map<FeedType, string>();

const get: RequestHandler = ({ url }) => {
  const ty = url.searchParams.get("type");

  if (ty === undefined || !(typeof ty === "string")) {
    return { status: 400, body: new Error(`Unknown feed type ${ty}`) };
  }

  const feedType = getFeedType(ty);
  if (feedType === undefined)
    return { status: 400, body: new Error(`Unknown feed type ${ty}`) };
  if (!cache.has(feedType)) {
    cache.set(feedType, calculateFeed(feedType));
  }

  return {
    status: 200,
    headers: { "Content-Type": getContentType(feedType) },
    body: cache.get(feedType),
  };
};

export { get };

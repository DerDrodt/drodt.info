import type { Request } from "polka";
import type { ServerResponse } from "http";
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

export function get(req: Request, res: ServerResponse, next: () => void) {
  const { type } = req.query;
  if (type === undefined || !(typeof type === "string")) {
    return next();
  }
  const feedType = getFeedType(type);
  if (feedType === undefined) return next();
  if (!cache.has(feedType)) {
    cache.set(feedType, calculateFeed(feedType));
  }
  res.writeHead(200, {
    "Content-Type": getContentType(feedType),
  });
  res.end(cache.get(feedType));
}

export interface Post {
  slug: string;
  metadata: Metadata;
  html: string;
}

export interface Metadata {
  dateString: string;
  pubDate: string;
  title: string;
  description: string;
  tags: string[];
}

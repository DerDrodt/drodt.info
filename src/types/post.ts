export interface Post {
  slug: string;
  metadata: Metadata;
  html: string;
}

export interface Metadata {
  dateString: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  lang: string;
  wordCount: number;
  timeToRead: number;
  timeToReadString: string;
  isDraft: boolean;
}

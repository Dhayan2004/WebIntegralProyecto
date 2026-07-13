export type SummaryLength =
  | "short"
  | "medium"
  | "detailed";

export type SummaryFilter =
  | "all"
  | "short"
  | "medium"
  | "detailed"
  | "favorites";

export interface StudySummary {
  id: string;
  title: string;
  subject: string;
  sourceDocument: string;
  excerpt: string;
  length: SummaryLength;
  wordCount: number;
  createdAt: string;
  isFavorite: boolean;
}
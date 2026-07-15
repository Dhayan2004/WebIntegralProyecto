export type SummaryFilter =
  | "all"
  | "favorites";

export interface SummaryApi {
  id: string;
  document_id: string | null;
  title: string;
  content: string;
  created_at: string;
}

export interface StudySummary {
  id: string;
  title: string;
  sourceDocument: string;
  excerpt: string;
  wordCount: number;
  createdAt: string;
}

export interface SummaryCreatePayload {
  title?: string;
  content?: string;
  document_id?: string;
}

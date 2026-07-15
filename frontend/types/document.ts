export type DocumentType =
  | "pdf"
  | "word"
  | "presentation"
  | "text";

export type DocumentFilter =
  | "all"
  | "pdf"
  | "word"
  | "presentation"
  | "text";

export interface StudyDocument {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: DocumentType;
  fileName: string;
  size: string;
  pages: number | null;
  createdAt: string;
  isProcessed: boolean;
}
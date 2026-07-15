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

export interface DocumentApi {
  id: string;
  title: string;
  content: string | null;
  subject_id: string | null;
  file_name: string | null;
  file_size_bytes: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StudyDocument {
  id: string;
  title: string;
  subject: string;
  type: DocumentType;
  fileName: string;
  size: string;
  createdAt: string;
  isProcessed: boolean;
}

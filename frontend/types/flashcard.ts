export interface FlashcardApi {
  id: string;
  document_id: string | null;
  question: string;
  answer: string;
  created_at: string;
}

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
}

export interface StudyProgressData {
  total: number;
}

export interface FlashcardCreatePayload {
  question: string;
  answer: string;
  document_id?: string;
}

export interface FlashcardGeneratePayload {
  document_id?: string;
  text?: string;
  count?: number;
}

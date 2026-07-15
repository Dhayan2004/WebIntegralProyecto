export interface QuizApi {
  id: string;
  document_id: string | null;
  question: string;
  options: string[];
  correct_answer: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export interface QuizGeneratePayload {
  document_id?: string;
  text?: string;
  count?: number;
}

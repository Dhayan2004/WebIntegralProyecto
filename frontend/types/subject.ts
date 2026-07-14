export type SubjectColor =
  | "cyan"
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "rose";

export interface SubjectApi {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
}

export interface SubjectCreatePayload {
  name: string;
  description?: string | null;
  color?: string;
}

export interface SubjectUpdatePayload {
  name?: string;
  description?: string | null;
  color?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: SubjectColor;
  backendColor: string;
  documents: number;
  summaries: number;
  flashcards: number;
  createdAt: string;
  updatedAt: string;
}

export type SubjectFilter =
  | "all"
  | "recent";
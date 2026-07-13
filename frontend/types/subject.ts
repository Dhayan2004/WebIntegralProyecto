export type SubjectColor =
  | "cyan"
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "rose";

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: SubjectColor;
  documents: number;
  summaries: number;
  flashcards: number;
  isFavorite: boolean;
  updatedAt: string;
}

export type SubjectFilter = "all" | "favorites" | "recent";
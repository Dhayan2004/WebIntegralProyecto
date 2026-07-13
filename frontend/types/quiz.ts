export type QuizStatus =
  | "pending"
  | "in_progress"
  | "completed";

export type QuizDifficulty =
  | "easy"
  | "medium"
  | "hard";

export type QuizFilter =
  | "all"
  | "pending"
  | "completed";

export interface StudyQuiz {
  id: string;
  title: string;
  subject: string;
  description: string;
  questionCount: number;
  durationMinutes: number;
  difficulty: QuizDifficulty;
  status: QuizStatus;
  score: number | null;
  progress: number;
  lastAttempt: string | null;
}

export interface QuizPerformance {
  averageScore: number;
  completedQuizzes: number;
  pendingQuizzes: number;
  bestScore: number;
  weeklyGoal: number;
  weeklyCompleted: number;
}
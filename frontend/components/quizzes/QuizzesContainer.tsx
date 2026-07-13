"use client";

import { useMemo, useState } from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import FeaturedQuiz from "@/components/quizzes/FeaturedQuiz";
import PerformancePanel from "@/components/quizzes/PerformancePanel";
import QuizList from "@/components/quizzes/QuizList";
import QuizStats from "@/components/quizzes/QuizStats";
import QuizzesHeader from "@/components/quizzes/QuizzesHeader";
import StartQuizModal from "@/components/quizzes/StartQuizModal";
import type {
  QuizFilter,
  QuizPerformance,
  StudyQuiz,
} from "@/types/quiz";

const mockQuizzes: StudyQuiz[] = [
  {
    id: "quiz-next",
    title: "Fundamentos de Next.js",
    subject: "Desarrollo Web",
    description:
      "Evalúa tus conocimientos sobre App Router, componentes, renderizado y organización de rutas.",
    questionCount: 15,
    durationMinutes: 12,
    difficulty: "medium",
    status: "pending",
    score: null,
    progress: 0,
    lastAttempt: null,
  },
  {
    id: "quiz-sql",
    title: "Consultas y relaciones SQL",
    subject: "Bases de Datos",
    description:
      "Repasa SELECT, WHERE, JOIN, GROUP BY y funciones de agregación.",
    questionCount: 20,
    durationMinutes: 15,
    difficulty: "hard",
    status: "completed",
    score: 82,
    progress: 100,
    lastAttempt: "ayer",
  },
  {
    id: "quiz-agile",
    title: "Metodologías ágiles",
    subject: "Ingeniería de Software",
    description:
      "Conceptos de Scrum, Kanban, Sprints y organización de equipos.",
    questionCount: 12,
    durationMinutes: 9,
    difficulty: "easy",
    status: "in_progress",
    score: null,
    progress: 58,
    lastAttempt: "hoy",
  },
  {
    id: "quiz-data",
    title: "Preparación de datos",
    subject: "Análisis de Datos",
    description:
      "Limpieza, valores nulos, duplicados y validación de información.",
    questionCount: 18,
    durationMinutes: 14,
    difficulty: "medium",
    status: "completed",
    score: 91,
    progress: 100,
    lastAttempt: "hace 2 días",
  },
  {
    id: "quiz-english",
    title: "Relative clauses",
    subject: "Inglés",
    description:
      "Uso de who, which, that, where y whose dentro de oraciones.",
    questionCount: 10,
    durationMinutes: 7,
    difficulty: "easy",
    status: "pending",
    score: null,
    progress: 0,
    lastAttempt: null,
  },
];

const mockPerformance: QuizPerformance = {
  averageScore: 86,
  completedQuizzes: 8,
  pendingQuizzes: 3,
  bestScore: 96,
  weeklyGoal: 5,
  weeklyCompleted: 3,
};

export default function QuizzesContainer() {
  const [selectedFilter, setSelectedFilter] =
    useState<QuizFilter>("all");

  const [selectedQuiz, setSelectedQuiz] =
    useState<StudyQuiz | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const featuredQuiz = mockQuizzes[0];

  const filteredQuizzes = useMemo(() => {
    if (selectedFilter === "all") {
      return mockQuizzes;
    }

    if (selectedFilter === "completed") {
      return mockQuizzes.filter(
        (quiz) => quiz.status === "completed",
      );
    }

    return mockQuizzes.filter(
      (quiz) =>
        quiz.status === "pending" ||
        quiz.status === "in_progress",
    );
  }, [selectedFilter]);

  function openQuiz(quiz: StudyQuiz) {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  }

  function createQuiz() {
    setSelectedQuiz(null);
    setIsModalOpen(true);
  }

  return (
    <WorkspaceShell userName="Aarón">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <QuizzesHeader
          totalQuizzes={mockQuizzes.length}
          onCreateQuiz={createQuiz}
        />

        <QuizStats performance={mockPerformance} />

        <FeaturedQuiz
          quiz={featuredQuiz}
          onStart={openQuiz}
        />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,0.8fr)]">
          <QuizList
            quizzes={filteredQuizzes}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            onStart={openQuiz}
          />

          <PerformancePanel
            performance={mockPerformance}
          />
        </div>
      </div>

      <StartQuizModal
        isOpen={isModalOpen}
        selectedQuiz={selectedQuiz}
        onClose={() => setIsModalOpen(false)}
      />
    </WorkspaceShell>
  );
}
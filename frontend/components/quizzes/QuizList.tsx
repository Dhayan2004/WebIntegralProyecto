"use client";

import type {
  QuizFilter,
  StudyQuiz,
} from "@/types/quiz";

import QuizListItem from "@/components/quizzes/QuizListItem";

interface QuizListProps {
  quizzes: StudyQuiz[];
  selectedFilter: QuizFilter;
  onFilterChange: (filter: QuizFilter) => void;
  onStart: (quiz: StudyQuiz) => void;
}

const filters: Array<{
  label: string;
  value: QuizFilter;
}> = [
  {
    label: "Todos",
    value: "all",
  },
  {
    label: "Pendientes",
    value: "pending",
  },
  {
    label: "Completados",
    value: "completed",
  },
];

export default function QuizList({
  quizzes,
  selectedFilter,
  onFilterChange,
  onStart,
}: QuizListProps) {
  return (
    <section aria-labelledby="quiz-list-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="quiz-list-title"
            className="text-display text-xl"
          >
            Tus evaluaciones
          </h2>

          <p className="text-helper mt-1 text-sm">
            Continúa tus intentos o revisa resultados anteriores.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filtrar cuestionarios"
          className="flex flex-wrap gap-2"
        >
          {filters.map((filter) => {
            const isActive =
              selectedFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  onFilterChange(filter.value)
                }
                className={`text-nav rounded-xl px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-brand-cyan text-white"
                    : "bg-brand-card text-dark-body hover:text-dark-title"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <QuizListItem
              key={quiz.id}
              quiz={quiz}
              onStart={onStart}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-brand-border bg-brand-card px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cyan-muted">
              <span className="text-brand">
                CU
              </span>
            </div>

            <h3 className="text-display mt-5 text-xl">
              No hay evaluaciones en esta categoría
            </h3>

            <p className="text-helper mx-auto mt-2 max-w-md text-sm">
              Selecciona otro filtro para consultar tus cuestionarios.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
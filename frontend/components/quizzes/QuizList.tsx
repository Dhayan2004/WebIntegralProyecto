import type { QuizApi } from "@/types/quiz";

interface QuizListProps {
  quizzes: QuizApi[];
}

export default function QuizList({
  quizzes,
}: QuizListProps) {
  return (
    <section aria-labelledby="quiz-list-title">
      <h2
        id="quiz-list-title"
        className="text-display text-xl"
      >
        Tus preguntas
      </h2>
      <p className="text-helper mt-1 text-sm">
        Preguntas generadas por IA disponibles para practicar.
      </p>

      <div className="mt-5 space-y-3">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-2xl border border-brand-border bg-brand-card p-5 shadow-sm"
            >
              <p className="text-nav text-sm text-dark-title">
                {quiz.question}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quiz.options.map((opt) => (
                  <span
                    key={opt}
                    className="rounded-lg bg-brand-bg px-3 py-1 text-xs text-dark-body"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-brand-border bg-brand-card px-6 py-14 text-center">
            <p className="text-helper text-sm">
              No hay preguntas disponibles. Genera un cuestionario desde un documento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

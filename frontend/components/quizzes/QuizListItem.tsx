import type {
    QuizDifficulty,
    QuizStatus,
    StudyQuiz,
  } from "@/types/quiz";
  
  interface QuizListItemProps {
    quiz: StudyQuiz;
    onStart: (quiz: StudyQuiz) => void;
  }
  
  const difficultyLabels: Record<
    QuizDifficulty,
    string
  > = {
    easy: "Fácil",
    medium: "Intermedio",
    hard: "Difícil",
  };
  
  const statusLabels: Record<
    QuizStatus,
    {
      label: string;
      classes: string;
    }
  > = {
    pending: {
      label: "Pendiente",
      classes: "bg-brand-bg text-dark-muted",
    },
    in_progress: {
      label: "En progreso",
      classes: "bg-amber-50 text-amber-700",
    },
    completed: {
      label: "Completado",
      classes: "bg-brand-cyan-muted text-brand-cyan",
    },
  };
  
  export default function QuizListItem({
    quiz,
    onStart,
  }: QuizListItemProps) {
    const status = statusLabels[quiz.status];
  
    return (
      <article className="rounded-2xl border border-brand-border bg-brand-card p-5 shadow-sm transition hover:border-brand-cyan-light">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-cyan-muted">
              <span className="text-brand text-sm">
                CU
              </span>
            </div>
  
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-brand text-xs">
                  {quiz.subject}
                </p>
  
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${status.classes}`}
                >
                  {status.label}
                </span>
              </div>
  
              <h3 className="text-nav mt-2 text-base text-dark-title sm:text-lg">
                {quiz.title}
              </h3>
  
              <p className="text-helper mt-1 text-sm">
                {quiz.questionCount} preguntas ·{" "}
                {quiz.durationMinutes} minutos ·{" "}
                {difficultyLabels[quiz.difficulty]}
              </p>
            </div>
          </div>
  
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:min-w-[310px] lg:justify-end">
            {quiz.status === "completed" &&
            quiz.score !== null ? (
              <div className="rounded-xl bg-brand-bg px-5 py-3 text-center">
                <p className="text-display text-2xl">
                  {quiz.score}%
                </p>
  
                <p className="text-helper text-xs">
                  Calificación
                </p>
              </div>
            ) : (
              <div className="min-w-[130px]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-helper text-xs">
                    Progreso
                  </p>
  
                  <p className="text-nav text-xs text-dark-title">
                    {quiz.progress}%
                  </p>
                </div>
  
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-bg">
                  <div
                    className="h-full rounded-full bg-brand-cyan"
                    style={{
                      width: `${quiz.progress}%`,
                    }}
                  />
                </div>
              </div>
            )}
  
            <button
              type="button"
              onClick={() => onStart(quiz)}
              className="text-nav rounded-xl border border-brand-border px-5 py-3 text-sm text-dark-title transition hover:border-brand-cyan-light hover:text-brand-cyan"
            >
              {quiz.status === "completed"
                ? "Reintentar"
                : quiz.status === "in_progress"
                  ? "Continuar"
                  : "Comenzar"}
            </button>
          </div>
        </div>
      </article>
    );
  }
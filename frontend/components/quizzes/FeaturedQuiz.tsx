import type {
    QuizDifficulty,
    StudyQuiz,
  } from "@/types/quiz";
  
  interface FeaturedQuizProps {
    quiz: StudyQuiz;
    onStart: (quiz: StudyQuiz) => void;
  }
  
  const difficultyLabels: Record<
    QuizDifficulty,
    {
      label: string;
      classes: string;
    }
  > = {
    easy: {
      label: "Fácil",
      classes: "bg-emerald-50 text-emerald-700",
    },
    medium: {
      label: "Intermedio",
      classes: "bg-amber-50 text-amber-700",
    },
    hard: {
      label: "Difícil",
      classes: "bg-rose-50 text-rose-700",
    },
  };
  
  export default function FeaturedQuiz({
    quiz,
    onStart,
  }: FeaturedQuizProps) {
    const difficulty =
      difficultyLabels[quiz.difficulty];
  
    return (
      <section className="relative overflow-hidden rounded-3xl bg-dark-title px-6 py-7 text-white shadow-sm sm:px-8 sm:py-9">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-cyan/20"
        />
  
        <div
          aria-hidden="true"
          className="absolute -bottom-28 right-32 h-52 w-52 rounded-full bg-brand-cyan/10"
        />
  
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                Evaluación recomendada
              </span>
  
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${difficulty.classes}`}
              >
                {difficulty.label}
              </span>
            </div>
  
            <p className="mt-6 text-sm font-semibold text-brand-cyan-light">
              {quiz.subject}
            </p>
  
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {quiz.title}
            </h2>
  
            <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-gray-300 sm:text-base">
              {quiz.description}
            </p>
  
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-xl bg-white/10 px-4 py-2 text-sm">
                {quiz.questionCount} preguntas
              </span>
  
              <span className="rounded-xl bg-white/10 px-4 py-2 text-sm">
                {quiz.durationMinutes} minutos
              </span>
  
              <span className="rounded-xl bg-white/10 px-4 py-2 text-sm">
                Intento libre
              </span>
            </div>
          </div>
  
          <div className="flex shrink-0 flex-col gap-3">
            <button
              type="button"
              onClick={() => onStart(quiz)}
              className="text-nav rounded-xl bg-brand-cyan px-6 py-3 text-sm text-white transition hover:bg-brand-cyan-hover"
            >
              Comenzar evaluación
            </button>
  
            <p className="text-center text-xs font-light text-gray-400">
              Tu progreso se guardará automáticamente
            </p>
          </div>
        </div>
      </section>
    );
  }
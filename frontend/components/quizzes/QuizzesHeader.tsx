interface QuizzesHeaderProps {
    totalQuizzes: number;
    onCreateQuiz: () => void;
  }
  
  export default function QuizzesHeader({
    totalQuizzes,
    onCreateQuiz,
  }: QuizzesHeaderProps) {
    return (
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-brand text-sm">
            Evaluación y progreso
          </p>
  
          <h1 className="text-display mt-2 text-3xl sm:text-4xl">
            Cuestionarios
          </h1>
  
          <p className="text-helper mt-3 max-w-2xl text-sm sm:text-base">
            Pon a prueba tus conocimientos, identifica áreas de mejora y
            continúa fortaleciendo tu aprendizaje.
          </p>
  
          <p className="text-nav mt-3 text-sm text-dark-muted">
            {totalQuizzes}{" "}
            {totalQuizzes === 1
              ? "cuestionario disponible"
              : "cuestionarios disponibles"}
          </p>
        </div>
  
        <button
          type="button"
          onClick={onCreateQuiz}
          className="text-nav inline-flex items-center justify-center gap-2 rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white shadow-sm transition hover:bg-brand-cyan-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="text-lg">
            +
          </span>
  
          Nueva evaluación
        </button>
      </header>
    );
  }
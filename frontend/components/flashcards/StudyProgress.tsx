interface StudyProgressProps {
  progress: {
    total: number;
  };
}

export default function StudyProgress({
  progress,
}: StudyProgressProps) {
  return (
    <section
      aria-labelledby="study-progress-title"
      className="rounded-3xl border border-brand-border bg-brand-card p-5 shadow-sm sm:p-6"
    >
      <div>
        <p className="text-brand text-sm">
          Tu rendimiento
        </p>
        <h2
          id="study-progress-title"
          className="text-display mt-2 text-xl"
        >
          Progreso de estudio
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-brand-bg p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-cyan-muted">
            <span className="text-brand text-xs">TK</span>
          </div>
          <p className="text-display mt-4 text-2xl">
            {progress.total}
          </p>
          <p className="text-helper mt-1 text-xs">
            Total tarjetas
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-brand-cyan-muted p-4">
        <p className="text-nav text-sm text-dark-title">
          Sigue practicando
        </p>
        <p className="text-helper mt-1 text-xs">
          Repasa tus tarjetas para mejorar la retención.
        </p>
      </div>
    </section>
  );
}

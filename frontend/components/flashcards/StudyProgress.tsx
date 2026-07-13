import type { StudyProgressData } from "@/types/flashcard";

interface StudyProgressProps {
  progress: StudyProgressData;
}

const progressItems = [
  {
    key: "mastered",
    label: "Dominadas",
    abbreviation: "OK",
  },
  {
    key: "pending",
    label: "Por repasar",
    abbreviation: "RP",
  },
  {
    key: "streak",
    label: "Días de racha",
    abbreviation: "RC",
  },
  {
    key: "studyMinutes",
    label: "Minutos hoy",
    abbreviation: "TI",
  },
] as const;

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

        <p className="text-helper mt-2 text-sm">
          Mantén la constancia para dominar más conceptos.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {progressItems.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl bg-brand-bg p-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-cyan-muted">
              <span className="text-brand text-xs">
                {item.abbreviation}
              </span>
            </div>

            <p className="text-display mt-4 text-2xl">
              {progress[item.key]}
            </p>

            <p className="text-helper mt-1 text-xs">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-brand-cyan-muted p-4">
        <p className="text-nav text-sm text-dark-title">
          Buen ritmo de estudio
        </p>

        <p className="text-helper mt-1 text-xs">
          Has repasado más tarjetas que la semana anterior.
        </p>
      </div>
    </section>
  );
}
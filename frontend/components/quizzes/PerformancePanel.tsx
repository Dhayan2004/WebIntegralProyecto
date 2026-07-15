import type { QuizPerformance } from "@/types/quiz";

interface PerformancePanelProps {
  performance: QuizPerformance;
}

export default function PerformancePanel({
  performance,
}: PerformancePanelProps) {
  const weeklyPercentage = Math.min(
    (performance.weeklyCompleted /
      performance.weeklyGoal) *
      100,
    100,
  );

  return (
    <section className="rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm">
      <p className="text-brand text-sm">
        Meta semanal
      </p>

      <h2 className="text-display mt-2 text-xl">
        Mantén tu progreso
      </h2>

      <p className="text-helper mt-2 text-sm">
        Completa evaluaciones con regularidad para reforzar los temas
        estudiados.
      </p>

      <div className="mt-6 rounded-2xl bg-brand-bg p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-helper text-xs">
              Cuestionarios completados
            </p>

            <p className="text-display mt-2 text-3xl">
              {performance.weeklyCompleted}
              <span className="ml-1 text-lg text-dark-muted">
                / {performance.weeklyGoal}
              </span>
            </p>
          </div>

          <p className="text-brand text-sm">
            {Math.round(weeklyPercentage)}%
          </p>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-brand-card">
          <div
            className="h-full rounded-full bg-brand-cyan transition-all"
            style={{
              width: `${weeklyPercentage}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {["L", "M", "M", "J", "V", "S", "D"].map(
          (day, index) => {
            const isCompleted =
              index < performance.weeklyCompleted;

            return (
              <div
                key={`${day}-${index}`}
                className="text-center"
              >
                <div
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                    isCompleted
                      ? "bg-brand-cyan text-white"
                      : "bg-brand-bg text-dark-muted"
                  }`}
                >
                  {isCompleted ? "✓" : day}
                </div>
              </div>
            );
          },
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-brand-cyan-muted p-4">
        <p className="text-nav text-sm text-dark-title">
          Recomendación
        </p>

        <p className="text-helper mt-1 text-xs">
          Repasa Bases de Datos: fue la materia con menor puntuación esta
          semana.
        </p>
      </div>
    </section>
  );
}
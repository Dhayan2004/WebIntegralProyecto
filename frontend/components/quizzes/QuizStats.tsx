import type { QuizPerformance } from "@/types/quiz";

interface QuizStatsProps {
  performance: QuizPerformance;
}

export default function QuizStats({
  performance,
}: QuizStatsProps) {
  const stats = [
    {
      label: "Promedio",
      value: `${performance.averageScore}%`,
      abbreviation: "PR",
    },
    {
      label: "Completados",
      value: performance.completedQuizzes,
      abbreviation: "OK",
    },
    {
      label: "Pendientes",
      value: performance.pendingQuizzes,
      abbreviation: "PE",
    },
    {
      label: "Mejor resultado",
      value: `${performance.bestScore}%`,
      abbreviation: "MR",
    },
  ];

  return (
    <section
      aria-label="Resumen de evaluaciones"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4"
    >
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-2xl border border-brand-border bg-brand-card p-5 shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cyan-muted">
            <span className="text-brand text-xs">
              {stat.abbreviation}
            </span>
          </div>

          <p className="text-display mt-5 text-2xl sm:text-3xl">
            {stat.value}
          </p>

          <p className="text-helper mt-1 text-xs sm:text-sm">
            {stat.label}
          </p>
        </article>
      ))}
    </section>
  );
}
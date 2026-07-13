import StatCard from "@/components/dashboard/StatCard";
import type { DashboardMetrics } from "@/types/dashboard";

interface StatsGridProps {
  metrics: DashboardMetrics;
}

export default function StatsGrid({
  metrics,
}: StatsGridProps) {
  const stats = [
    {
      title: "Materias",
      value: metrics.subjects,
      description: "Materias que forman parte de tu espacio de estudio.",
      abbreviation: "MA",
      href: "/subjects",
    },
    {
      title: "Documentos",
      value: metrics.documents,
      description: "Archivos que has agregado a la plataforma.",
      abbreviation: "DO",
      href: "/documents",
    },
    {
      title: "Resúmenes",
      value: metrics.summaries,
      description: "Resúmenes creados para apoyar tu aprendizaje.",
      abbreviation: "RE",
      href: "/summaries",
    },
    {
      title: "Flashcards",
      value: metrics.flashcards,
      description: "Tarjetas disponibles para repasar tus temas.",
      abbreviation: "FL",
      href: "/flashcards",
    },
    {
      title: "Cuestionarios",
      value: metrics.quizzes,
      description: "Evaluaciones generadas para medir tu progreso.",
      abbreviation: "CU",
      href: "/quizzes",
    },
    {
      title: "Mensajes con IA",
      value: metrics.chat_messages,
      description: "Mensajes enviados durante tus sesiones de estudio.",
      abbreviation: "IA",
      href: "/chat",
    },
  ];

  return (
    <section aria-labelledby="dashboard-metrics-title">
      <div className="mb-5">
        <h2
          id="dashboard-metrics-title"
          className="text-display text-xl"
        >
          Tu actividad
        </h2>

        <p className="text-helper mt-1 text-sm">
          Consulta el contenido y las herramientas que has utilizado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            abbreviation={stat.abbreviation}
            href={stat.href}
          />
        ))}
      </div>
    </section>
  );
}
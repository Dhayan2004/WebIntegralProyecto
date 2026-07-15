import ActivityItem from "@/components/dashboard/ActivityItem";

const recentActivities = [
  {
    title: "Documento de Ingeniería de Software",
    description: "Agregaste un nuevo documento a la materia Desarrollo Web.",
    date: "Hoy, 10:30",
    abbreviation: "DO",
    href: "/documents",
  },
  {
    title: "Resumen de Bases de Datos",
    description: "Generaste un resumen con los conceptos principales del tema.",
    date: "Ayer, 18:45",
    abbreviation: "RE",
    href: "/summaries",
  },
  {
    title: "Cuestionario de SQL",
    description: "Completaste una evaluación de práctica con 10 preguntas.",
    date: "11 jul, 16:20",
    abbreviation: "CU",
    href: "/quizzes",
  },
  {
    title: "Sesión con la IA",
    description: "Consultaste dudas relacionadas con arquitectura de software.",
    date: "10 jul, 20:15",
    abbreviation: "IA",
    href: "/chat",
  },
];

export default function RecentActivity() {
  return (
    <section
      aria-labelledby="recent-activity-title"
      className="rounded-2xl border border-brand-border bg-brand-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-2 border-b border-brand-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="recent-activity-title"
            className="text-display text-xl"
          >
            Actividad reciente
          </h2>

          <p className="text-helper mt-1 text-sm">
            Revisa las últimas acciones realizadas dentro de tu cuenta.
          </p>
        </div>

        <p className="text-brand text-sm">
          Últimos movimientos
        </p>
      </div>

      <ul className="mt-2 divide-y divide-brand-border">
        {recentActivities.map((activity) => (
          <ActivityItem
            key={`${activity.title}-${activity.date}`}
            title={activity.title}
            description={activity.description}
            date={activity.date}
            abbreviation={activity.abbreviation}
            href={activity.href}
          />
        ))}
      </ul>
    </section>
  );
}
import QuickActionCard from "@/components/dashboard/QuickActionCard";

const quickActions = [
  {
    title: "Nueva materia",
    description: "Organiza un nuevo espacio para tus contenidos de estudio.",
    abbreviation: "MA",
    href: "/subjects",
  },
  {
    title: "Subir documento",
    description: "Agrega apuntes, archivos o materiales a la plataforma.",
    abbreviation: "DO",
    href: "/documents",
  },
  {
    title: "Generar resumen",
    description: "Crea un resumen para estudiar la información más importante.",
    abbreviation: "RE",
    href: "/summaries",
  },
  {
    title: "Consultar a la IA",
    description: "Haz preguntas y recibe apoyo durante tus sesiones de estudio.",
    abbreviation: "IA",
    href: "/chat",
  },
];

export default function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-title">
      <div className="mb-5">
        <h2
          id="quick-actions-title"
          className="text-display text-xl"
        >
          Acciones rápidas
        </h2>

        <p className="text-helper mt-1 text-sm">
          Continúa estudiando desde una de las herramientas principales.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            abbreviation={action.abbreviation}
            href={action.href}
          />
        ))}
      </div>
    </section>
  );
}
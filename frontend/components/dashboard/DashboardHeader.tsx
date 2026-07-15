interface DashboardHeaderProps {
    userName: string;
  }
  
  export default function DashboardHeader({
    userName,
  }: DashboardHeaderProps) {
    return (
      <header className="rounded-3xl border border-brand-border bg-brand-card px-6 py-7 shadow-sm sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-brand text-sm">
              Panel de estudio
            </p>
  
            <h1 className="text-display mt-2 text-3xl sm:text-4xl">
              Hola, {userName}
            </h1>
  
            <p className="text-helper mt-3 max-w-2xl text-sm sm:text-base">
              Organiza tus materias, consulta tus documentos y continúa
              aprendiendo con las herramientas de inteligencia artificial.
            </p>
          </div>
  
          <div className="rounded-2xl bg-brand-cyan-muted px-5 py-4 lg:max-w-xs">
            <p className="text-nav text-sm text-dark-title">
              Tu espacio está listo
            </p>
  
            <p className="text-helper mt-1 text-sm">
              Retoma una actividad o comienza una nueva sesión de estudio.
            </p>
          </div>
        </div>
      </header>
    );
  }
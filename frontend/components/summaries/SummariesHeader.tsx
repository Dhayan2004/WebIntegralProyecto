interface SummariesHeaderProps {
    totalSummaries: number;
    onGenerate: () => void;
  }
  
  export default function SummariesHeader({
    totalSummaries,
    onGenerate,
  }: SummariesHeaderProps) {
    return (
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-brand text-sm">
            Estudio asistido por IA
          </p>
  
          <h1 className="text-display mt-2 text-3xl sm:text-4xl">
            Mis resúmenes
          </h1>
  
          <p className="text-helper mt-3 max-w-2xl text-sm sm:text-base">
            Consulta y organiza los resúmenes generados a partir de tus
            documentos y materiales.
          </p>
  
          <p className="text-nav mt-3 text-sm text-dark-muted">
            {totalSummaries}{" "}
            {totalSummaries === 1
              ? "resumen generado"
              : "resúmenes generados"}
          </p>
        </div>
  
        <button
          type="button"
          onClick={onGenerate}
          className="text-nav inline-flex items-center justify-center gap-2 rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white shadow-sm transition hover:bg-brand-cyan-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className="text-lg"
          >
            +
          </span>
  
          Generar resumen
        </button>
      </header>
    );
  }
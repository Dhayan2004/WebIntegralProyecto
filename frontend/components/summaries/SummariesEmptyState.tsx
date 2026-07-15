interface SummariesEmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
    onGenerate: () => void;
  }
  
  export default function SummariesEmptyState({
    hasFilters,
    onClearFilters,
    onGenerate,
  }: SummariesEmptyStateProps) {
    return (
      <section className="rounded-3xl border border-dashed border-brand-border bg-brand-card px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cyan-muted">
          <span className="text-brand text-lg">
            RE
          </span>
        </div>
  
        <h2 className="text-display mt-5 text-2xl">
          {hasFilters
            ? "No encontramos resúmenes"
            : "Todavía no tienes resúmenes"}
        </h2>
  
        <p className="text-helper mx-auto mt-3 max-w-md text-sm sm:text-base">
          {hasFilters
            ? "Cambia tu búsqueda o elimina los filtros para consultar nuevamente tus resúmenes."
            : "Genera materiales de estudio a partir de tus documentos utilizando inteligencia artificial."}
        </p>
  
        <button
          type="button"
          onClick={
            hasFilters ? onClearFilters : onGenerate
          }
          className="text-nav mt-6 rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white transition hover:bg-brand-cyan-hover"
        >
          {hasFilters
            ? "Limpiar filtros"
            : "Generar resumen"}
        </button>
      </section>
    );
  }
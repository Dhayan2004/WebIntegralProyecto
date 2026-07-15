interface DocumentsEmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
    onUpload: () => void;
  }
  
  export default function DocumentsEmptyState({
    hasFilters,
    onClearFilters,
    onUpload,
  }: DocumentsEmptyStateProps) {
    return (
      <section className="rounded-3xl border border-dashed border-brand-border bg-brand-card px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cyan-muted">
          <span className="text-brand text-lg">
            DO
          </span>
        </div>
  
        <h2 className="text-display mt-5 text-2xl">
          {hasFilters
            ? "No encontramos documentos"
            : "Todavía no tienes documentos"}
        </h2>
  
        <p className="text-helper mx-auto mt-3 max-w-md text-sm sm:text-base">
          {hasFilters
            ? "Ajusta tu búsqueda o elimina los filtros para consultar nuevamente tus archivos."
            : "Sube tus apuntes y materiales para organizarlos dentro de tus materias."}
        </p>
  
        <button
          type="button"
          onClick={
            hasFilters ? onClearFilters : onUpload
          }
          className="text-nav mt-6 rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white transition hover:bg-brand-cyan-hover"
        >
          {hasFilters
            ? "Limpiar filtros"
            : "Subir documento"}
        </button>
      </section>
    );
  }
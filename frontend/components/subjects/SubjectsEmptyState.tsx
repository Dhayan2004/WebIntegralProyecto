interface SubjectsEmptyStateProps {
    onClearFilters: () => void;
  }
  
  export default function SubjectsEmptyState({
    onClearFilters,
  }: SubjectsEmptyStateProps) {
    return (
      <section className="rounded-3xl border border-dashed border-brand-border bg-brand-card px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cyan-muted">
          <span className="text-brand text-lg">
            MA
          </span>
        </div>
  
        <h2 className="text-display mt-5 text-2xl">
          No encontramos materias
        </h2>
  
        <p className="text-helper mx-auto mt-3 max-w-md text-sm sm:text-base">
          Ajusta tu búsqueda o limpia los filtros para volver a consultar todas
          tus materias.
        </p>
  
        <button
          type="button"
          onClick={onClearFilters}
          className="text-nav mt-6 rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white transition hover:bg-brand-cyan-hover"
        >
          Limpiar filtros
        </button>
      </section>
    );
  }
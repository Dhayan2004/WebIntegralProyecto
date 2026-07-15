import type { DocumentFilter } from "@/types/document";

interface DocumentsToolbarProps {
  searchTerm: string;
  selectedFilter: DocumentFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (
    filter: DocumentFilter,
  ) => void;
}

const filters: Array<{
  label: string;
  value: DocumentFilter;
}> = [
  {
    label: "Todos",
    value: "all",
  },
  {
    label: "PDF",
    value: "pdf",
  },
  {
    label: "Word",
    value: "word",
  },
  {
    label: "Presentaciones",
    value: "presentation",
  },
  {
    label: "Texto",
    value: "text",
  },
];

export default function DocumentsToolbar({
  searchTerm,
  selectedFilter,
  onSearchChange,
  onFilterChange,
}: DocumentsToolbarProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-brand-border bg-brand-card p-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">
      <label className="relative block w-full xl:max-w-md">
        <span className="sr-only">
          Buscar documentos
        </span>

        <span
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted"
        >
          ⌕
        </span>

        <input
          type="search"
          value={searchTerm}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Buscar por título, materia o archivo"
          className="text-helper w-full rounded-xl border border-brand-border bg-brand-bg py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-dark-muted focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light"
        />
      </label>

      <div
        role="group"
        aria-label="Filtrar documentos"
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => {
          const isActive =
            selectedFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                onFilterChange(filter.value)
              }
              className={`text-nav rounded-xl px-4 py-2.5 text-sm transition ${
                isActive
                  ? "bg-brand-cyan text-white"
                  : "bg-brand-bg text-dark-body hover:text-dark-title"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
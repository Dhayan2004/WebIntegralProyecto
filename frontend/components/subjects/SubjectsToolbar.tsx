import type { SubjectFilter } from "@/types/subject";

interface SubjectsToolbarProps {
  searchTerm: string;
  selectedFilter: SubjectFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (
    filter: SubjectFilter,
  ) => void;
}

const filters: Array<{
  label: string;
  value: SubjectFilter;
}> = [
  {
    label: "Todas",
    value: "all",
  },
  {
    label: "Recientes",
    value: "recent",
  },
];

export default function SubjectsToolbar({
  searchTerm,
  selectedFilter,
  onSearchChange,
  onFilterChange,
}: SubjectsToolbarProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-brand-border bg-brand-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <label className="relative block w-full lg:max-w-md">
        <span className="sr-only">
          Buscar materias
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
            onSearchChange(
              event.target.value,
            )
          }
          placeholder="Buscar por nombre o descripción"
          className="text-helper w-full rounded-xl border border-brand-border bg-brand-bg py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-dark-muted focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light"
        />
      </label>

      <div
        role="group"
        aria-label="Filtrar materias"
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => {
          const isActive =
            selectedFilter ===
            filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                onFilterChange(
                  filter.value,
                )
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
import Link from "next/link";

import type {
  StudySummary,
  SummaryLength,
} from "@/types/summary";

interface SummaryCardProps {
  summary: StudySummary;
}

const lengthStyles: Record<
  SummaryLength,
  {
    label: string;
    container: string;
  }
> = {
  short: {
    label: "Corto",
    container: "bg-emerald-50 text-emerald-700",
  },
  medium: {
    label: "Medio",
    container: "bg-blue-50 text-blue-700",
  },
  detailed: {
    label: "Detallado",
    container: "bg-violet-50 text-violet-700",
  },
};

export default function SummaryCard({
  summary,
}: SummaryCardProps) {
  const lengthStyle = lengthStyles[summary.length];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-brand-border bg-brand-card p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-cyan-light hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cyan-muted">
          <span className="text-brand text-sm">
            RE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {summary.isFavorite && (
            <span className="rounded-full bg-brand-cyan-muted px-3 py-1 text-xs font-semibold text-brand-cyan">
              Favorito
            </span>
          )}

          <button
            type="button"
            aria-label={`Más opciones para ${summary.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-muted transition hover:bg-brand-bg hover:text-dark-title"
          >
            <span
              aria-hidden="true"
              className="text-xl leading-none"
            >
              ⋮
            </span>
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-brand text-xs">
          {summary.subject}
        </p>

        <h2 className="text-display mt-2 text-xl">
          {summary.title}
        </h2>

        <p className="text-helper mt-3 text-sm">
          {summary.excerpt}
        </p>
      </div>

      <div className="mt-5 rounded-xl bg-brand-bg p-4">
        <p className="text-helper text-xs">
          Documento de origen
        </p>

        <p className="text-nav mt-1 truncate text-sm text-dark-title">
          {summary.sourceDocument}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${lengthStyle.container}`}
          >
            {lengthStyle.label}
          </span>

          <span className="text-helper text-xs">
            {summary.wordCount} palabras
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        <p className="text-helper text-xs">
          Generado {summary.createdAt}
        </p>

        <Link
          href={`/summaries/${summary.id}`}
          className="text-nav rounded-xl bg-brand-cyan px-4 py-2 text-sm text-white transition hover:bg-brand-cyan-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
        >
          Leer resumen
        </Link>
      </div>
    </article>
  );
}
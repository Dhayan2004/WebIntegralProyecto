import Link from "next/link";

import type { Subject, SubjectColor } from "@/types/subject";

interface SubjectCardProps {
  subject: Subject;
}

const colorStyles: Record<
  SubjectColor,
  {
    badge: string;
    accent: string;
    icon: string;
  }
> = {
  cyan: {
    badge: "bg-brand-cyan-muted text-brand-cyan",
    accent: "border-t-brand-cyan",
    icon: "bg-brand-cyan-light text-brand-cyan",
  },
  blue: {
    badge: "bg-blue-50 text-blue-700",
    accent: "border-t-blue-500",
    icon: "bg-blue-100 text-blue-700",
  },
  violet: {
    badge: "bg-violet-50 text-violet-700",
    accent: "border-t-violet-500",
    icon: "bg-violet-100 text-violet-700",
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-700",
    accent: "border-t-emerald-500",
    icon: "bg-emerald-100 text-emerald-700",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700",
    accent: "border-t-amber-500",
    icon: "bg-amber-100 text-amber-700",
  },
  rose: {
    badge: "bg-rose-50 text-rose-700",
    accent: "border-t-rose-500",
    icon: "bg-rose-100 text-rose-700",
  },
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function SubjectCard({
  subject,
}: SubjectCardProps) {
  const styles = colorStyles[subject.color];

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-brand-border border-t-4 bg-brand-card p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${styles.accent}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <span className="text-nav text-sm">
            {getInitials(subject.name)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {subject.isFavorite && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
            >
              Favorita
            </span>
          )}

          <button
            type="button"
            aria-label={`Más opciones para ${subject.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-muted transition hover:bg-brand-bg hover:text-dark-title"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ⋮
            </span>
          </button>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-display text-xl">
          {subject.name}
        </h2>

        <p className="text-helper mt-2 line-clamp-3 text-sm">
          {subject.description}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-brand-bg p-3 text-center">
          <p className="text-display text-lg">
            {subject.documents}
          </p>
          <p className="text-helper mt-1 text-xs">
            Documentos
          </p>
        </div>

        <div className="rounded-xl bg-brand-bg p-3 text-center">
          <p className="text-display text-lg">
            {subject.summaries}
          </p>
          <p className="text-helper mt-1 text-xs">
            Resúmenes
          </p>
        </div>

        <div className="rounded-xl bg-brand-bg p-3 text-center">
          <p className="text-display text-lg">
            {subject.flashcards}
          </p>
          <p className="text-helper mt-1 text-xs">
            Flashcards
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        <p className="text-helper text-xs">
          Actualizada {subject.updatedAt}
        </p>

        <Link
          href={`/subjects/${subject.id}`}
          className="text-nav rounded-xl bg-brand-cyan px-4 py-2 text-sm text-white transition hover:bg-brand-cyan-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
        >
          Abrir
        </Link>
      </div>
    </article>
  );
}
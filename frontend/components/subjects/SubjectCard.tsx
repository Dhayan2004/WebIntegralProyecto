"use client";

import { useState } from "react";

import type {
  Subject,
  SubjectColor,
} from "@/types/subject";

interface SubjectCardProps {
  subject: Subject;
  isDeleting: boolean;
  onRequestEdit: (
    subject: Subject,
  ) => void;
  onRequestDelete: (
    subject: Subject,
  ) => void;
}

const colorStyles: Record<
  SubjectColor,
  {
    accent: string;
    icon: string;
  }
> = {
  cyan: {
    accent: "border-t-brand-cyan",
    icon:
      "bg-brand-cyan-light text-brand-cyan",
  },
  blue: {
    accent: "border-t-blue-500",
    icon:
      "bg-blue-100 text-blue-700",
  },
  violet: {
    accent: "border-t-violet-500",
    icon:
      "bg-violet-100 text-violet-700",
  },
  emerald: {
    accent: "border-t-emerald-500",
    icon:
      "bg-emerald-100 text-emerald-700",
  },
  amber: {
    accent: "border-t-amber-500",
    icon:
      "bg-amber-100 text-amber-700",
  },
  rose: {
    accent: "border-t-rose-500",
    icon:
      "bg-rose-100 text-rose-700",
  },
};

function getInitials(
  name: string,
): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase(),
    )
    .join("");
}

export default function SubjectCard({
  subject,
  isDeleting,
  onRequestEdit,
  onRequestDelete,
}: SubjectCardProps) {
  const [showOptions, setShowOptions] =
    useState(false);

  const styles =
    colorStyles[subject.color];

  function handleEditClick() {
    setShowOptions(false);
    onRequestEdit(subject);
  }

  function handleDeleteClick() {
    setShowOptions(false);
    onRequestDelete(subject);
  }

  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border border-brand-border border-t-4 bg-brand-card p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${styles.accent}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <span className="text-nav text-sm">
            {getInitials(
              subject.name,
            )}
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowOptions(
                (current) =>
                  !current,
              )
            }
            aria-label={`Más opciones para ${subject.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-muted transition hover:bg-brand-bg hover:text-dark-title"
          >
            <span
              aria-hidden="true"
              className="text-xl leading-none"
            >
              ⋮
            </span>
          </button>

          {showOptions && (
            <div className="absolute right-0 top-11 z-20 min-w-40 rounded-xl border border-brand-border bg-white p-2 shadow-lg">
              <button
                type="button"
                onClick={
                  handleEditClick
                }
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-dark-body transition hover:bg-brand-bg hover:text-dark-title"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={
                  handleDeleteClick
                }
                disabled={isDeleting}
                className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting
                  ? "Eliminando..."
                  : "Eliminar"}
              </button>
            </div>
          )}
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

      <div className="mt-auto pt-6">
        <p className="text-helper text-xs">
          Creada {subject.updatedAt}
        </p>
      </div>
    </article>
  );
}
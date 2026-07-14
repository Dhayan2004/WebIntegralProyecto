"use client";

import type { Subject } from "@/types/subject";

interface DeleteSubjectModalProps {
  subject: Subject | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteSubjectModal({
  subject,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteSubjectModalProps) {
  if (!subject) {
    return null;
  }

  function handleClose() {
    if (!isDeleting) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-subject-title"
    >
      <div className="w-full max-w-md rounded-3xl border border-brand-border bg-brand-card p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-red-600">
              Acción permanente
            </p>

            <h2
              id="delete-subject-title"
              className="text-display mt-2 text-2xl"
            >
              Eliminar materia
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            aria-label="Cerrar ventana"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-dark-muted transition hover:bg-brand-bg hover:text-dark-title disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <p className="text-helper mt-5 text-sm">
          Estás a punto de eliminar la materia{" "}
          <span className="font-semibold text-dark-title">
            {subject.name}
          </span>
          .
        </p>

        <p className="text-helper mt-3 text-sm">
          Esta acción no se puede deshacer.
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="text-nav rounded-xl border border-brand-border px-5 py-3 text-sm text-dark-body transition hover:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isDeleting}
            className="text-nav rounded-xl bg-red-600 px-5 py-3 text-sm text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting
              ? "Eliminando..."
              : "Eliminar materia"}
          </button>
        </div>
      </div>
    </div>
  );
}
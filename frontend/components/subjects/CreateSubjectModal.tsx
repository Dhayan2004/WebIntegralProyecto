"use client";

import {
  useState,
  type FormEvent,
} from "react";

import type { SubjectCreatePayload } from "@/types/subject";

interface CreateSubjectModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (
    payload: SubjectCreatePayload,
  ) => Promise<void>;
}

export default function CreateSubjectModal({
  isOpen,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: CreateSubjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      description:
        description.trim() || null,
      color: "#0891b2",
    });

    setName("");
    setDescription("");
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setName("");
    setDescription("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-subject-title"
    >
      <div className="w-full max-w-lg rounded-3xl border border-brand-border bg-brand-card p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-brand text-sm">
              Organización académica
            </p>

            <h2
              id="create-subject-title"
              className="text-display mt-2 text-2xl"
            >
              Nueva materia
            </h2>

            <p className="text-helper mt-2 text-sm">
              Crea un nuevo espacio para
              organizar tus materiales de
              estudio.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Cerrar ventana"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-dark-muted transition hover:bg-brand-bg hover:text-dark-title disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >
          <div>
            <label
              htmlFor="subject-name"
              className="text-nav text-sm text-dark-title"
            >
              Nombre de la materia
            </label>

            <input
              id="subject-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Ejemplo: Desarrollo Web"
              maxLength={120}
              required
              autoFocus
              className="mt-2 w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm text-dark-title outline-none transition placeholder:text-dark-muted focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
            />
          </div>

          <div>
            <label
              htmlFor="subject-description"
              className="text-nav text-sm text-dark-title"
            >
              Descripción
            </label>

            <textarea
              id="subject-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              placeholder="Describe brevemente el contenido de la materia."
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm text-dark-title outline-none transition placeholder:text-dark-muted focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-nav rounded-xl border border-brand-border px-5 py-3 text-sm text-dark-body transition hover:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !name.trim()
              }
              className="text-nav rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white transition hover:bg-brand-cyan-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Creando..."
                : "Crear materia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
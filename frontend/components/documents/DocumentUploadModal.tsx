"use client";

import { useState } from "react";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentUploadModal({
  isOpen,
  onClose,
}: DocumentUploadModalProps) {
  const [selectedFileName, setSelectedFileName] =
    useState("");

  if (!isOpen) {
    return null;
  }

  function handleClose() {
    setSelectedFileName("");
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-document-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Cerrar ventana"
        onClick={handleClose}
        className="absolute inset-0 bg-dark-title/40"
      />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-brand-border bg-brand-card p-6 shadow-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-brand text-sm">
              Nuevo contenido
            </p>

            <h2
              id="upload-document-title"
              className="text-display mt-2 text-2xl"
            >
              Subir documento
            </h2>

            <p className="text-helper mt-2 text-sm">
              Selecciona un archivo y asígnalo a una materia.
            </p>
          </div>

          <button
            type="button"
            aria-label="Cerrar"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-dark-muted transition hover:bg-brand-bg hover:text-dark-title"
          >
            <span
              aria-hidden="true"
              className="text-2xl"
            >
              ×
            </span>
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-nav text-sm text-dark-title">
              Materia
            </span>

            <select className="text-helper mt-2 w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light">
              <option>Desarrollo Web</option>
              <option>Bases de Datos</option>
              <option>Ingeniería de Software</option>
              <option>Análisis de Datos</option>
            </select>
          </label>

          <label className="block">
            <span className="text-nav text-sm text-dark-title">
              Título del documento
            </span>

            <input
              type="text"
              placeholder="Ej. Introducción a Next.js"
              className="text-helper mt-2 w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm outline-none transition placeholder:text-dark-muted focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light"
            />
          </label>

          <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-brand-border bg-brand-bg px-6 py-8 text-center transition hover:border-brand-cyan-light">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              className="sr-only"
              onChange={(event) => {
                const file =
                  event.target.files?.[0];

                setSelectedFileName(
                  file?.name ?? "",
                );
              }}
            />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cyan-muted">
              <span className="text-brand">
                DO
              </span>
            </div>

            <p className="text-nav mt-4 text-sm text-dark-title">
              {selectedFileName ||
                "Selecciona un archivo"}
            </p>

            <p className="text-helper mt-2 text-xs">
              PDF, Word, PowerPoint o texto
            </p>
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="text-nav rounded-xl border border-brand-border px-5 py-3 text-sm text-dark-body transition hover:bg-brand-bg"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="text-nav rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white transition hover:bg-brand-cyan-hover"
          >
            Guardar documento
          </button>
        </div>
      </div>
    </div>
  );
}
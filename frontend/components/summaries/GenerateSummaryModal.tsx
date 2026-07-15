"use client";

import { useEffect, useState } from "react";

import { documentService } from "@/services/documentService";
import { summaryService } from "@/services/summaryService";
import type { DocumentApi } from "@/types/document";

interface GenerateSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateSummaryModal({
  isOpen,
  onClose,
}: GenerateSummaryModalProps) {
  const [documents, setDocuments] = useState<
    DocumentApi[]
  >([]);
  const [selectedDocId, setSelectedDocId] =
    useState("");
  const [title, setTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isOpen) {
      documentService
        .getAll()
        .then(setDocuments)
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleClose() {
    setSelectedDocId("");
    setTitle("");
    setError(null);
    onClose();
  }

  async function handleGenerate() {
    try {
      setGenerating(true);
      setError(null);
      await summaryService.create({
        title: title || undefined,
        document_id: selectedDocId || undefined,
      });
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al generar resumen",
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="generate-summary-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Cerrar ventana"
        onClick={handleClose}
        className="absolute inset-0 bg-dark-title/40"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-brand-border bg-brand-card p-6 shadow-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-brand text-sm">
              Inteligencia artificial
            </p>
            <h2
              id="generate-summary-title"
              className="text-display mt-2 text-2xl"
            >
              Generar resumen
            </h2>
            <p className="text-helper mt-2 text-sm">
              Selecciona un documento para generar un resumen.
            </p>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-dark-muted transition hover:bg-brand-bg hover:text-dark-title"
          >
            <span aria-hidden="true" className="text-2xl">
              ×
            </span>
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-nav text-sm text-dark-title">
              Documento
            </span>
            <select
              value={selectedDocId}
              onChange={(e) =>
                setSelectedDocId(e.target.value)
              }
              className="text-helper mt-2 w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light"
            >
              <option value="">
                Selecciona un documento
              </option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-nav text-sm text-dark-title">
              Título del resumen (opcional)
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Resumen de Next.js"
              className="text-helper mt-2 w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm outline-none transition placeholder:text-dark-muted focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light"
            />
          </label>

          {error && (
            <p className="text-red-500 text-xs">
              {error}
            </p>
          )}

          <div className="rounded-2xl bg-brand-cyan-muted p-4">
            <p className="text-nav text-sm text-dark-title">
              Generación asistida por IA
            </p>
            <p className="text-helper mt-1 text-xs">
              El resumen se generará usando el documento
              seleccionado como fuente.
            </p>
          </div>
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
            onClick={handleGenerate}
            disabled={generating}
            className="text-nav rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white transition hover:bg-brand-cyan-hover disabled:opacity-50"
          >
            {generating
              ? "Generando..."
              : "Generar resumen"}
          </button>
        </div>
      </div>
    </div>
  );
}

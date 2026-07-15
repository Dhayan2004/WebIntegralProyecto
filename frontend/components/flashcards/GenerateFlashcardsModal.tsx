"use client";

import { useEffect, useState } from "react";

import { documentService } from "@/services/documentService";
import { flashcardService } from "@/services/flashcardService";
import type { DocumentApi } from "@/types/document";

interface GenerateFlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: () => void;
}

export default function GenerateFlashcardsModal({
  isOpen,
  onClose,
  onGenerated,
}: GenerateFlashcardsModalProps) {
  const [documents, setDocuments] = useState<
    DocumentApi[]
  >([]);
  const [selectedDocId, setSelectedDocId] =
    useState("");
  const [count, setCount] = useState("5");
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
    setCount("5");
    setError(null);
    onClose();
  }

  async function handleGenerate() {
    try {
      setGenerating(true);
      setError(null);
      await flashcardService.generate({
        document_id: selectedDocId || undefined,
        count: Number(count),
      });
      onGenerated();
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al generar flashcards",
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="generate-flashcards-title"
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
              Generar tarjetas
            </p>
            <h2
              id="generate-flashcards-title"
              className="text-display mt-2 text-2xl"
            >
              Nuevas flashcards
            </h2>
            <p className="text-helper mt-2 text-sm">
              Selecciona un documento y la cantidad de tarjetas.
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

          <fieldset>
            <legend className="text-nav text-sm text-dark-title">
              Número de tarjetas
            </legend>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {["5", "10", "20"].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setCount(amount)}
                  className={`text-nav rounded-xl border px-4 py-3 text-sm transition ${
                    count === amount
                      ? "border-brand-cyan bg-brand-cyan-muted text-brand-cyan"
                      : "border-brand-border bg-brand-bg text-dark-body"
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="text-red-500 text-xs">
              {error}
            </p>
          )}
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
              : "Generar flashcards"}
          </button>
        </div>
      </div>
    </div>
  );
}

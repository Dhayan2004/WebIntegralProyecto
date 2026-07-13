"use client";

import { useState } from "react";

interface GenerateSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateSummaryModal({
  isOpen,
  onClose,
}: GenerateSummaryModalProps) {
  const [selectedLength, setSelectedLength] =
    useState("medium");

  if (!isOpen) {
    return null;
  }

  function handleClose() {
    setSelectedLength("medium");
    onClose();
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
              Selecciona un documento y configura el nivel de detalle.
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
              Documento
            </span>

            <select className="text-helper mt-2 w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light">
              <option>Introducción a Next.js</option>
              <option>Normalización de bases de datos</option>
              <option>Metodologías ágiles</option>
              <option>Preparación de los datos</option>
            </select>
          </label>

          <fieldset>
            <legend className="text-nav text-sm text-dark-title">
              Nivel de detalle
            </legend>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  value: "short",
                  label: "Corto",
                  description: "Puntos clave",
                },
                {
                  value: "medium",
                  label: "Medio",
                  description: "Resumen equilibrado",
                },
                {
                  value: "detailed",
                  label: "Detallado",
                  description: "Mayor profundidad",
                },
              ].map((option) => {
                const isSelected =
                  selectedLength === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setSelectedLength(option.value)
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-brand-cyan bg-brand-cyan-muted"
                        : "border-brand-border bg-brand-bg hover:border-brand-cyan-light"
                    }`}
                  >
                    <p
                      className={`text-nav text-sm ${
                        isSelected
                          ? "text-brand-cyan"
                          : "text-dark-title"
                      }`}
                    >
                      {option.label}
                    </p>

                    <p className="text-helper mt-1 text-xs">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-nav text-sm text-dark-title">
              Indicaciones adicionales
            </span>

            <textarea
              rows={4}
              placeholder="Ej. Enfatiza los conceptos más importantes y agrega ejemplos."
              className="text-helper mt-2 w-full resize-none rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm outline-none transition placeholder:text-dark-muted focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light"
            />
          </label>

          <div className="rounded-2xl bg-brand-cyan-muted p-4">
            <p className="text-nav text-sm text-dark-title">
              Generación asistida por IA
            </p>

            <p className="text-helper mt-1 text-xs">
              El contenido será generado utilizando el documento
              seleccionado como fuente principal.
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
            onClick={handleClose}
            className="text-nav rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white transition hover:bg-brand-cyan-hover"
          >
            Generar resumen
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";

import type { StudyQuiz } from "@/types/quiz";

interface StartQuizModalProps {
  isOpen: boolean;
  selectedQuiz: StudyQuiz | null;
  onClose: () => void;
}

export default function StartQuizModal({
  isOpen,
  selectedQuiz,
  onClose,
}: StartQuizModalProps) {
  const [selectedAmount, setSelectedAmount] =
    useState("10");

  if (!isOpen) {
    return null;
  }

  function handleClose() {
    setSelectedAmount("10");
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-quiz-title"
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
              Preparar evaluación
            </p>

            <h2
              id="start-quiz-title"
              className="text-display mt-2 text-2xl"
            >
              {selectedQuiz?.title ??
                "Nueva evaluación"}
            </h2>

            <p className="text-helper mt-2 text-sm">
              Configura el cuestionario antes de comenzar.
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
          {!selectedQuiz && (
            <>
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
                  Tema o documento
                </span>

                <select className="text-helper mt-2 w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light">
                  <option>Introducción a Next.js</option>
                  <option>Normalización de bases de datos</option>
                  <option>Metodologías ágiles</option>
                  <option>Preparación de datos</option>
                </select>
              </label>
            </>
          )}

          <fieldset>
            <legend className="text-nav text-sm text-dark-title">
              Número de preguntas
            </legend>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {["5", "10", "20"].map((amount) => {
                const isSelected =
                  selectedAmount === amount;

                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      setSelectedAmount(amount)
                    }
                    className={`text-nav rounded-xl border px-4 py-3 text-sm transition ${
                      isSelected
                        ? "border-brand-cyan bg-brand-cyan-muted text-brand-cyan"
                        : "border-brand-border bg-brand-bg text-dark-body"
                    }`}
                  >
                    {amount}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-nav text-sm text-dark-title">
              Dificultad
            </span>

            <select className="text-helper mt-2 w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light">
              <option>Fácil</option>
              <option>Intermedio</option>
              <option>Difícil</option>
            </select>
          </label>

          <div className="rounded-2xl bg-brand-cyan-muted p-4">
            <p className="text-nav text-sm text-dark-title">
              Tiempo aproximado
            </p>

            <p className="text-display mt-2 text-2xl">
              {Math.ceil(Number(selectedAmount) * 0.7)} min
            </p>

            <p className="text-helper mt-1 text-xs">
              Puedes abandonar y continuar más tarde.
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
            Iniciar cuestionario
          </button>
        </div>
      </div>
    </div>
  );
}
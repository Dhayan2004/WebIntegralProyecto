"use client";

import { useState } from "react";

interface QuickStudyPanelProps {
  onStart: () => void;
}

export default function QuickStudyPanel({
  onStart,
}: QuickStudyPanelProps) {
  const [cardAmount, setCardAmount] = useState("10");

  return (
    <section className="rounded-3xl border border-brand-border bg-brand-card p-5 shadow-sm sm:p-6">
      <p className="text-brand text-sm">
        Sesión personalizada
      </p>

      <h2 className="text-display mt-2 text-xl">
        Repaso rápido
      </h2>

      <p className="text-helper mt-2 text-sm">
        Configura una sesión corta según el tiempo que tengas disponible.
      </p>

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

        <fieldset>
          <legend className="text-nav text-sm text-dark-title">
            Cantidad de tarjetas
          </legend>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {["5", "10", "20"].map((amount) => {
              const isSelected = cardAmount === amount;

              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setCardAmount(amount)}
                  className={`text-nav rounded-xl border px-3 py-3 text-sm transition ${
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

        <div className="rounded-2xl bg-brand-bg p-4">
          <p className="text-nav text-sm text-dark-title">
            Tiempo estimado
          </p>

          <p className="text-display mt-2 text-2xl">
            {Math.ceil(Number(cardAmount) * 0.7)} min
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="text-nav w-full rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white transition hover:bg-brand-cyan-hover"
        >
          Comenzar sesión
        </button>
      </div>
    </section>
  );
}
"use client";

import type { FlashcardDeck } from "@/types/flashcard";

interface StudyCardProps {
  deck: FlashcardDeck;
  currentIndex: number;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function StudyCard({
  deck,
  currentIndex,
  showAnswer,
  onToggleAnswer,
  onPrevious,
  onNext,
}: StudyCardProps) {
  const currentCard = deck.cards[currentIndex];
  const totalCards = deck.cards.length;
  const progress = ((currentIndex + 1) / totalCards) * 100;

  return (
    <section
      aria-labelledby="active-deck-title"
      className="overflow-hidden rounded-3xl border border-brand-border bg-brand-card shadow-sm"
    >
      <div className="border-b border-brand-border px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-brand text-sm">
              Sesión activa
            </p>

            <h2
              id="active-deck-title"
              className="text-display mt-1 text-2xl"
            >
              {deck.name}
            </h2>

            <p className="text-helper mt-1 text-sm">
              {deck.subject}
            </p>
          </div>

          <div className="rounded-xl bg-brand-cyan-muted px-4 py-2">
            <p className="text-nav text-sm text-brand-cyan">
              Tarjeta {currentIndex + 1} de {totalCards}
            </p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-brand-bg">
          <div
            className="h-full rounded-full bg-brand-cyan transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <button
          type="button"
          onClick={onToggleAnswer}
          className="group flex min-h-[340px] w-full flex-col items-center justify-center rounded-3xl border border-brand-border bg-brand-bg px-6 py-10 text-center transition hover:border-brand-cyan-light sm:px-12"
        >
          <p className="text-brand text-sm">
            {showAnswer ? "Respuesta" : "Pregunta"}
          </p>

          <p className="text-display mt-5 max-w-2xl text-2xl leading-relaxed sm:text-3xl">
            {showAnswer
              ? currentCard.answer
              : currentCard.question}
          </p>

          <p className="text-helper mt-8 text-sm">
            {showAnswer
              ? "Haz clic para volver a la pregunta"
              : "Haz clic para mostrar la respuesta"}
          </p>
        </button>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="text-nav rounded-xl border border-brand-border bg-brand-card px-5 py-3 text-sm text-dark-body transition hover:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Anterior
          </button>

          <button
            type="button"
            onClick={onToggleAnswer}
            className="text-nav rounded-xl bg-brand-cyan px-6 py-3 text-sm text-white transition hover:bg-brand-cyan-hover"
          >
            {showAnswer
              ? "Ver pregunta"
              : "Mostrar respuesta"}
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={currentIndex === totalCards - 1}
            className="text-nav rounded-xl border border-brand-border bg-brand-card px-5 py-3 text-sm text-dark-body transition hover:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </section>
  );
}
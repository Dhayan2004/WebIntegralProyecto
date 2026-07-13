interface FlashcardsHeaderProps {
    totalCards: number;
    onCreateDeck: () => void;
  }
  
  export default function FlashcardsHeader({
    totalCards,
    onCreateDeck,
  }: FlashcardsHeaderProps) {
    return (
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-brand text-sm">
            Repaso inteligente
          </p>
  
          <h1 className="text-display mt-2 text-3xl sm:text-4xl">
            Flashcards
          </h1>
  
          <p className="text-helper mt-3 max-w-2xl text-sm sm:text-base">
            Refuerza lo aprendido mediante sesiones cortas de preguntas y
            respuestas.
          </p>
  
          <p className="text-nav mt-3 text-sm text-dark-muted">
            {totalCards} tarjetas disponibles
          </p>
        </div>
  
        <button
          type="button"
          onClick={onCreateDeck}
          className="text-nav inline-flex items-center justify-center gap-2 rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white shadow-sm transition hover:bg-brand-cyan-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="text-lg">
            +
          </span>
          Crear mazo
        </button>
      </header>
    );
  }
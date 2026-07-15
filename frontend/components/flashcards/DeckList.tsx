import type {
    FlashcardDeck,
    FlashcardDeck as Deck,
  } from "@/types/flashcard";
  
  interface DeckListProps {
    decks: FlashcardDeck[];
    selectedDeckId: string;
    onSelectDeck: (deck: Deck) => void;
  }
  
  const colorStyles = {
    cyan: "bg-brand-cyan-muted text-brand-cyan",
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };
  
  export default function DeckList({
    decks,
    selectedDeckId,
    onSelectDeck,
  }: DeckListProps) {
    return (
      <section aria-labelledby="deck-list-title">
        <div className="mb-5">
          <h2
            id="deck-list-title"
            className="text-display text-xl"
          >
            Tus mazos
          </h2>
  
          <p className="text-helper mt-1 text-sm">
            Selecciona otro conjunto de tarjetas para comenzar a estudiar.
          </p>
        </div>
  
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {decks.map((deck) => {
            const isSelected = deck.id === selectedDeckId;
  
            return (
              <button
                key={deck.id}
                type="button"
                onClick={() => onSelectDeck(deck)}
                className={`rounded-2xl border p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                  isSelected
                    ? "border-brand-cyan bg-brand-cyan-muted"
                    : "border-brand-border bg-brand-card"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorStyles[deck.color]}`}
                >
                  <span className="text-nav text-xs">
                    {deck.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
  
                <h3 className="text-nav mt-4 text-base text-dark-title">
                  {deck.name}
                </h3>
  
                <p className="text-helper mt-1 text-xs">
                  {deck.subject}
                </p>
  
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-helper text-xs">
                    {deck.cardCount} tarjetas
                  </p>
  
                  <p className="text-brand text-xs">
                    {deck.masteredCount} dominadas
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  }
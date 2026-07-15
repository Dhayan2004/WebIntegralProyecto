"use client";

import { useEffect, useMemo, useState } from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import DeckList from "@/components/flashcards/DeckList";
import FlashcardsHeader from "@/components/flashcards/FlashcardsHeader";
import GenerateFlashcardsModal from "@/components/flashcards/GenerateFlashcardsModal";
import QuickStudyPanel from "@/components/flashcards/QuickStudyPanel";
import StudyCard from "@/components/flashcards/StudyCard";
import StudyProgress from "@/components/flashcards/StudyProgress";
import { flashcardService } from "@/services/flashcardService";
import type {
  FlashcardApi,
  FlashcardItem,
} from "@/types/flashcard";

const DECK_COLORS = [
  "cyan",
  "blue",
  "violet",
  "emerald",
] as const;

interface DeckGroup {
  id: string;
  name: string;
  cardCount: number;
  color: (typeof DECK_COLORS)[number];
  cards: FlashcardItem[];
}

function groupByDocument(
  cards: FlashcardApi[],
): DeckGroup[] {
  const groups = new Map<
    string,
    { name: string; cards: FlashcardItem[] }
  >();

  for (const card of cards) {
    const key = card.document_id ?? "general";
    if (!groups.has(key)) {
      groups.set(key, {
        name:
          key === "general"
            ? "General"
            : `Documento ${key.slice(0, 8)}`,
        cards: [],
      });
    }
    groups.get(key)!.cards.push({
      id: card.id,
      question: card.question,
      answer: card.answer,
    });
  }

  return Array.from(groups.entries()).map(
    ([id, group], index) => ({
      id,
      name: group.name,
      cardCount: group.cards.length,
      color: DECK_COLORS[index % DECK_COLORS.length],
      cards: group.cards,
    }),
  );
}

export default function FlashcardsContainer() {
  const [allCards, setAllCards] = useState<
    FlashcardApi[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null,
  );

  const [selectedDeckIndex, setSelectedDeckIndex] =
    useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  useEffect(() => {
    flashcardService
      .getAll()
      .then(setAllCards)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar flashcards",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  function refreshCards() {
    setLoading(true);
    setError(null);
    flashcardService
      .getAll()
      .then(setAllCards)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar flashcards",
        ),
      )
      .finally(() => setLoading(false));
  }

  const decks = useMemo(
    () => groupByDocument(allCards),
    [allCards],
  );

  const selectedDeck =
    decks[selectedDeckIndex] ?? null;

  const totalCards = allCards.length;

  function selectDeck(index: number) {
    setSelectedDeckIndex(index);
    setCurrentIndex(0);
    setShowAnswer(false);
  }

  function goToPrevious() {
    setCurrentIndex((current) =>
      Math.max(current - 1, 0),
    );
    setShowAnswer(false);
  }

  function goToNext() {
    if (!selectedDeck) return;
    setCurrentIndex((current) =>
      Math.min(
        current + 1,
        selectedDeck.cards.length - 1,
      ),
    );
    setShowAnswer(false);
  }

  function restartCurrentDeck() {
    setCurrentIndex(0);
    setShowAnswer(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <WorkspaceShell userName="Aarón">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <FlashcardsHeader
          totalCards={totalCards}
          onCreateDeck={() =>
            setIsGenerateModalOpen(true)
          }
        />

        {loading && (
          <p className="text-helper text-center text-sm py-12">
            Cargando flashcards...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center text-sm py-12">
            {error}
          </p>
        )}

        {!loading && !error && selectedDeck && (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,0.8fr)]">
            <StudyCard
              deck={selectedDeck}
              currentIndex={currentIndex}
              showAnswer={showAnswer}
              onToggleAnswer={() =>
                setShowAnswer((current) => !current)
              }
              onPrevious={goToPrevious}
              onNext={goToNext}
            />

            <div className="flex flex-col gap-8">
              <StudyProgress
                progress={{
                  total: selectedDeck.cards.length,
                }}
              />
              <QuickStudyPanel
                onStart={restartCurrentDeck}
              />
            </div>
          </div>
        )}

        {!loading && !error && !selectedDeck && (
          <p className="text-helper text-center text-sm py-12">
            No hay flashcards disponibles. Crea documentos y genera flashcards desde ellos.
          </p>
        )}

        <DeckList
          decks={decks}
          selectedDeckIndex={selectedDeckIndex}
          onSelectDeck={selectDeck}
        />
      </div>

      <GenerateFlashcardsModal
        isOpen={isGenerateModalOpen}
        onClose={() => {
          setIsGenerateModalOpen(false);
          refreshCards();
        }}
        onGenerated={refreshCards}
      />
    </WorkspaceShell>
  );
}

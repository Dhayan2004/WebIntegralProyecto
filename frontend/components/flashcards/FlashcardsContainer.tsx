"use client";

import { useMemo, useState } from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import DeckList from "@/components/flashcards/DeckList";
import FlashcardsHeader from "@/components/flashcards/FlashcardsHeader";
import QuickStudyPanel from "@/components/flashcards/QuickStudyPanel";
import StudyCard from "@/components/flashcards/StudyCard";
import StudyProgress from "@/components/flashcards/StudyProgress";
import type {
  FlashcardDeck,
  StudyProgressData,
} from "@/types/flashcard";

const mockDecks: FlashcardDeck[] = [
  {
    id: "nextjs",
    name: "Fundamentos de Next.js",
    subject: "Desarrollo Web",
    description: "Conceptos principales de Next.js.",
    cardCount: 12,
    masteredCount: 7,
    color: "cyan",
    cards: [
      {
        id: "next-1",
        question: "¿Qué es Next.js?",
        answer:
          "Es un framework de React para crear aplicaciones web con renderizado del lado del servidor, rutas y optimizaciones integradas.",
      },
      {
        id: "next-2",
        question: "¿Qué función cumple el App Router?",
        answer:
          "Organiza las rutas mediante carpetas y archivos dentro del directorio app.",
      },
      {
        id: "next-3",
        question: "¿Qué diferencia existe entre un Server Component y un Client Component?",
        answer:
          "Los Server Components se renderizan en el servidor; los Client Components permiten estado, efectos y eventos del navegador.",
      },
    ],
  },
  {
    id: "sql",
    name: "Consultas SQL",
    subject: "Bases de Datos",
    description: "Consultas, filtros y relaciones.",
    cardCount: 18,
    masteredCount: 11,
    color: "blue",
    cards: [
      {
        id: "sql-1",
        question: "¿Para qué se utiliza SELECT?",
        answer:
          "Para consultar y recuperar datos almacenados en una o más tablas.",
      },
      {
        id: "sql-2",
        question: "¿Qué hace una cláusula WHERE?",
        answer:
          "Filtra las filas y devuelve únicamente las que cumplen una condición.",
      },
    ],
  },
  {
    id: "agile",
    name: "Metodologías ágiles",
    subject: "Ingeniería de Software",
    description: "Scrum, Kanban y trabajo iterativo.",
    cardCount: 15,
    masteredCount: 9,
    color: "violet",
    cards: [
      {
        id: "agile-1",
        question: "¿Cuál es el propósito de un Sprint?",
        answer:
          "Entregar un incremento funcional del producto dentro de un periodo corto y definido.",
      },
      {
        id: "agile-2",
        question: "¿Qué representa una columna en un tablero Kanban?",
        answer:
          "Una etapa del flujo de trabajo por la que avanzan las tareas.",
      },
    ],
  },
  {
    id: "data",
    name: "Preparación de datos",
    subject: "Análisis de Datos",
    description: "Limpieza, transformación y validación.",
    cardCount: 20,
    masteredCount: 13,
    color: "emerald",
    cards: [
      {
        id: "data-1",
        question: "¿Qué es un dato duplicado?",
        answer:
          "Un registro repetido que representa la misma observación o entidad dentro del conjunto de datos.",
      },
      {
        id: "data-2",
        question: "¿Por qué se normalizan los formatos?",
        answer:
          "Para mantener consistencia y facilitar el análisis, comparación y procesamiento.",
      },
    ],
  },
];

const mockProgress: StudyProgressData = {
  mastered: 40,
  pending: 25,
  streak: 6,
  studyMinutes: 28,
};

export default function FlashcardsContainer() {
  const [selectedDeck, setSelectedDeck] =
    useState<FlashcardDeck>(mockDecks[0]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [showAnswer, setShowAnswer] =
    useState(false);

  const totalCards = useMemo(
    () =>
      mockDecks.reduce(
        (total, deck) => total + deck.cardCount,
        0,
      ),
    [],
  );

  function selectDeck(deck: FlashcardDeck) {
    setSelectedDeck(deck);
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
          onCreateDeck={() => {
            window.alert(
              "El formulario para crear mazos se agregará posteriormente.",
            );
          }}
        />

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
            <StudyProgress progress={mockProgress} />

            <QuickStudyPanel
              onStart={restartCurrentDeck}
            />
          </div>
        </div>

        <DeckList
          decks={mockDecks}
          selectedDeckId={selectedDeck.id}
          onSelectDeck={selectDeck}
        />
      </div>
    </WorkspaceShell>
  );
}
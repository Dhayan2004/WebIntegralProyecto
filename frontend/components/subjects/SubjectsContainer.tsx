"use client";

import { useMemo, useState } from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import SubjectsGrid from "@/components/subjects/SubjectsGrid";
import SubjectsHeader from "@/components/subjects/SubjectsHeader";
import SubjectsToolbar from "@/components/subjects/SubjectsToolbar";
import type {
  Subject,
  SubjectFilter,
} from "@/types/subject";

const mockSubjects: Subject[] = [
  {
    id: "desarrollo-web",
    name: "Desarrollo Web",
    description:
      "Interfaces modernas, React, Next.js, TypeScript y arquitectura frontend.",
    color: "cyan",
    documents: 12,
    summaries: 4,
    flashcards: 32,
    isFavorite: true,
    updatedAt: "hoy",
  },
  {
    id: "bases-de-datos",
    name: "Bases de Datos",
    description:
      "SQL, modelado relacional, normalización y administración de información.",
    color: "blue",
    documents: 9,
    summaries: 6,
    flashcards: 24,
    isFavorite: true,
    updatedAt: "ayer",
  },
  {
    id: "ingenieria-software",
    name: "Ingeniería de Software",
    description:
      "Metodologías ágiles, requerimientos, arquitectura y gestión de proyectos.",
    color: "violet",
    documents: 7,
    summaries: 3,
    flashcards: 18,
    isFavorite: false,
    updatedAt: "hace 2 días",
  },
  {
    id: "analisis-datos",
    name: "Análisis de Datos",
    description:
      "Preparación, exploración, visualización y análisis de conjuntos de datos.",
    color: "emerald",
    documents: 10,
    summaries: 5,
    flashcards: 27,
    isFavorite: false,
    updatedAt: "hace 3 días",
  },
  {
    id: "ingles",
    name: "Inglés",
    description:
      "Gramática, vocabulario, comprensión auditiva y práctica de escritura.",
    color: "amber",
    documents: 6,
    summaries: 2,
    flashcards: 40,
    isFavorite: false,
    updatedAt: "hace 5 días",
  },
  {
    id: "comportamiento-organizacional",
    name: "Comportamiento Organizacional",
    description:
      "Liderazgo, motivación, trabajo en equipo y cultura organizacional.",
    color: "rose",
    documents: 8,
    summaries: 4,
    flashcards: 20,
    isFavorite: false,
    updatedAt: "hace 1 semana",
  },
];

export default function SubjectsContainer() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedFilter, setSelectedFilter] =
    useState<SubjectFilter>("all");

  const filteredSubjects = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return mockSubjects.filter((subject) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        subject.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        subject.description
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "favorites" &&
          subject.isFavorite) ||
        (selectedFilter === "recent" &&
          ["hoy", "ayer", "hace 2 días"].includes(
            subject.updatedAt,
          ));

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  function clearFilters() {
    setSearchTerm("");
    setSelectedFilter("all");
  }

  return (
    <WorkspaceShell userName="Aarón">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <SubjectsHeader
          totalSubjects={mockSubjects.length}
        />

        <SubjectsToolbar
          searchTerm={searchTerm}
          selectedFilter={selectedFilter}
          onSearchChange={setSearchTerm}
          onFilterChange={setSelectedFilter}
        />

        <div className="flex items-center justify-between gap-4">
          <p className="text-helper text-sm">
            Mostrando{" "}
            <span className="text-nav text-dark-title">
              {filteredSubjects.length}
            </span>{" "}
            resultados
          </p>

          {(searchTerm ||
            selectedFilter !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-brand text-sm"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <SubjectsGrid
          subjects={filteredSubjects}
          onClearFilters={clearFilters}
        />
      </div>
    </WorkspaceShell>
  );
}
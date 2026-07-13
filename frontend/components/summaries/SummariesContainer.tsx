"use client";

import { useMemo, useState } from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import GenerateSummaryModal from "@/components/summaries/GenerateSummaryModal";
import SummariesGrid from "@/components/summaries/SummariesGrid";
import SummariesHeader from "@/components/summaries/SummariesHeader";
import SummariesToolbar from "@/components/summaries/SummariesToolbar";
import type {
  StudySummary,
  SummaryFilter,
} from "@/types/summary";

const mockSummaries: StudySummary[] = [
  {
    id: "summary-1",
    title: "Fundamentos de Next.js",
    subject: "Desarrollo Web",
    sourceDocument: "introduccion-nextjs.pdf",
    excerpt:
      "Next.js es un framework de React que facilita la creación de aplicaciones modernas mediante renderizado híbrido, rutas y componentes.",
    length: "medium",
    wordCount: 640,
    createdAt: "hoy",
    isFavorite: true,
  },
  {
    id: "summary-2",
    title: "Formas normales y dependencias",
    subject: "Bases de Datos",
    sourceDocument: "normalizacion.docx",
    excerpt:
      "La normalización organiza la información para reducir redundancias y evitar anomalías durante las operaciones de una base de datos.",
    length: "detailed",
    wordCount: 1240,
    createdAt: "ayer",
    isFavorite: true,
  },
  {
    id: "summary-3",
    title: "Principios de las metodologías ágiles",
    subject: "Ingeniería de Software",
    sourceDocument: "metodologias-agiles.pptx",
    excerpt:
      "Las metodologías ágiles priorizan entregas iterativas, colaboración constante y adaptación ante los cambios del proyecto.",
    length: "short",
    wordCount: 340,
    createdAt: "hace 2 días",
    isFavorite: false,
  },
  {
    id: "summary-4",
    title: "Preparación y limpieza de datos",
    subject: "Análisis de Datos",
    sourceDocument: "preparacion-datos.txt",
    excerpt:
      "La preparación de los datos incluye limpieza, transformación, detección de valores inválidos y estandarización.",
    length: "medium",
    wordCount: 710,
    createdAt: "hace 3 días",
    isFavorite: false,
  },
  {
    id: "summary-5",
    title: "Uso de relative clauses",
    subject: "Inglés",
    sourceDocument: "relative-clauses.pdf",
    excerpt:
      "Las cláusulas relativas agregan información sobre una persona, objeto o lugar mediante pronombres como who, which y that.",
    length: "short",
    wordCount: 290,
    createdAt: "hace 5 días",
    isFavorite: false,
  },
  {
    id: "summary-6",
    title: "Comparación entre Teoría X y Teoría Y",
    subject: "Comportamiento Organizacional",
    sourceDocument: "teoria-x-y.docx",
    excerpt:
      "McGregor presentó dos perspectivas opuestas sobre la motivación y el comportamiento de los colaboradores dentro de una organización.",
    length: "detailed",
    wordCount: 1080,
    createdAt: "hace 1 semana",
    isFavorite: false,
  },
];

export default function SummariesContainer() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedFilter, setSelectedFilter] =
    useState<SummaryFilter>("all");

  const [
    isGenerateModalOpen,
    setIsGenerateModalOpen,
  ] = useState(false);

  const filteredSummaries = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return mockSummaries.filter((summary) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        summary.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        summary.subject
          .toLowerCase()
          .includes(normalizedSearch) ||
        summary.sourceDocument
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesFilter =
        selectedFilter === "all" ||
        summary.length === selectedFilter ||
        (selectedFilter === "favorites" &&
          summary.isFavorite);

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  const hasFilters =
    searchTerm.trim().length > 0 ||
    selectedFilter !== "all";

  function clearFilters() {
    setSearchTerm("");
    setSelectedFilter("all");
  }

  return (
    <WorkspaceShell userName="Aarón">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <SummariesHeader
          totalSummaries={mockSummaries.length}
          onGenerate={() =>
            setIsGenerateModalOpen(true)
          }
        />

        <SummariesToolbar
          searchTerm={searchTerm}
          selectedFilter={selectedFilter}
          onSearchChange={setSearchTerm}
          onFilterChange={setSelectedFilter}
        />

        <div className="flex items-center justify-between gap-4">
          <p className="text-helper text-sm">
            Mostrando{" "}
            <span className="text-nav text-dark-title">
              {filteredSummaries.length}
            </span>{" "}
            resultados
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-brand text-sm"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <SummariesGrid
          summaries={filteredSummaries}
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
          onGenerate={() =>
            setIsGenerateModalOpen(true)
          }
        />
      </div>

      <GenerateSummaryModal
        isOpen={isGenerateModalOpen}
        onClose={() =>
          setIsGenerateModalOpen(false)
        }
      />
    </WorkspaceShell>
  );
}
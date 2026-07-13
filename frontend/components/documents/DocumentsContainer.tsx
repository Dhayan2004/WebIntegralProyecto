"use client";

import { useMemo, useState } from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import DocumentUploadModal from "@/components/documents/DocumentUploadModal";
import DocumentsGrid from "@/components/documents/DocumentsGrid";
import DocumentsHeader from "@/components/documents/DocumentsHeader";
import DocumentsToolbar from "@/components/documents/DocumentsToolbar";
import type {
  DocumentFilter,
  StudyDocument,
} from "@/types/document";

const mockDocuments: StudyDocument[] = [
  {
    id: "doc-1",
    title: "Introducción a Next.js",
    description:
      "Conceptos principales del App Router, componentes y rutas del proyecto.",
    subject: "Desarrollo Web",
    type: "pdf",
    fileName: "introduccion-nextjs.pdf",
    size: "2.4 MB",
    pages: 18,
    createdAt: "hoy",
    isProcessed: true,
  },
  {
    id: "doc-2",
    title: "Normalización de bases de datos",
    description:
      "Material sobre formas normales, dependencias y diseño relacional.",
    subject: "Bases de Datos",
    type: "word",
    fileName: "normalizacion.docx",
    size: "860 KB",
    pages: 12,
    createdAt: "ayer",
    isProcessed: true,
  },
  {
    id: "doc-3",
    title: "Metodologías ágiles",
    description:
      "Presentación sobre Scrum, Kanban y organización de equipos.",
    subject: "Ingeniería de Software",
    type: "presentation",
    fileName: "metodologias-agiles.pptx",
    size: "5.1 MB",
    pages: 24,
    createdAt: "hace 2 días",
    isProcessed: true,
  },
  {
    id: "doc-4",
    title: "Preparación de los datos",
    description:
      "Notas de clase sobre limpieza, transformación y validación.",
    subject: "Análisis de Datos",
    type: "text",
    fileName: "preparacion-datos.txt",
    size: "42 KB",
    pages: null,
    createdAt: "hace 3 días",
    isProcessed: false,
  },
  {
    id: "doc-5",
    title: "Relative clauses",
    description:
      "Ejercicios y ejemplos de cláusulas relativas en inglés.",
    subject: "Inglés",
    type: "pdf",
    fileName: "relative-clauses.pdf",
    size: "1.2 MB",
    pages: 9,
    createdAt: "hace 5 días",
    isProcessed: true,
  },
  {
    id: "doc-6",
    title: "Teoría X y Teoría Y",
    description:
      "Análisis de los estilos de administración propuestos por McGregor.",
    subject: "Comportamiento Organizacional",
    type: "word",
    fileName: "teoria-x-y.docx",
    size: "740 KB",
    pages: 14,
    createdAt: "hace 1 semana",
    isProcessed: true,
  },
];

export default function DocumentsContainer() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedFilter, setSelectedFilter] =
    useState<DocumentFilter>("all");

  const [isUploadModalOpen, setIsUploadModalOpen] =
    useState(false);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return mockDocuments.filter((document) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        document.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        document.subject
          .toLowerCase()
          .includes(normalizedSearch) ||
        document.fileName
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesFilter =
        selectedFilter === "all" ||
        document.type === selectedFilter;

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
        <DocumentsHeader
          totalDocuments={mockDocuments.length}
          onUpload={() =>
            setIsUploadModalOpen(true)
          }
        />

        <DocumentsToolbar
          searchTerm={searchTerm}
          selectedFilter={selectedFilter}
          onSearchChange={setSearchTerm}
          onFilterChange={setSelectedFilter}
        />

        <div className="flex items-center justify-between gap-4">
          <p className="text-helper text-sm">
            Mostrando{" "}
            <span className="text-nav text-dark-title">
              {filteredDocuments.length}
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

        <DocumentsGrid
          documents={filteredDocuments}
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
          onUpload={() =>
            setIsUploadModalOpen(true)
          }
        />
      </div>

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() =>
          setIsUploadModalOpen(false)
        }
      />
    </WorkspaceShell>
  );
}
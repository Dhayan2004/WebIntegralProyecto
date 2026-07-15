"use client";

import { useEffect, useMemo, useState } from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import GenerateSummaryModal from "@/components/summaries/GenerateSummaryModal";
import SummariesGrid from "@/components/summaries/SummariesGrid";
import SummariesHeader from "@/components/summaries/SummariesHeader";
import SummariesToolbar from "@/components/summaries/SummariesToolbar";
import { useAuth } from "@/hooks/useAuth";
import { summaryService } from "@/services/summaryService";
import type {
  StudySummary,
  SummaryApi,
  SummaryFilter,
} from "@/types/summary";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(
    diffMs / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "hoy";
  if (diffDays === 1) return "ayer";
  if (diffDays < 7) return `hace ${diffDays} días`;
  if (diffDays < 30)
    return `hace ${Math.floor(diffDays / 7)} semanas`;
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

function mapSummaryToStudy(
  s: SummaryApi,
): StudySummary {
  const content = s.content || "";
  const wordCount = content
    .split(/\s+/)
    .filter(Boolean).length;
  const excerpt =
    content.length > 150
      ? content.slice(0, 150) + "..."
      : content;

  return {
    id: s.id,
    title: s.title,
    sourceDocument: s.document_id
      ? `Documento ${s.document_id.slice(0, 8)}`
      : "Sin documento",
    excerpt,
    wordCount,
    createdAt: formatDate(s.created_at),
  };
}

export default function SummariesContainer() {
  const { user } = useAuth();
  const userName = user?.name ?? "Usuario";
  const [summaries, setSummaries] = useState<
    StudySummary[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<SummaryFilter>("all");
  const [
    isGenerateModalOpen,
    setIsGenerateModalOpen,
  ] = useState(false);

  useEffect(() => {
    setLoading(true);
    summaryService
      .getAll()
      .then((data) =>
        setSummaries(data.map(mapSummaryToStudy)),
      )
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar resúmenes",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredSummaries = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();
    return summaries.filter((summary) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        summary.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        summary.sourceDocument
          .toLowerCase()
          .includes(normalizedSearch);
      return matchesSearch;
    });
  }, [summaries, searchTerm]);

  const hasFilters = searchTerm.trim().length > 0;

  function clearFilters() {
    setSearchTerm("");
    setSelectedFilter("all");
  }

  return (
    <WorkspaceShell userName={userName}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <SummariesHeader
          totalSummaries={summaries.length}
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

        {loading && (
          <p className="text-helper text-center text-sm py-12">
            Cargando resúmenes...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center text-sm py-12">
            {error}
          </p>
        )}

        {!loading && !error && (
          <SummariesGrid
            summaries={filteredSummaries}
            hasFilters={hasFilters}
            onClearFilters={clearFilters}
            onGenerate={() =>
              setIsGenerateModalOpen(true)
            }
          />
        )}
      </div>

      <GenerateSummaryModal
        isOpen={isGenerateModalOpen}
        onClose={() => {
          setIsGenerateModalOpen(false);
          setLoading(true);
          summaryService
            .getAll()
            .then((data) =>
              setSummaries(data.map(mapSummaryToStudy)),
            )
            .catch(() => {})
            .finally(() => setLoading(false));
        }}
      />
    </WorkspaceShell>
  );
}

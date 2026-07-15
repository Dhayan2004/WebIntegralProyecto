"use client";

import { useEffect, useMemo, useState } from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import DocumentUploadModal from "@/components/documents/DocumentUploadModal";
import DocumentsGrid from "@/components/documents/DocumentsGrid";
import DocumentsHeader from "@/components/documents/DocumentsHeader";
import DocumentsToolbar from "@/components/documents/DocumentsToolbar";
import { useAuth } from "@/hooks/useAuth";
import { documentService } from "@/services/documentService";
import { subjectsService } from "@/services/subjects.service";
import type {
  DocumentFilter,
  DocumentApi,
  DocumentType,
  StudyDocument,
} from "@/types/document";
import type { SubjectApi } from "@/types/subject";

function deriveDocumentType(
  fileName: string | null,
): DocumentType {
  if (!fileName) return "text";
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "doc" || ext === "docx") return "word";
  if (
    ext === "ppt" ||
    ext === "pptx"
  )
    return "presentation";
  return "text";
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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

function mapDocumentToStudy(
  doc: DocumentApi,
  subjectMap: Map<string, string>,
): StudyDocument {
  return {
    id: doc.id,
    title: doc.title,
    subject: subjectMap.get(doc.subject_id ?? "") ?? "Sin materia",
    type: deriveDocumentType(doc.file_name),
    fileName: doc.file_name ?? "Sin nombre",
    size: formatFileSize(doc.file_size_bytes),
    createdAt: formatDate(doc.created_at),
    isProcessed: doc.status === "processed",
  };
}

export default function DocumentsContainer() {
  const { user } = useAuth();
  const userName = user?.name ?? "Usuario";
  const [documents, setDocuments] = useState<
    StudyDocument[]
  >([]);
  const [subjects, setSubjects] = useState<
    SubjectApi[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<DocumentFilter>("all");
  const [isUploadModalOpen, setIsUploadModalOpen] =
    useState(false);

  const subjectMap = useMemo(() => {
    const map = new Map<string, string>();
    subjects.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [subjects]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [docs, subs] = await Promise.all([
          documentService.getAll(),
          subjectsService.getAll(),
        ]);
        setSubjects(subs);
        setDocuments(
          docs.map((d) =>
            mapDocumentToStudy(d, new Map(subs.map((s) => [s.id, s.name]))),
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar documentos",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function refreshDocuments() {
    documentService
      .getAll()
      .then((docs) =>
        setDocuments(
          docs.map((d) => mapDocumentToStudy(d, subjectMap)),
        ),
      )
      .catch(() => {});
  }

  const filteredDocuments = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();
    return documents.filter((document) => {
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
  }, [documents, searchTerm, selectedFilter]);

  const hasFilters =
    searchTerm.trim().length > 0 ||
    selectedFilter !== "all";

  function clearFilters() {
    setSearchTerm("");
    setSelectedFilter("all");
  }

  return (
    <WorkspaceShell userName={userName}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <DocumentsHeader
          totalDocuments={documents.length}
          onUpload={() => setIsUploadModalOpen(true)}
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

        {loading && (
          <p className="text-helper text-center text-sm py-12">
            Cargando documentos...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center text-sm py-12">
            {error}
          </p>
        )}

        {!loading && !error && (
          <DocumentsGrid
            documents={filteredDocuments}
            hasFilters={hasFilters}
            onClearFilters={clearFilters}
            onUpload={() => setIsUploadModalOpen(true)}
          />
        )}
      </div>

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        subjects={subjects}
        onClose={() => {
          setIsUploadModalOpen(false);
          refreshDocuments();
        }}
      />
    </WorkspaceShell>
  );
}

import DocumentCard from "@/components/documents/DocumentCard";
import DocumentsEmptyState from "@/components/documents/DocumentsEmptyState";
import type { StudyDocument } from "@/types/document";

interface DocumentsGridProps {
  documents: StudyDocument[];
  hasFilters: boolean;
  onClearFilters: () => void;
  onUpload: () => void;
}

export default function DocumentsGrid({
  documents,
  hasFilters,
  onClearFilters,
  onUpload,
}: DocumentsGridProps) {
  if (documents.length === 0) {
    return (
      <DocumentsEmptyState
        hasFilters={hasFilters}
        onClearFilters={onClearFilters}
        onUpload={onUpload}
      />
    );
  }

  return (
    <section
      aria-label="Listado de documentos"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
    >
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
        />
      ))}
    </section>
  );
}
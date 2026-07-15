import SubjectCard from "@/components/subjects/SubjectCard";
import SubjectsEmptyState from "@/components/subjects/SubjectsEmptyState";

import type { Subject } from "@/types/subject";

interface SubjectsGridProps {
  subjects: Subject[];
  deletingSubjectId: string | null;
  onClearFilters: () => void;
  onRequestEdit: (
    subject: Subject,
  ) => void;
  onRequestDelete: (
    subject: Subject,
  ) => void;
}

export default function SubjectsGrid({
  subjects,
  deletingSubjectId,
  onClearFilters,
  onRequestEdit,
  onRequestDelete,
}: SubjectsGridProps) {
  if (subjects.length === 0) {
    return (
      <SubjectsEmptyState
        onClearFilters={
          onClearFilters
        }
      />
    );
  }

  return (
    <section
      aria-label="Listado de materias"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
    >
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          isDeleting={
            deletingSubjectId ===
            subject.id
          }
          onRequestEdit={
            onRequestEdit
          }
          onRequestDelete={
            onRequestDelete
          }
        />
      ))}
    </section>
  );
}
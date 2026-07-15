"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import CreateSubjectModal from "@/components/subjects/CreateSubjectModal";
import DeleteSubjectModal from "@/components/subjects/DeleteSubjectModal";
import EditSubjectModal from "@/components/subjects/EditSubjectModal";
import SubjectsGrid from "@/components/subjects/SubjectsGrid";
import SubjectsHeader from "@/components/subjects/SubjectsHeader";
import SubjectsToolbar from "@/components/subjects/SubjectsToolbar";

import { useAuth } from "@/hooks/useAuth";
import { subjectsService } from "@/services/subjects.service";

import type {
  Subject,
  SubjectApi,
  SubjectColor,
  SubjectCreatePayload,
  SubjectFilter,
  SubjectUpdatePayload,
} from "@/types/subject";

const availableColors: SubjectColor[] = [
  "cyan",
  "blue",
  "violet",
  "emerald",
  "amber",
  "rose",
];

function formatCreatedAt(
  createdAt: string,
): string {
  const createdDate =
    new Date(createdAt);

  const now = new Date();

  const difference =
    now.getTime() -
    createdDate.getTime();

  const differenceInDays =
    Math.floor(
      difference /
        (1000 * 60 * 60 * 24),
    );

  if (differenceInDays <= 0) {
    return "hoy";
  }

  if (differenceInDays === 1) {
    return "ayer";
  }

  if (differenceInDays < 7) {
    return `hace ${differenceInDays} días`;
  }

  return createdDate.toLocaleDateString(
    "es-MX",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

function isRecent(
  createdAt: string,
): boolean {
  const createdDate =
    new Date(createdAt);

  const now = new Date();

  const difference =
    now.getTime() -
    createdDate.getTime();

  const sevenDays =
    7 * 24 * 60 * 60 * 1000;

  return (
    difference >= 0 &&
    difference <= sevenDays
  );
}

function mapApiSubject(
  subject: SubjectApi,
  index: number,
): Subject {
  return {
    id: subject.id,
    name: subject.name,
    description:
      subject.description ??
      "Sin descripción registrada.",
    color:
      availableColors[
        index %
          availableColors.length
      ],
    backendColor:
      subject.color,
    documents: 0,
    summaries: 0,
    flashcards: 0,
    createdAt:
      subject.created_at,
    updatedAt:
      formatCreatedAt(
        subject.created_at,
      ),
  };
}

export default function SubjectsContainer() {
  const { user } = useAuth();
  const userName = user?.name ?? "Usuario";
  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedFilter,
    setSelectedFilter,
  ] =
    useState<SubjectFilter>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState<string | null>(null);

  const [
    isCreateModalOpen,
    setIsCreateModalOpen,
  ] = useState(false);

  const [
    isCreatingSubject,
    setIsCreatingSubject,
  ] = useState(false);

  const [createError, setCreateError] =
    useState<string | null>(null);

  const [
    subjectPendingEdit,
    setSubjectPendingEdit,
  ] = useState<Subject | null>(
    null,
  );

  const [
    isEditingSubject,
    setIsEditingSubject,
  ] = useState(false);

  const [editError, setEditError] =
    useState<string | null>(null);

  const [
    subjectPendingDelete,
    setSubjectPendingDelete,
  ] = useState<Subject | null>(
    null,
  );

  const [
    deletingSubjectId,
    setDeletingSubjectId,
  ] = useState<string | null>(
    null,
  );

  const loadSubjects =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setPageError(null);

        const response =
          await subjectsService.getAll();

        setSubjects(
          response.map(
            mapApiSubject,
          ),
        );
      } catch (requestError) {
        setPageError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible cargar las materias.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadSubjects();
  }, [loadSubjects]);

  const filteredSubjects =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      return subjects.filter(
        (subject) => {
          const matchesSearch =
            normalizedSearch.length ===
              0 ||
            subject.name
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            subject.description
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesFilter =
            selectedFilter ===
              "all" ||
            (selectedFilter ===
              "recent" &&
              isRecent(
                subject.createdAt,
              ));

          return (
            matchesSearch &&
            matchesFilter
          );
        },
      );
    }, [
      subjects,
      searchTerm,
      selectedFilter,
    ]);

  function clearFilters() {
    setSearchTerm("");
    setSelectedFilter("all");
  }

  function openCreateModal() {
    setCreateError(null);
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    if (isCreatingSubject) {
      return;
    }

    setCreateError(null);
    setIsCreateModalOpen(false);
  }

  function openEditModal(
    subject: Subject,
  ) {
    setEditError(null);
    setSubjectPendingEdit(
      subject,
    );
  }

  function closeEditModal() {
    if (isEditingSubject) {
      return;
    }

    setEditError(null);
    setSubjectPendingEdit(null);
  }

  function openDeleteModal(
    subject: Subject,
  ) {
    setPageError(null);
    setSubjectPendingDelete(
      subject,
    );
  }

  function closeDeleteModal() {
    if (deletingSubjectId) {
      return;
    }

    setSubjectPendingDelete(null);
  }

  async function handleCreateSubject(
    payload: SubjectCreatePayload,
  ): Promise<void> {
    try {
      setIsCreatingSubject(true);
      setCreateError(null);

      const createdSubject =
        await subjectsService.create(
          payload,
        );

      setSubjects((current) => [
        mapApiSubject(
          createdSubject,
          current.length,
        ),
        ...current,
      ]);

      setIsCreateModalOpen(false);
    } catch (requestError) {
      setCreateError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible crear la materia.",
      );
    } finally {
      setIsCreatingSubject(false);
    }
  }

  async function handleEditSubject(
    payload: SubjectUpdatePayload,
  ): Promise<void> {
    if (!subjectPendingEdit) {
      return;
    }

    try {
      setIsEditingSubject(true);
      setEditError(null);

      const updatedSubject =
        await subjectsService.update(
          subjectPendingEdit.id,
          payload,
        );

      setSubjects((current) =>
        current.map(
          (subject, index) =>
            subject.id ===
            updatedSubject.id
              ? mapApiSubject(
                  updatedSubject,
                  index,
                )
              : subject,
        ),
      );

      setSubjectPendingEdit(null);
    } catch (requestError) {
      setEditError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible actualizar la materia.",
      );
    } finally {
      setIsEditingSubject(false);
    }
  }

  async function handleDeleteSubject(): Promise<void> {
    if (!subjectPendingDelete) {
      return;
    }

    try {
      setDeletingSubjectId(
        subjectPendingDelete.id,
      );

      setPageError(null);

      await subjectsService.remove(
        subjectPendingDelete.id,
      );

      setSubjects((current) =>
        current.filter(
          (subject) =>
            subject.id !==
            subjectPendingDelete.id,
        ),
      );

      setSubjectPendingDelete(null);
    } catch (requestError) {
      setPageError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible eliminar la materia.",
      );
    } finally {
      setDeletingSubjectId(null);
    }
  }

  if (isLoading) {
    return (
      <WorkspaceShell userName={userName}>
        <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-5 py-8">
          <div className="rounded-2xl border border-brand-border bg-brand-card px-8 py-6 text-center shadow-sm">
            <p className="text-nav text-dark-title">
              Cargando materias...
            </p>

            <p className="text-helper mt-2 text-sm">
              Estamos consultando la
              información guardada en el
              servidor.
            </p>
          </div>
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell userName={userName}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <SubjectsHeader
          totalSubjects={
            subjects.length
          }
          onCreateSubject={
            openCreateModal
          }
        />

        {pageError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {pageError}
          </div>
        )}

        <SubjectsToolbar
          searchTerm={searchTerm}
          selectedFilter={
            selectedFilter
          }
          onSearchChange={
            setSearchTerm
          }
          onFilterChange={
            setSelectedFilter
          }
        />

        <div className="flex items-center justify-between gap-4">
          <p className="text-helper text-sm">
            Mostrando{" "}
            <span className="text-nav text-dark-title">
              {
                filteredSubjects.length
              }
            </span>{" "}
            resultados
          </p>

          {(searchTerm ||
            selectedFilter !==
              "all") && (
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
          subjects={
            filteredSubjects
          }
          deletingSubjectId={
            deletingSubjectId
          }
          onClearFilters={
            clearFilters
          }
          onRequestEdit={
            openEditModal
          }
          onRequestDelete={
            openDeleteModal
          }
        />
      </div>

      <CreateSubjectModal
        isOpen={isCreateModalOpen}
        isSubmitting={
          isCreatingSubject
        }
        error={createError}
        onClose={
          closeCreateModal
        }
        onSubmit={
          handleCreateSubject
        }
      />

      <EditSubjectModal
        subject={
          subjectPendingEdit
        }
        isSubmitting={
          isEditingSubject
        }
        error={editError}
        onClose={
          closeEditModal
        }
        onSubmit={
          handleEditSubject
        }
      />

      <DeleteSubjectModal
        subject={
          subjectPendingDelete
        }
        isDeleting={
          deletingSubjectId !==
          null
        }
        onClose={
          closeDeleteModal
        }
        onConfirm={
          handleDeleteSubject
        }
      />
    </WorkspaceShell>
  );
}
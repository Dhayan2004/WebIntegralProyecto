import type {
    DocumentType,
    StudyDocument,
  } from "@/types/document";
  
  interface DocumentCardProps {
    document: StudyDocument;
  }
  
  const typeStyles: Record<
    DocumentType,
    {
      label: string;
      abbreviation: string;
      container: string;
    }
  > = {
    pdf: {
      label: "PDF",
      abbreviation: "PDF",
      container: "bg-rose-50 text-rose-700",
    },
    word: {
      label: "Word",
      abbreviation: "DOC",
      container: "bg-blue-50 text-blue-700",
    },
    presentation: {
      label: "Presentación",
      abbreviation: "PPT",
      container: "bg-amber-50 text-amber-700",
    },
    text: {
      label: "Texto",
      abbreviation: "TXT",
      container: "bg-emerald-50 text-emerald-700",
    },
  };
  
  export default function DocumentCard({
    document,
  }: DocumentCardProps) {
    const styles = typeStyles[document.type];
  
    return (
      <article className="flex h-full flex-col rounded-2xl border border-brand-border bg-brand-card p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-cyan-light hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${styles.container}`}
          >
            <span className="text-nav text-sm">
              {styles.abbreviation}
            </span>
          </div>
  
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                document.isProcessed
                  ? "bg-brand-cyan-muted text-brand-cyan"
                  : "bg-brand-bg text-dark-muted"
              }`}
            >
              {document.isProcessed
                ? "Procesado"
                : "Pendiente"}
            </span>
  
            <button
              type="button"
              aria-label={`Más opciones para ${document.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-muted transition hover:bg-brand-bg hover:text-dark-title"
            >
              <span
                aria-hidden="true"
                className="text-xl leading-none"
              >
                ⋮
              </span>
            </button>
          </div>
        </div>
  
        <div className="mt-5">
          <p className="text-brand text-xs">
            {document.subject}
          </p>

          <h2 className="text-display mt-2 text-xl">
            {document.title}
          </h2>
        </div>
  
        <div className="mt-5 rounded-xl bg-brand-bg p-4">
          <p className="text-nav truncate text-sm text-dark-title">
            {document.fileName}
          </p>
  
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-helper text-xs">
              {styles.label}
            </span>

            <span className="text-helper text-xs">
              {document.size}
            </span>
          </div>
        </div>
  
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <p className="text-helper text-xs">
            Agregado {document.createdAt}
          </p>
  
          <button
            type="button"
            className="text-nav rounded-xl border border-brand-border bg-brand-card px-4 py-2 text-sm text-dark-title transition hover:border-brand-cyan-light hover:text-brand-cyan"
          >
            Ver archivo
          </button>
        </div>
      </article>
    );
  }
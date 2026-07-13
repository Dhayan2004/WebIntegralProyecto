interface SubjectsHeaderProps {
    totalSubjects: number;
  }
  
  export default function SubjectsHeader({
    totalSubjects,
  }: SubjectsHeaderProps) {
    return (
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-brand text-sm">
            Organización académica
          </p>
  
          <h1 className="text-display mt-2 text-3xl sm:text-4xl">
            Mis materias
          </h1>
  
          <p className="text-helper mt-3 max-w-2xl text-sm sm:text-base">
            Organiza tus documentos, resúmenes, flashcards y cuestionarios
            dentro de cada espacio de estudio.
          </p>
  
          <p className="text-nav mt-3 text-sm text-dark-muted">
            {totalSubjects}{" "}
            {totalSubjects === 1
              ? "materia registrada"
              : "materias registradas"}
          </p>
        </div>
  
        <button
          type="button"
          className="text-nav inline-flex items-center justify-center gap-2 rounded-xl bg-brand-cyan px-5 py-3 text-sm text-white shadow-sm transition hover:bg-brand-cyan-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className="text-lg"
          >
            +
          </span>
          Nueva materia
        </button>
      </header>
    );
  }
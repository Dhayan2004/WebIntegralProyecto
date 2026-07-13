interface TopbarProps {
    userName: string;
    onMenuClick: () => void;
  }
  
  function getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }
  
  export default function Topbar({
    userName,
    onMenuClick,
  }: TopbarProps) {
    return (
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-brand-border bg-brand-card/95 px-5 backdrop-blur sm:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Abrir navegación"
            onClick={onMenuClick}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-brand-border bg-brand-card transition hover:bg-brand-bg lg:hidden"
          >
            <span className="h-0.5 w-5 rounded bg-dark-title" />
            <span className="h-0.5 w-5 rounded bg-dark-title" />
            <span className="h-0.5 w-5 rounded bg-dark-title" />
          </button>
  
          <div>
            <p className="text-nav text-sm text-dark-title">
              Centro de estudio
            </p>
  
            <p className="text-helper text-xs">
              Administra tus herramientas y contenidos
            </p>
          </div>
        </div>
  
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-nav text-sm text-dark-title">
              {userName}
            </p>
  
            <p className="text-helper text-xs">
              Estudiante
            </p>
          </div>
  
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cyan-muted">
            <span className="text-brand text-sm">
              {getInitials(userName)}
            </span>
          </div>
        </div>
      </header>
    );
  }
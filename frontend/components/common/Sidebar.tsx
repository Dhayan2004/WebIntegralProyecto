"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    abbreviation: "DB",
  },
  {
    name: "Materias",
    href: "/subjects",
    abbreviation: "MA",
  },
  {
    name: "Documentos",
    href: "/documents",
    abbreviation: "DO",
  },
  {
    name: "Resúmenes",
    href: "/summaries",
    abbreviation: "RE",
  },
  {
    name: "Flashcards",
    href: "/flashcards",
    abbreviation: "FL",
  },
  {
    name: "Cuestionarios",
    href: "/quizzes",
    abbreviation: "CU",
  },
  {
    name: "Chat con IA",
    href: "/chat",
    abbreviation: "IA",
  },
];

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-dark-title/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-brand-border bg-brand-card transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-brand-border px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cyan-muted">
              <span className="text-brand text-sm">AI</span>
            </div>

            <div>
              <p className="text-display text-lg">WebIntegral</p>
              <p className="text-helper text-xs">
                Plataforma de estudio
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Cerrar navegación"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-muted transition hover:bg-brand-bg hover:text-dark-title lg:hidden"
            onClick={onClose}
          >
            <span aria-hidden="true" className="text-xl">
              ×
            </span>
          </button>
        </div>

        <nav
          aria-label="Navegación principal"
          className="flex-1 overflow-y-auto px-4 py-6"
        >
          <p className="text-nav px-3 text-xs uppercase tracking-wider text-dark-muted">
            Menú principal
          </p>

          <ul className="mt-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                      isActive
                        ? "bg-brand-cyan-muted text-brand-cyan"
                        : "text-dark-body hover:bg-brand-bg hover:text-dark-title"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold ${
                        isActive
                          ? "bg-brand-cyan-light text-brand-cyan"
                          : "bg-brand-bg text-dark-muted"
                      }`}
                    >
                      {item.abbreviation}
                    </span>

                    <span className="text-nav text-sm">
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-brand-border p-4">
          <div className="rounded-2xl bg-brand-cyan-muted p-4">
            <p className="text-nav text-sm text-dark-title">
              Estudia con ayuda de IA
            </p>

            <p className="text-helper mt-1 text-xs">
              Consulta documentos, genera materiales y resuelve tus dudas.
            </p>

            <Link
              href="/chat"
              onClick={onClose}
              className="text-brand mt-3 inline-flex text-sm"
            >
              Abrir chat
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
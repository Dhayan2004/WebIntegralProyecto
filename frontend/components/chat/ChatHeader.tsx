import type { ChatConversation } from "@/types/chat";

interface ChatHeaderProps {
  conversation: ChatConversation;
}

export default function ChatHeader({
  conversation,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-brand-border bg-brand-card px-5 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-cyan-muted">
          <span className="text-brand text-sm">
            IA
          </span>
        </div>

        <div className="min-w-0">
          <h1 className="text-nav truncate text-base text-dark-title sm:text-lg">
            {conversation.title}
          </h1>

          <p className="text-helper truncate text-xs">
            Asistente de estudio
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

        <p className="text-helper text-xs">
          En línea
        </p>
      </div>
    </header>
  );
}
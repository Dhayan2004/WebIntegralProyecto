import ConversationItem from "@/components/chat/ConversationItem";
import type { ChatConversation } from "@/types/chat";

interface ConversationSidebarProps {
  conversations: ChatConversation[];
  selectedConversationId: string;
  onSelectConversation: (
    conversation: ChatConversation,
  ) => void;
  onCreateConversation: () => void;
}

export default function ConversationSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
}: ConversationSidebarProps) {
  return (
    <aside className="flex min-h-0 flex-col border-b border-brand-border bg-brand-card lg:border-b-0 lg:border-r">
      <div className="border-b border-brand-border p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-brand text-sm">
              Historial
            </p>

            <h2 className="text-display mt-1 text-xl">
              Conversaciones
            </h2>
          </div>

          <button
            type="button"
            onClick={onCreateConversation}
            aria-label="Nueva conversación"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cyan text-white transition hover:bg-brand-cyan-hover"
          >
            <span aria-hidden="true" className="text-xl">
              +
            </span>
          </button>
        </div>

        <label className="relative mt-5 block">
          <span className="sr-only">
            Buscar conversación
          </span>

          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted"
          >
            ⌕
          </span>

          <input
            type="search"
            placeholder="Buscar conversación"
            className="text-helper w-full rounded-xl border border-brand-border bg-brand-bg py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-dark-muted focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan-light"
          />
        </label>
      </div>

      <div className="max-h-72 space-y-2 overflow-y-auto p-3 lg:max-h-none lg:flex-1">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={
              conversation.id ===
              selectedConversationId
            }
            onSelect={onSelectConversation}
          />
        ))}
      </div>

      <div className="hidden border-t border-brand-border p-4 lg:block">
        <div className="rounded-2xl bg-brand-cyan-muted p-4">
          <p className="text-nav text-sm text-dark-title">
            Consejo
          </p>

          <p className="text-helper mt-1 text-xs">
            Formula preguntas específicas para obtener respuestas más útiles.
          </p>
        </div>
      </div>
    </aside>
  );
}
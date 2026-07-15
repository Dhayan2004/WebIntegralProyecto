import type { ChatConversation } from "@/types/chat";

interface ConversationItemProps {
  conversation: ChatConversation;
  isActive: boolean;
  onSelect: (conversation: ChatConversation) => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onSelect,
}: ConversationItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={`w-full rounded-2xl p-4 text-left transition ${
        isActive
          ? "bg-brand-cyan-muted"
          : "hover:bg-brand-bg"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isActive
              ? "bg-brand-cyan-light"
              : "bg-brand-bg"
          }`}
        >
          <span className="text-brand text-xs">
            IA
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p
              className={`text-nav truncate text-sm ${
                isActive
                  ? "text-brand-cyan"
                  : "text-dark-title"
              }`}
            >
              {conversation.title}
            </p>

            <span className="text-helper shrink-0 text-[10px]">
              {conversation.updatedAt}
            </span>
          </div>

          <p className="text-helper mt-1 truncate text-xs">
            {conversation.subject}
          </p>

          <p className="text-helper mt-2 line-clamp-2 text-xs">
            {conversation.messages.at(-1)?.content ??
              "Conversación sin mensajes"}
          </p>
        </div>
      </div>
    </button>
  );
}
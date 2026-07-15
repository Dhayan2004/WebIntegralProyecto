import type { ChatMessage } from "@/types/chat";

interface ChatWindowProps {
  messages: ChatMessage[];
}

export default function ChatWindow({
  messages,
}: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <article
              key={message.id}
              className={`flex gap-3 ${
                isUser
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-cyan-muted">
                  <span className="text-brand text-xs">
                    IA
                  </span>
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 sm:max-w-[75%] ${
                  isUser
                    ? "rounded-br-md bg-brand-cyan text-white"
                    : "rounded-bl-md border border-brand-border bg-brand-card"
                }`}
              >
                <p
                  className={`text-sm leading-relaxed ${
                    isUser
                      ? "font-light text-white"
                      : "text-helper"
                  }`}
                >
                  {message.content}
                </p>

                <p
                  className={`mt-2 text-right text-[10px] ${
                    isUser
                      ? "text-white/70"
                      : "text-dark-muted"
                  }`}
                >
                  {message.createdAt}
                </p>
              </div>

              {isUser && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cyan-muted">
                  <span className="text-brand text-xs">
                    A
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ConversationSidebar from "@/components/chat/ConversationSidebar";
import MessageInput from "@/components/chat/MessageInput";
import SuggestedPrompts from "@/components/chat/SuggestedPrompts";
import WorkspaceShell from "@/components/common/WorkspaceShell";
import { useAuth } from "@/hooks/useAuth";
import { chatService } from "@/services/chatService";
import type {
  ChatConversation,
  ChatMessage,
  ChatMessageApi,
  ChatSessionApi,
} from "@/types/chat";

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSessionDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(
    diffMs / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `${diffDays} días`;
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

function mapMessage(
  msg: ChatMessageApi,
): ChatMessage {
  return {
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    createdAt: formatMessageTime(msg.created_at),
  };
}

export default function ChatContainer() {
  const { user, loading: authLoading } = useAuth();
  const userName = user?.name ?? "Usuario";

  const [conversations, setConversations] = useState<
    ChatConversation[]
  >([]);
  const [selectedId, setSelectedId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null,
  );
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    chatService
      .getSessions()
      .then(async (sessions) => {
        const convs: ChatConversation[] = [];
        for (const session of sessions) {
          const messages =
            await chatService.getMessages(session.id);
          convs.push({
            id: session.id,
            title: session.title,
            updatedAt: formatSessionDate(
              session.updated_at,
            ),
            messages: messages.map(mapMessage),
          });
        }
        setConversations(convs);
        if (convs.length > 0) setSelectedId(convs[0].id);
      })
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar conversaciones",
        ),
      )
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  const selectedConversation =
    conversations.find((c) => c.id === selectedId) ??
    null;

  function selectConversation(
    conversation: ChatConversation,
  ) {
    setSelectedId(conversation.id);
  }

  async function createConversation() {
    try {
      setError(null);
      const session =
        await chatService.createSession();
      const newConv: ChatConversation = {
        id: session.id,
        title: session.title,
        updatedAt: "Ahora",
        messages: [],
      };
      setConversations((current) => [
        newConv,
        ...current,
      ]);
      setSelectedId(newConv.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al crear conversación",
      );
    }
  }

  async function sendMessage(content: string) {
    if (!selectedId || sending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toLocaleTimeString(
        "es-ES",
        { hour: "2-digit", minute: "2-digit" },
      ),
    };

    setConversations((current) =>
      current.map((conv) =>
        conv.id === selectedId
          ? {
              ...conv,
              updatedAt: "Ahora",
              messages: [
                ...conv.messages,
                userMessage,
              ],
            }
          : conv,
      ),
    );

    try {
      setSending(true);
      const updatedMessages =
        await chatService.sendMessage(
          selectedId,
          content,
        );

      setConversations((current) =>
        current.map((conv) =>
          conv.id === selectedId
            ? {
                ...conv,
                messages:
                  updatedMessages.map(mapMessage),
              }
            : conv,
        ),
      );
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Lo siento, hubo un error al procesar tu mensaje.",
        createdAt: new Date().toLocaleTimeString(
          "es-ES",
          { hour: "2-digit", minute: "2-digit" },
        ),
      };
      setConversations((current) =>
        current.map((conv) =>
          conv.id === selectedId
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  errorMsg,
                ],
              }
            : conv,
        ),
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <WorkspaceShell userName={userName}>
      <div className="h-[calc(100vh-5rem)] p-0 lg:p-6">
        <div className="mx-auto grid h-full w-full max-w-7xl overflow-hidden border-brand-border bg-brand-card shadow-sm lg:grid-cols-[320px_minmax(0,1fr)] lg:rounded-3xl lg:border">
          <ConversationSidebar
            conversations={conversations}
            selectedConversationId={selectedId}
            onSelectConversation={selectConversation}
            onCreateConversation={createConversation}
          />

          <section className="flex min-h-0 flex-col bg-brand-bg">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <p className="text-helper text-sm">
                  Cargando conversaciones...
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-12">
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              selectedConversation && (
                <>
                  <ChatHeader
                    conversation={
                      selectedConversation
                    }
                  />

                  <ChatWindow
                    messages={
                      selectedConversation.messages
                    }
                  />

                  <SuggestedPrompts
                    onSelectPrompt={sendMessage}
                  />

                  <MessageInput
                    onSend={sendMessage}
                    disabled={sending}
                  />
                </>
              )}

            {!loading &&
              !error &&
              !user && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-helper text-sm">
                    Inicia sesión para usar el chat.
                  </p>
                </div>
              )}

            {!loading &&
              !error &&
              user &&
              !selectedConversation && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-helper text-sm">
                    Crea una conversación para comenzar.
                  </p>
                </div>
              )}
          </section>
        </div>
      </div>
    </WorkspaceShell>
  );
}

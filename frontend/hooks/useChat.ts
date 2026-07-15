"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { chatService } from "@/services/chatService";
import type {
  ChatConversation,
  ChatMessage,
  ChatMessageApi,
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
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `${diffDays} días`;
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

function mapMessage(msg: ChatMessageApi): ChatMessage {
  return {
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    createdAt: formatMessageTime(msg.created_at),
  };
}

export interface UseChatReturn {
  conversations: ChatConversation[];
  selectedId: string | null;
  selectedConversation: ChatConversation | null;
  loading: boolean;
  error: string | null;
  sending: boolean;
  selectConversation: (conv: ChatConversation) => void;
  createConversation: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
}

export function useChat(): UseChatReturn {
  const { user, loading: authLoading } = useAuth();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          const messages = await chatService.getMessages(session.id);
          convs.push({
            id: session.id,
            title: session.title,
            updatedAt: formatSessionDate(session.updated_at),
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
    conversations.find((c) => c.id === selectedId) ?? null;

  const selectConversation = useCallback((conv: ChatConversation) => {
    setSelectedId(conv.id);
  }, []);

  const createConversation = useCallback(async () => {
    try {
      setError(null);
      const session = await chatService.createSession();
      const newConv: ChatConversation = {
        id: session.id,
        title: session.title,
        updatedAt: "Ahora",
        messages: [],
      };
      setConversations((current) => [newConv, ...current]);
      setSelectedId(newConv.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al crear conversación",
      );
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedId || sending) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        createdAt: new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setConversations((current) =>
        current.map((conv) =>
          conv.id === selectedId
            ? { ...conv, updatedAt: "Ahora", messages: [...conv.messages, userMessage] }
            : conv,
        ),
      );

      try {
        setSending(true);
        const updatedMessages = await chatService.sendMessage(selectedId, content);
        setConversations((current) =>
          current.map((conv) =>
            conv.id === selectedId
              ? { ...conv, messages: updatedMessages.map(mapMessage) }
              : conv,
          ),
        );
      } catch {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje.",
          createdAt: new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setConversations((current) =>
          current.map((conv) =>
            conv.id === selectedId
              ? { ...conv, messages: [...conv.messages, errorMsg] }
              : conv,
          ),
        );
      } finally {
        setSending(false);
      }
    },
    [selectedId, sending],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    conversations,
    selectedId,
    selectedConversation,
    loading,
    error,
    sending,
    selectConversation,
    createConversation,
    sendMessage,
    clearError,
  };
}

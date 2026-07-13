"use client";

import { useState } from "react";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ConversationSidebar from "@/components/chat/ConversationSidebar";
import MessageInput from "@/components/chat/MessageInput";
import SuggestedPrompts from "@/components/chat/SuggestedPrompts";
import WorkspaceShell from "@/components/common/WorkspaceShell";
import type {
  ChatConversation,
  ChatMessage,
} from "@/types/chat";

const initialConversations: ChatConversation[] = [
  {
    id: "conversation-next",
    title: "Dudas sobre Next.js",
    subject: "Desarrollo Web",
    updatedAt: "Hoy",
    messages: [
      {
        id: "message-1",
        role: "assistant",
        content:
          "Hola, Aarón. Estoy listo para ayudarte con tus dudas sobre Next.js. ¿Qué tema estás estudiando?",
        createdAt: "10:22",
      },
      {
        id: "message-2",
        role: "user",
        content:
          "¿Cuál es la diferencia entre un Server Component y un Client Component?",
        createdAt: "10:23",
      },
      {
        id: "message-3",
        role: "assistant",
        content:
          "Los Server Components se ejecutan principalmente en el servidor y permiten acceder directamente a datos sin enviar tanto JavaScript al navegador. Los Client Components se utilizan cuando necesitas estado, eventos, efectos o acceso a funciones del navegador.",
        createdAt: "10:23",
      },
    ],
  },
  {
    id: "conversation-sql",
    title: "Consultas SQL",
    subject: "Bases de Datos",
    updatedAt: "Ayer",
    messages: [
      {
        id: "message-4",
        role: "assistant",
        content:
          "Podemos practicar SELECT, WHERE, JOIN, GROUP BY o cualquier otro tema de SQL.",
        createdAt: "18:42",
      },
      {
        id: "message-5",
        role: "user",
        content:
          "Explícame cuándo debo usar un INNER JOIN.",
        createdAt: "18:43",
      },
    ],
  },
  {
    id: "conversation-data",
    title: "Limpieza de datos",
    subject: "Análisis de Datos",
    updatedAt: "11 jul",
    messages: [
      {
        id: "message-6",
        role: "assistant",
        content:
          "La limpieza de datos permite corregir inconsistencias antes de realizar un análisis.",
        createdAt: "16:10",
      },
    ],
  },
  {
    id: "conversation-leadership",
    title: "Liderazgo y motivación",
    subject: "Comportamiento Organizacional",
    updatedAt: "9 jul",
    messages: [
      {
        id: "message-7",
        role: "user",
        content:
          "¿Cuál es la diferencia entre un líder y un jefe?",
        createdAt: "19:25",
      },
      {
        id: "message-8",
        role: "assistant",
        content:
          "Un jefe se apoya principalmente en la autoridad de su puesto, mientras que un líder influye, motiva y obtiene la confianza del equipo.",
        createdAt: "19:26",
      },
    ],
  },
];

function createAssistantResponse(
  message: string,
): ChatMessage {
  return {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    content: `Entiendo tu pregunta sobre "${message}". En la versión conectada, analizaré tus documentos y materiales para darte una respuesta más precisa.`,
    createdAt: "Ahora",
  };
}

export default function ChatContainer() {
  const [conversations, setConversations] =
    useState(initialConversations);

  const [
    selectedConversationId,
    setSelectedConversationId,
  ] = useState(initialConversations[0].id);

  const selectedConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        selectedConversationId,
    ) ?? conversations[0];

  function selectConversation(
    conversation: ChatConversation,
  ) {
    setSelectedConversationId(conversation.id);
  }

  function createConversation() {
    const newConversation: ChatConversation = {
      id: `conversation-${Date.now()}`,
      title: "Nueva conversación",
      subject: "Asistente general",
      updatedAt: "Ahora",
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content:
            "Hola, Aarón. ¿Sobre qué tema quieres estudiar hoy?",
          createdAt: "Ahora",
        },
      ],
    };

    setConversations((current) => [
      newConversation,
      ...current,
    ]);

    setSelectedConversationId(
      newConversation.id,
    );
  }

  function sendMessage(content: string) {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      createdAt: "Ahora",
    };

    const assistantMessage =
      createAssistantResponse(content);

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id ===
        selectedConversationId
          ? {
              ...conversation,
              updatedAt: "Ahora",
              messages: [
                ...conversation.messages,
                userMessage,
                assistantMessage,
              ],
            }
          : conversation,
      ),
    );
  }

  return (
    <WorkspaceShell userName="Aarón">
      <div className="h-[calc(100vh-5rem)] p-0 lg:p-6">
        <div className="mx-auto grid h-full w-full max-w-7xl overflow-hidden border-brand-border bg-brand-card shadow-sm lg:grid-cols-[320px_minmax(0,1fr)] lg:rounded-3xl lg:border">
          <ConversationSidebar
            conversations={conversations}
            selectedConversationId={
              selectedConversationId
            }
            onSelectConversation={
              selectConversation
            }
            onCreateConversation={
              createConversation
            }
          />

          <section className="flex min-h-0 flex-col bg-brand-bg">
            <ChatHeader
              conversation={selectedConversation}
            />

            <ChatWindow
              messages={
                selectedConversation.messages
              }
            />

            <SuggestedPrompts
              onSelectPrompt={sendMessage}
            />

            <MessageInput onSend={sendMessage} />
          </section>
        </div>
      </div>
    </WorkspaceShell>
  );
}
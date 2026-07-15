import { apiRequest } from "@/services/api";
import type {
  ChatMessageApi,
  ChatSessionApi,
} from "@/types/chat";

export const chatService = {
  async getSessions(): Promise<ChatSessionApi[]> {
    return apiRequest<ChatSessionApi[]>(
      "/chat/sessions",
      { method: "GET", authenticated: true },
    );
  },

  async createSession(
    title?: string,
  ): Promise<ChatSessionApi> {
    return apiRequest<ChatSessionApi>(
      "/chat/sessions",
      {
        method: "POST",
        authenticated: true,
        body: { title: title ?? "Nueva conversación" },
      },
    );
  },

  async getMessages(
    sessionId: string,
  ): Promise<ChatMessageApi[]> {
    return apiRequest<ChatMessageApi[]>(
      `/chat/sessions/${sessionId}/messages`,
      { method: "GET", authenticated: true },
    );
  },

  async sendMessage(
    sessionId: string,
    message: string,
  ): Promise<ChatMessageApi[]> {
    return apiRequest<ChatMessageApi[]>(
      `/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        authenticated: true,
        body: { message },
      },
    );
  },
};

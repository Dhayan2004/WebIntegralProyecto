export type ChatRole = "user" | "assistant";

export interface ChatSessionApi {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageApi {
  id: string;
  session_id: string;
  role: string;
  content: string;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

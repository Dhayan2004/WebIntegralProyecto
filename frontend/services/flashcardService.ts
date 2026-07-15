import { apiRequest } from "@/services/api";
import type {
  FlashcardApi,
  FlashcardCreatePayload,
  FlashcardGeneratePayload,
} from "@/types/flashcard";

export const flashcardService = {
  async getAll(): Promise<FlashcardApi[]> {
    return apiRequest<FlashcardApi[]>("/flashcards", {
      method: "GET",
      authenticated: true,
    });
  },

  async create(
    payload: FlashcardCreatePayload,
  ): Promise<FlashcardApi> {
    return apiRequest<FlashcardApi>("/flashcards", {
      method: "POST",
      authenticated: true,
      body: payload,
    });
  },

  async generate(
    payload: FlashcardGeneratePayload,
  ): Promise<FlashcardApi[]> {
    return apiRequest<FlashcardApi[]>(
      "/flashcards/generate",
      {
        method: "POST",
        authenticated: true,
        body: payload,
      },
    );
  },
};

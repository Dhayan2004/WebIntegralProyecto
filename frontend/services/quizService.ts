import { apiRequest } from "@/services/api";
import type {
  QuizApi,
  QuizGeneratePayload,
} from "@/types/quiz";

export const quizService = {
  async getAll(): Promise<QuizApi[]> {
    return apiRequest<QuizApi[]>("/quizzes", {
      method: "GET",
      authenticated: true,
    });
  },

  async generate(
    payload: QuizGeneratePayload,
  ): Promise<QuizApi[]> {
    return apiRequest<QuizApi[]>(
      "/quizzes/generate",
      {
        method: "POST",
        authenticated: true,
        body: payload,
      },
    );
  },
};

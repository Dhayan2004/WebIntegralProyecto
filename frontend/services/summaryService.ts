import { apiRequest } from "@/services/api";
import type {
  SummaryApi,
  SummaryCreatePayload,
} from "@/types/summary";

export const summaryService = {
  async getAll(): Promise<SummaryApi[]> {
    return apiRequest<SummaryApi[]>("/summaries", {
      method: "GET",
      authenticated: true,
    });
  },

  async create(
    payload: SummaryCreatePayload,
  ): Promise<SummaryApi> {
    return apiRequest<SummaryApi>("/summaries", {
      method: "POST",
      authenticated: true,
      body: payload,
    });
  },
};

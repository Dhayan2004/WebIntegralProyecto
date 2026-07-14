import { apiRequest } from "@/services/api";

import type {
  SubjectApi,
  SubjectCreatePayload,
  SubjectUpdatePayload,
} from "@/types/subject";

export const subjectsService = {
  async getAll(): Promise<SubjectApi[]> {
    return apiRequest<SubjectApi[]>(
      "/subjects",
      {
        method: "GET",
        authenticated: true,
      },
    );
  },

  async create(
    payload: SubjectCreatePayload,
  ): Promise<SubjectApi> {
    return apiRequest<SubjectApi>(
      "/subjects",
      {
        method: "POST",
        authenticated: true,
        body: payload,
      },
    );
  },

  async update(
    subjectId: string,
    payload: SubjectUpdatePayload,
  ): Promise<SubjectApi> {
    return apiRequest<SubjectApi>(
      `/subjects/${subjectId}`,
      {
        method: "PATCH",
        authenticated: true,
        body: payload,
      },
    );
  },

  async remove(
    subjectId: string,
  ): Promise<void> {
    return apiRequest<void>(
      `/subjects/${subjectId}`,
      {
        method: "DELETE",
        authenticated: true,
      },
    );
  },
};
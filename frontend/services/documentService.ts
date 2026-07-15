import { apiRequest } from "@/services/api";
import type { DocumentApi } from "@/types/document";

export const documentService = {
  async getAll(query?: string): Promise<DocumentApi[]> {
    const params = query ? `?q=${encodeURIComponent(query)}` : "";
    return apiRequest<DocumentApi[]>(
      `/documents${params}`,
      { method: "GET", authenticated: true },
    );
  },

  async upload(
    file: File,
    subjectId: string,
  ): Promise<DocumentApi> {
    const token = localStorage.getItem(
      "studybuddy_access_token",
    );
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject_id", subjectId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api"}/documents/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const data = await response
        .json()
        .catch(() => null);
      const detail =
        data?.detail ??
        "Error al subir el documento.";
      throw new Error(detail);
    }

    return response.json();
  },

  async remove(documentId: string): Promise<void> {
    return apiRequest<void>(
      `/documents/${documentId}`,
      { method: "DELETE", authenticated: true },
    );
  },
};

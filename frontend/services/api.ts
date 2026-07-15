const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000/api";

const ACCESS_TOKEN_KEY = "studybuddy_access_token";
const REFRESH_TOKEN_KEY = "studybuddy_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveTokens(
  accessToken: string,
  refreshToken: string,
): void {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken,
  );

  localStorage.setItem(
    REFRESH_TOKEN_KEY,
    refreshToken,
  );
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

interface ApiRequestOptions
  extends Omit<RequestInit, "body"> {
  body?: unknown;
  authenticated?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    authenticated = false,
    headers,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (body !== undefined) {
    requestHeaders.set(
      "Content-Type",
      "application/json",
    );
  }

  if (authenticated) {
    const token = getAccessToken();

    if (!token) {
      throw new Error(
        "No hay una sesión activa.",
      );
    }

    requestHeaders.set(
      "Authorization",
      `Bearer ${token}`,
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...requestOptions,
      headers: requestHeaders,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    },
  );

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(
    () => null,
  );

  if (!response.ok) {
    const detail =
      data &&
      typeof data === "object" &&
      "detail" in data
        ? String(data.detail)
        : "Ocurrió un error al comunicarse con el servidor.";

    throw new Error(detail);
  }

  return data as T;
}
import {
    apiRequest,
    clearTokens,
    saveTokens,
  } from "@/services/api";
  
  import type {
    AuthUser,
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
  } from "@/types/auth";
  
  export const authService = {
    async login(
      payload: LoginPayload,
    ): Promise<LoginResponse> {
      const response =
        await apiRequest<LoginResponse>(
          "/auth/login",
          {
            method: "POST",
            body: payload,
          },
        );
  
      saveTokens(
        response.access_token,
        response.refresh_token,
      );
  
      return response;
    },
  
    async register(
      payload: RegisterPayload,
    ): Promise<RegisterResponse> {
      return apiRequest<RegisterResponse>(
        "/auth/register",
        {
          method: "POST",
          body: payload,
        },
      );
    },
  
    async verifyEmail(
      token: string,
    ): Promise<{ message: string }> {
      return apiRequest<{ message: string }>(
        "/auth/verify-email",
        {
          method: "POST",
          body: { token },
        },
      );
    },
  
    async getCurrentUser(): Promise<AuthUser> {
      return apiRequest<AuthUser>(
        "/auth/me",
        {
          method: "GET",
          authenticated: true,
        },
      );
    },
  
    logout(): void {
      clearTokens();
    },
  };
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: string;
    organization_id: string | null;
    email_verified: boolean;
    created_at: string;
  }
  
  export interface AuthOrganization {
    id: string;
    slug: string;
    name: string;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: AuthUser;
  }
  
  export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    organization_slug: string;
    accept_terms: boolean;
  }
  
  export interface RegisterResponse {
    user: AuthUser;
    organization: AuthOrganization;
  }
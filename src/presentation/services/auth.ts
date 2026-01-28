import type { User } from "@/domain/entities/user.entity";
import { apiUrl } from "@/presentation/lib/config/config";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  data?: User;
  message?: string;
  error?: string;
}

export interface TokenResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

class AuthApi {
  private static API_URL = apiUrl;

  private static async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${this.API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "An error occurred");
    }

    return data;
  }

  static async login(
    credentials: LoginCredentials,
  ): Promise<{ data?: User; error?: string }> {
    try {
      const response = await this.fetchApi<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return { data: response.data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  static async adminLogin(
    credentials: LoginCredentials,
  ): Promise<{ data?: User; error?: string }> {
    try {
      const response = await this.fetchApi<AuthResponse>("/auth/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return { data: response.data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Admin login failed",
      };
    }
  }

  static async register(
    data: RegisterData,
  ): Promise<{ data?: User; error?: string }> {
    try {
      const response = await this.fetchApi<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return { data: response.data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  }

  static async getCurrentUser(): Promise<{ data?: User; error?: string }> {
    try {
      const response = await this.fetchApi<AuthResponse>("/auth/me");
      return { data: response.data };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get current user",
      };
    }
  }

  static async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.fetchApi<{ success: boolean }>("/auth/logout", {
        method: "POST",
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Logout failed",
      };
    }
  }

  static async refreshToken(): Promise<{
    data?: { accessToken: string; refreshToken: string };
    error?: string;
  }> {
    try {
      const response = await this.fetchApi<TokenResponse>("/auth/token");
      return { data: response.data };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to refresh token",
      };
    }
  }
}

export { AuthApi };

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

  static async login(credentials: LoginCredentials): Promise<User> {
    const response = await this.fetchApi<{ data?: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (!response.data) {
      throw new Error("Login failed");
    }
    return response.data;
  }

  static async adminLogin(credentials: LoginCredentials): Promise<User> {
    const response = await this.fetchApi<{ data?: User }>("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (!response.data) {
      throw new Error("Admin login failed");
    }
    return response.data;
  }

  static async register(data: RegisterData): Promise<User> {
    const response = await this.fetchApi<{ data?: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.data) {
      throw new Error("Registration failed");
    }
    return response.data;
  }

  static async getCurrentUser(): Promise<{ data?: User; error?: string }> {
    try {
      const response = await this.fetchApi<{ data?: User }>("/auth/me");
      if (!response.data) {
        return { error: "Failed to get current user" };
      }
      return { data: response.data };
    } catch (err) {
      return {
        error:
          err instanceof Error ? err.message : "Failed to get current user",
      };
    }
  }

  static async logout(): Promise<void> {
    await this.fetchApi<{ success: boolean }>("/auth/logout", {
      method: "POST",
    });
  }

  static async refreshToken(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await this.fetchApi<{
      data?: { accessToken: string; refreshToken: string };
    }>("/auth/token");
    if (!response.data) {
      throw new Error("Failed to refresh token");
    }
    return response.data;
  }
}

export { AuthApi };

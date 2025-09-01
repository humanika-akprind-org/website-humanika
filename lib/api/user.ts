// lib/api/user.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  department?: string;
  position?: string;
  isActive: boolean;
  verifiedAccount: boolean;
  attemptLogin: number;
  blockExpires?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export class UserApi {
  private static async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "An error occurred" };
      }

      return { data };
    } catch (_error) {
      return { error: "Network error occurred" };
    }
  }

  // Get all users with pagination and filters
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    department?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<UsersResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.department) queryParams.append("department", params.department);
    if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());

    const queryString = queryParams.toString();
    const endpoint = `/user${queryString ? `?${queryString}` : ""}`;

    return this.fetchApi<UsersResponse>(endpoint);
  }

  // Get user by ID
  static async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.fetchApi<User>(`/user/${id}`);
  }

  // Create new user
  static async createUser(
    userData: CreateUserData
  ): Promise<ApiResponse<User>> {
    return this.fetchApi<User>("/user", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Update user
  static async updateUser(
    id: string,
    userData: UpdateUserData
  ): Promise<ApiResponse<User>> {
    return this.fetchApi<User>(`/user/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Delete user
  static async deleteUser(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi<{ message: string }>(`/user/${id}`, {
      method: "DELETE",
    });
  }

  // Toggle user active status
  static async toggleUserStatus(
    id: string,
    isActive: boolean
  ): Promise<ApiResponse<User>> {
    return this.updateUser(id, { isActive });
  }
}

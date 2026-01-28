/**
 * User Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 */

import type { UserRole, Department, Position } from "@prisma/client";

// ============================================================================
// Filter and Input Types
// ============================================================================

export type UserFilter = {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  department?: Department;
  isActive?: boolean;
  verifiedAccount?: boolean;
  allUsers?: boolean;
  excludeUserId?: string;
};

export type UsersResult = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    username: string;
    role: UserRole;
    department: Department | null;
    position: string | null;
    isActive: boolean;
    verifiedAccount: boolean;
    attemptLogin: number | null;
    blockExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
    avatarColor: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type CreateUserInput = {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
  verifiedAccount?: boolean;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
  verifiedAccount?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  department: Department | null;
  position: Position | null;
  isActive: boolean;
  verifiedAccount: boolean;
  attemptLogin: number | null;
  blockExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
  avatarColor: string;
};

// ============================================================================
// Repository Interface
// ============================================================================

export interface IUserRepository {
  getUsers(filter: UserFilter): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(data: CreateUserInput): Promise<User>;
  updateUser(id: string, data: UpdateUserInput): Promise<User>;
  deleteUser(id: string): Promise<void>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void>;
  deleteAccount(userId: string): Promise<void>;
  bulkVerifyUsers(userIds: string[]): Promise<{ count: number }>;
  getUsersForVerification(
    userIds: string[],
  ): Promise<Array<{ id: string; email: string; name: string }>>;
}

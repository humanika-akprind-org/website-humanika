/**
 * User Repository Prisma - Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * Implements IUserRepository using Prisma ORM.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IUserRepository,
  UserFilter,
  CreateUserInput,
  UpdateUserInput,
  User,
} from "@/application/interface/user.repository.interface";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deleteAccount,
  changePassword,
  verifyUser,
  bulkVerifyUsers,
  bulkSendVerificationEmails,
} from "./index";
import { type Department, type Position, type UserRole } from "@/domain/enums";

/**
 * User Repository Prisma Implementation
 */
export class UserRepositoryPrisma implements IUserRepository {
  /**
   * Get users with optional filters and pagination
   */
  async getUsers(filter: UserFilter): Promise<User[]> {
    const users = await getUsers({
      page: filter.page,
      limit: filter.limit,
      search: filter.search,
      role: filter.role,
      department: filter.department,
      isActive: filter.isActive,
      verifiedAccount: filter.verifiedAccount,
      allUsers: filter.allUsers,
      excludeUserId: filter.excludeUserId,
    });
    return users as unknown as User[];
  }

  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<{
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
  } | null> {
    return await getUser(id);
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserInput): Promise<User> {
    return (await createUser({
      name: data.name,
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role,
      department: data.department,
      position: data.position,
      isActive: data.isActive,
      verifiedAccount: data.verifiedAccount,
    })) as unknown as User;
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    return (await updateUser(id, {
      name: data.name,
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role,
      department: data.department,
      position: data.position,
      isActive: data.isActive,
      verifiedAccount: data.verifiedAccount,
    })) as unknown as User;
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    await deleteUser(id);
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await changePassword(userId, currentPassword, newPassword);
  }

  /**
   * Delete user account (self-deletion)
   */
  async deleteAccount(userId: string): Promise<void> {
    await deleteAccount(userId);
  }

  /**
   * Bulk verify users
   */
  async bulkVerifyUsers(userIds: string[]): Promise<{ count: number }> {
    return await bulkVerifyUsers(userIds);
  }

  /**
   * Get users for bulk verification email sending
   */
  async getUsersForVerification(userIds: string[]): Promise<
    Array<{
      id: string;
      email: string;
      name: string;
    }>
  > {
    const result = await bulkSendVerificationEmails(userIds);
    return result.users as Array<{ id: string; email: string; name: string }>;
  }

  /**
   * Verify a single user
   */
  async verifyUser(id: string): Promise<User> {
    return (await verifyUser(id)) as User;
  }
}

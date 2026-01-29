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
  UserPagination,
  UserPaginationResult,
} from "@/application/interface/user.repository.interface";
import type {
  User,
  CreateUserData,
  UpdateUserData,
} from "@/domain/entities/user.entity";
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
import type { Department, Position, UserRole } from "@/domain/enums";

/**
 * User Repository Prisma Implementation
 *
 * This class implements the IUserRepository interface
 * for Clean Architecture compliance.
 */
export class UserRepositoryPrisma implements IUserRepository {
  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    return (await getUsers({})) as unknown as User[];
  }

  /**
   * Get all users with optional filtering and pagination
   */
  async findMany(
    filter?: UserFilter,
    pagination?: UserPagination,
  ): Promise<{ records: User[]; pagination: UserPaginationResult }> {
    const records = await getUsers({
      search: filter?.search,
      role: filter?.role as UserRole | undefined,
      department: filter?.department as Department | undefined,
      isActive: filter?.isActive,
      verifiedAccount: filter?.verifiedAccount,
      allUsers: filter?.allUsers,
      excludeUserId: filter?.excludeUserId,
    });

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated users
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as unknown as User[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single user by ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await getUser(id);
    return user as unknown as User | null;
  }

  /**
   * Get a single user by ID (legacy method for backward compatibility)
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
    attemptLogin: number;
    blockExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
    avatarColor: string;
  } | null> {
    return await getUser(id);
  }

  /**
   * Get users with optional filters (legacy method for backward compatibility)
   */
  async getUsers(filter: UserFilter): Promise<User[]> {
    const users = await getUsers({
      search: filter.search,
      role: filter.role as UserRole | undefined,
      department: filter.department as Department | undefined,
      isActive: filter.isActive,
      verifiedAccount: filter.verifiedAccount,
      allUsers: filter.allUsers,
      excludeUserId: filter.excludeUserId,
    });
    return users as unknown as User[];
  }

  /**
   * Create a new user
   */
  async create(data: CreateUserData): Promise<User> {
    return (await createUser({
      name: data.name,
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role,
      department: data.department,
      position: data.position,
      isActive: data.isActive,
    })) as unknown as User;
  }

  /**
   * Create a new user (legacy method for backward compatibility)
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
    })) as unknown as User;
  }

  /**
   * Update an existing user
   */
  async update(id: string, data: UpdateUserData): Promise<User> {
    return (await updateUser(id, {
      name: data.name,
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role,
      department: data.department,
      position: data.position,
      isActive: data.isActive,
    })) as unknown as User;
  }

  /**
   * Update an existing user (legacy method for backward compatibility)
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
    })) as unknown as User;
  }

  /**
   * Delete a user
   */
  async delete(id: string): Promise<void> {
    await deleteUser(id);
  }

  /**
   * Delete a user (legacy method for backward compatibility)
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
   * Verify a single user (legacy method for backward compatibility)
   */
  async verifyUser(id: string): Promise<User> {
    return (await verifyUser(id)) as User;
  }

  /**
   * Count users with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const users = await getUsers({
      search: where?.search as string,
      role: where?.role as UserRole | undefined,
      department: where?.department as Department | undefined,
      isActive: where?.isActive as boolean,
      verifiedAccount: where?.verifiedAccount as boolean,
      allUsers: where?.allUsers as boolean,
      excludeUserId: where?.excludeUserId as string,
    });
    return users.length;
  }
}

// Type aliases for backward compatibility
type CreateUserInput = CreateUserData;
type UpdateUserInput = UpdateUserData;

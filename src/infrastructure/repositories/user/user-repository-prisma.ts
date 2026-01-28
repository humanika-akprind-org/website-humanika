/**
 * User Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * Implements IUserRepository using Prisma ORM.
 */

import type {
  IUserRepository,
  UserFilter,
  UsersResult,
  CreateUserInput,
  UpdateUserInput,
  User,
} from "@/application/interface/user.repository.interface";
import type { UserRole, Department, Position } from "@prisma/client";
import prisma from "@/presentation/lib/prisma";
import bcrypt from "bcryptjs";
import { randomColor } from "@/presentation/lib/random-color";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

/**
 * User Repository Prisma Implementation
 */
export class UserRepositoryPrisma implements IUserRepository {
  /**
   * Get users with optional filters and pagination
   */
  async getUsers(filter: UserFilter): Promise<UsersResult> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
        username?: { contains: string; mode: "insensitive" };
      }>;
      role?: UserRole;
      department?: Department;
      isActive?: boolean;
      verifiedAccount?: boolean;
      NOT?: { id: string };
    } = {};

    if (filter.excludeUserId) {
      where.NOT = { id: filter.excludeUserId };
    }

    if (!filter.allUsers) {
      where.verifiedAccount = true;
    }

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { email: { contains: filter.search, mode: "insensitive" } },
        { username: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    if (filter.role) {
      where.role = filter.role;
    }
    if (filter.department) {
      where.department = filter.department;
    }
    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }
    if (filter.verifiedAccount !== undefined) {
      where.verifiedAccount = filter.verifiedAccount;
    }

    const shouldPaginate = !filter.allUsers;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        ...(shouldPaginate ? { skip, take: limit } : {}),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          department: true,
          position: true,
          isActive: true,
          verifiedAccount: true,
          attemptLogin: true,
          blockExpires: true,
          createdAt: true,
          updatedAt: true,
          avatarColor: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: shouldPaginate ? Math.ceil(total / limit) : 1,
      },
    };
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
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        department: true,
        position: true,
        isActive: true,
        verifiedAccount: true,
        attemptLogin: true,
        blockExpires: true,
        createdAt: true,
        updatedAt: true,
        avatarColor: true,
      },
    });
    return user;
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserInput): Promise<User> {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: data.role || "ANGGOTA",
        department: data.department || null,
        position: data.position || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        verifiedAccount:
          data.verifiedAccount !== undefined ? data.verifiedAccount : false,
        avatarColor: randomColor,
      },
    });

    // Log activity
    await logActivity({
      userId: "system",
      activityType: ActivityType.CREATE,
      entityType: "User",
      entityId: user.id,
      description: `Created user: ${user.name}`,
      metadata: {
        newData: {
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          department: user.department,
          position: user.position,
          isActive: user.isActive,
          verifiedAccount: user.verifiedAccount,
        },
      },
    });

    return user;
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check for duplicate email or username
    if (
      (data.email && data.email !== existingUser.email) ||
      (data.username && data.username !== existingUser.username)
    ) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          OR: [
            data.email ? { email: data.email } : {},
            data.username ? { username: data.username } : {},
          ].filter((obj) => Object.keys(obj).length > 0),
          NOT: { id },
        },
      });

      if (duplicateUser) {
        throw new Error("Email or username already taken");
      }
    }

    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.position !== undefined) {
      updateData.position = data.position;
    }
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }
    if (data.verifiedAccount !== undefined) {
      updateData.verifiedAccount = data.verifiedAccount;
    }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    await logActivity({
      userId: "system",
      activityType: ActivityType.UPDATE,
      entityType: "User",
      entityId: updatedUser.id,
      description: `Updated user: ${updatedUser.name}`,
      metadata: {
        oldData: {
          name: existingUser.name,
          email: existingUser.email,
          username: existingUser.username,
          role: existingUser.role,
          department: existingUser.department,
          position: existingUser.position,
          isActive: existingUser.isActive,
          verifiedAccount: existingUser.verifiedAccount,
        },
        newData: {
          name: updatedUser.name,
          email: updatedUser.email,
          username: updatedUser.username,
          role: updatedUser.role,
          department: updatedUser.department,
          position: updatedUser.position,
          isActive: updatedUser.isActive,
          verifiedAccount: updatedUser.verifiedAccount,
        },
      },
    });

    return updatedUser;
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.user.delete({
      where: { id },
    });

    // Log activity
    await logActivity({
      userId: "system",
      activityType: ActivityType.DELETE,
      entityType: "User",
      entityId: id,
      description: `Deleted user: ${user.name}`,
      metadata: {
        oldData: {
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          department: user.department,
          position: user.position,
          isActive: user.isActive,
          verifiedAccount: user.verifiedAccount,
        },
        newData: null,
      },
    });
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      throw new Error("User not found or password not set");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }

  /**
   * Delete user account (self-deletion)
   */
  async deleteAccount(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Bulk verify users
   */
  async bulkVerifyUsers(userIds: string[]): Promise<{ count: number }> {
    const result = await prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: { verifiedAccount: true },
    });

    return { count: result.count };
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
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: { id: true, email: true, name: true },
    });

    return users;
  }

  /**
   * Verify a single user
   */
  async verifyUser(id: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: { verifiedAccount: true },
    });

    // Log activity
    await logActivity({
      userId: "system",
      activityType: ActivityType.UPDATE,
      entityType: "User",
      entityId: user.id,
      description: `Verified user: ${user.name}`,
      metadata: {
        oldData: { verifiedAccount: false },
        newData: { verifiedAccount: true },
      },
    });

    return user;
  }
}

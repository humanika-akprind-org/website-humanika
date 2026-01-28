/**
 * Get Users Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UserRole, Department } from "@prisma/client";
import type { User } from "@/domain/entities/user.entity";

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

/**
 * Get all users with optional filters and pagination
 */
export async function getUsers(filter?: UserFilter) {
  const page = filter?.page || 1;
  const limit = filter?.limit || 10;
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

  // Exclude current user from results
  if (filter?.excludeUserId) {
    where.NOT = { id: filter.excludeUserId };
  }

  // Default to showing only verified accounts unless allUsers is true
  if (!filter?.allUsers) {
    where.verifiedAccount = true;
  }

  // Apply search filter
  if (filter?.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { email: { contains: filter.search, mode: "insensitive" } },
      { username: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  if (filter?.role) {
    where.role = filter.role;
  }

  if (filter?.department) {
    where.department = filter.department;
  }

  if (filter?.isActive !== undefined) {
    where.isActive = filter.isActive;
  }

  if (filter?.verifiedAccount !== undefined) {
    where.verifiedAccount = filter.verifiedAccount;
  }

  // When allUsers is true or search is provided, return all users without pagination
  const shouldPaginate = !filter?.allUsers;

  const users = await prisma.user.findMany({
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
  });

  return users as unknown as User[];
}

/**
 * Get User By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { type User } from "@/domain/entities/user.entity";
import prisma from "@/presentation/lib/prisma";

/**
 * Get a single user by ID
 */
export async function getUser(id: string) {
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

  return user as unknown as User;
}

/**
 * Verify User Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Verify a single user
 */
export async function verifyUser(id: string) {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Verify user account
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      verifiedAccount: true,
    },
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
      updatedAt: true,
    },
  });

  return updatedUser;
}

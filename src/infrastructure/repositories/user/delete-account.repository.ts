/**
 * Delete Account Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Delete user account (self-deletion)
 */
export async function deleteAccount(userId: string) {
  // Find the user to delete
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Delete the user
  await prisma.user.delete({
    where: { id: userId },
  });
}

/**
 * Bulk Verify Users Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Bulk verify users
 */
export async function bulkVerifyUsers(userIds: string[]) {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("userIds array is required");
  }

  // Verify all users
  const result = await prisma.user.updateMany({
    where: {
      id: { in: userIds },
    },
    data: { verifiedAccount: true },
  });

  return result;
}

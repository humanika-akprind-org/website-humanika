/**
 * Bulk Send Verification Emails Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get users for bulk verification email sending
 */
export async function bulkSendVerificationEmails(
  userIds: string[],
  _batchSize: number = 10,
) {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("userIds array is required");
  }

  // Check if all users exist
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
    select: { id: true, email: true, name: true },
  });

  if (users.length !== userIds.length) {
    throw new Error("Some users not found");
  }

  // For now, just return the users - email sending logic would be handled separately
  // This maintains the same interface as the original route
  return {
    count: users.length,
    users: users.map((u) => ({ id: u.id, email: u.email })),
  };
}

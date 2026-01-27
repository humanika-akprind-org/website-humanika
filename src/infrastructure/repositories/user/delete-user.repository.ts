/**
 * Delete User Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  // Check if user exists
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
    userId: "system", // Since this is user deletion, no authenticated user context
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

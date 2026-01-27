/**
 * Delete Structure Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete an organizational structure
 */
export async function deleteStructure(id: string, user: UserWithId) {
  // Check if structure exists
  const existingStructure = await prisma.organizationalStructure.findUnique({
    where: { id },
  });

  if (!existingStructure) {
    throw new Error("Organizational structure not found");
  }

  await prisma.organizationalStructure.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "OrganizationalStructure",
    entityId: id,
    description: `Deleted organizational structure: ${existingStructure.name}`,
    metadata: {
      oldData: {
        name: existingStructure.name,
        periodId: existingStructure.periodId,
        decree: existingStructure.decree,
        structure: existingStructure.structure,
        status: existingStructure.status,
      },
      newData: null,
    },
  });
}

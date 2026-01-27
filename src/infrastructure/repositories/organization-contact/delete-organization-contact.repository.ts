/**
 * Delete Organization Contact Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete an organization contact
 */
export async function deleteOrganizationContact(id: string, user: UserWithId) {
  // Check if organization contact exists
  const existingOrganizationContact =
    await prisma.organizationContact.findUnique({
      where: { id },
      include: { period: true },
    });

  if (!existingOrganizationContact) {
    throw new Error("Organization contact not found");
  }

  await prisma.organizationContact.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "OrganizationContact",
    entityId: id,
    description: `Deleted organization contact for period ${existingOrganizationContact.period.name}`,
    metadata: {
      oldData: {
        vision: existingOrganizationContact.vision,
        mission: existingOrganizationContact.mission,
        email: existingOrganizationContact.email,
        address: existingOrganizationContact.address,
        periodId: existingOrganizationContact.periodId,
      },
      newData: null,
    },
  });
}

/**
 * Update Organization Contact Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UpdateOrganizationContactInput } from "@/domain/entities/organization-contact.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing organization contact
 */
export async function updateOrganizationContact(
  id: string,
  data: UpdateOrganizationContactInput,
  user: UserWithId,
) {
  // Get existing organization contact
  const existingOrganizationContact =
    await prisma.organizationContact.findUnique({
      where: { id },
      include: { period: true },
    });

  if (!existingOrganizationContact) {
    throw new Error("Organization contact not found");
  }

  const organizationContact = await prisma.organizationContact.update({
    where: { id },
    data: {
      vision: data.vision,
      mission: data.mission,
      phone: data.phone,
      email: data.email,
      address: data.address,
      periodId: data.periodId,
    },
    include: {
      period: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "OrganizationContact",
    entityId: organizationContact.id,
    description: `Updated organization contact for period ${organizationContact.period.name}`,
    metadata: {
      oldData: {
        vision: existingOrganizationContact.vision,
        mission: existingOrganizationContact.mission,
        email: existingOrganizationContact.email,
        address: existingOrganizationContact.address,
        periodId: existingOrganizationContact.periodId,
      },
      newData: {
        vision: organizationContact.vision,
        mission: organizationContact.mission,
        email: organizationContact.email,
        address: organizationContact.address,
        periodId: organizationContact.periodId,
      },
    },
  });

  return organizationContact;
}

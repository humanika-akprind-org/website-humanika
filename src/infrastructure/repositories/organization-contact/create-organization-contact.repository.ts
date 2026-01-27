/**
 * Create Organization Contact Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { CreateOrganizationContactInput } from "@/domain/entities/organization-contact.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Create a new organization contact
 */
export async function createOrganizationContact(
  data: CreateOrganizationContactInput,
  user: UserWithId,
) {
  const organizationContact = await prisma.organizationContact.create({
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
    activityType: ActivityType.CREATE,
    entityType: "OrganizationContact",
    entityId: organizationContact.id,
    description: `Created organization contact for period ${organizationContact.period.name}`,
    metadata: {
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

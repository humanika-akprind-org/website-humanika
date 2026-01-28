/**
 * Update Structure Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type {
  UpdateOrganizationalStructureInput,
  OrganizationalStructure,
} from "@/domain/entities/organizational-structure.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing organizational structure
 */
export async function updateStructure(
  id: string,
  data: UpdateOrganizationalStructureInput,
  user: UserWithId,
) {
  // Check if structure exists
  const existingStructure = await prisma.organizationalStructure.findUnique({
    where: { id },
  });

  if (!existingStructure) {
    throw new Error("Organizational structure not found");
  }

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.periodId !== undefined) updateData.periodId = data.periodId;
  if (data.decree !== undefined) updateData.decree = data.decree;
  if (data.structure !== undefined) updateData.structure = data.structure;
  if (data.status !== undefined) updateData.status = data.status;

  const structure = await prisma.organizationalStructure.update({
    where: { id },
    data: updateData,
    include: {
      period: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "OrganizationalStructure",
    entityId: structure.id,
    description: `Updated organizational structure: ${structure.name}`,
    metadata: {
      oldData: {
        name: existingStructure.name,
        periodId: existingStructure.periodId,
        decree: existingStructure.decree,
        structure: existingStructure.structure,
        status: existingStructure.status,
      },
      newData: {
        name: structure.name,
        periodId: structure.periodId,
        decree: structure.decree,
        structure: structure.structure,
        status: structure.status,
      },
    },
  });

  return structure as OrganizationalStructure;
}

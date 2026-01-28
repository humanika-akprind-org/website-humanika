/**
 * Create Structure Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type {
  CreateOrganizationalStructureInput,
  OrganizationalStructure,
} from "@/domain/entities/organizational-structure.entity";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Create a new organizational structure
 */
export async function createStructure(
  data: CreateOrganizationalStructureInput,
  user: UserWithId,
) {
  if (!data.name || !data.periodId) {
    throw new Error("Missing required fields");
  }

  const structureData: Prisma.OrganizationalStructureCreateInput = {
    name: data.name,
    period: { connect: { id: data.periodId } },
    status: (data.status as PrismaStatus) || "PENDING",
    decree: data.decree,
    ...(data.structure !== undefined && { structure: data.structure }),
  };

  const structure = await prisma.organizationalStructure.create({
    data: structureData,
    include: {
      period: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "OrganizationalStructure",
    entityId: structure.id,
    description: `Created organizational structure: ${structure.name}`,
    metadata: {
      newData: {
        name: structure.name,
        periodId: structure.periodId,
        decree: structure.decree,
        structure: structure.structure,
      },
    },
  });

  return structure as OrganizationalStructure;
}

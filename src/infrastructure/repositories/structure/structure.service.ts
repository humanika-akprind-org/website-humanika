import prisma from "@/lib/prisma";
import type {
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
  OrganizationalStructure,
} from "@/types/structure";
import type { Status } from "@/types/enums";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";

type UserWithId = { id: string };

export const getStructures = async (filters: {
  status?: Status;
  periodId?: string;
  search?: string;
}): Promise<OrganizationalStructure[]> => {
  const where: Prisma.OrganizationalStructureWhereInput = {};

  if (filters.status) {
    where.status = { equals: filters.status as PrismaStatus };
  }
  if (filters.periodId) where.periodId = filters.periodId;
  if (filters.search) {
    where.OR = [{ name: { contains: filters.search, mode: "insensitive" } }];
  }

  const structures = await prisma.organizationalStructure.findMany({
    where,
    include: {
      period: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return structures as OrganizationalStructure[];
};

export const getStructure = async (
  id: string
): Promise<OrganizationalStructure> => {
  const structure = await prisma.organizationalStructure.findUnique({
    where: { id },
    include: {
      period: true,
    },
  });

  if (!structure) {
    throw new Error("Organizational structure not found");
  }

  return structure as OrganizationalStructure;
};

export const createStructure = async (
  data: CreateOrganizationalStructureInput,
  user: UserWithId
): Promise<OrganizationalStructure> => {
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
};

export const updateStructure = async (
  id: string,
  data: UpdateOrganizationalStructureInput,
  user: UserWithId
): Promise<OrganizationalStructure> => {
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
};

export const deleteStructure = async (
  id: string,
  user: UserWithId
): Promise<void> => {
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
};

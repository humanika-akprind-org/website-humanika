import prisma from "@/lib/prisma";
import type {
  CreateOrganizationContactInput,
  UpdateOrganizationContactInput,
  OrganizationContactFilter,
} from "@/types/organization-contact";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export const getOrganizationContacts = async (
  filter?: OrganizationContactFilter
) => {
  const where: any = {};

  if (filter?.periodId) {
    where.periodId = filter.periodId;
  }

  return prisma.organizationContact.findMany({
    where,
    include: {
      period: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrganizationContact = async (id: string) =>
  prisma.organizationContact.findUnique({
    where: { id },
    include: {
      period: true,
    },
  });

export const getOrganizationContactByPeriod = async (periodId: string) =>
  prisma.organizationContact.findFirst({
    where: { periodId },
    include: {
      period: true,
    },
  });

export const getActivePeriodOrganizationContact = async () =>
  prisma.organizationContact.findFirst({
    where: {
      period: {
        isActive: true,
      },
    },
    include: {
      period: true,
    },
  });

export const createOrganizationContact = async (
  data: CreateOrganizationContactInput,
  user: UserWithId
) => {
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
};

export const updateOrganizationContact = async (
  id: string,
  data: UpdateOrganizationContactInput,
  user: UserWithId
) => {
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
};

export const deleteOrganizationContact = async (
  id: string,
  user: UserWithId
) => {
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
};

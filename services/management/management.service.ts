import { prisma } from "@/lib/prisma";
import type { Management, ManagementServerData } from "@/types/management";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

// Folder ID khusus untuk foto management (bisa disimpan di environment variables)
// const MANAGEMENT_PHOTOS_FOLDER_ID =
//   process.env.MANAGEMENT_PHOTOS_FOLDER_ID || "root";

export const ManagementService = {
  async getManagements(): Promise<Management[]> {
    const managements = await prisma.management.findMany({
      include: {
        user: true,
        period: true,
      },
      orderBy: {
        department: "asc",
      },
    });

    return managements as Management[];
  },

  async getManagement(id: string): Promise<Management> {
    const management = await prisma.management.findUnique({
      where: { id },
      include: {
        user: true,
        period: true,
      },
    });

    if (!management) {
      throw new Error("Management not found");
    }

    return management as Management;
  },

  async createManagement(
    formData: ManagementServerData,
    user: UserWithId
  ): Promise<Management> {
    const { userId, periodId, position, department, photo } = formData;

    // Check if user already has a management position in this period
    const existingManagement = await prisma.management.findFirst({
      where: {
        userId,
        periodId,
      },
    });

    if (existingManagement) {
      throw new Error("User already has a management position in this period");
    }

    // Check if position in department is already taken
    const existingPosition = await prisma.management.findFirst({
      where: {
        periodId,
        position,
        department,
      },
    });

    if (existingPosition) {
      throw new Error(
        "This position in the department is already taken for this period"
      );
    }

    const management = await prisma.management.create({
      data: {
        userId,
        periodId,
        position,
        department,
        photo,
      },
      include: {
        user: true,
        period: true,
      },
    });

    // Log activity
    await logActivity({
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "Management",
      entityId: management.id,
      description: `Created management: ${management.user?.name || "Unknown"}`,
      metadata: {
        newData: {
          userId: management.userId,
          position: management.position,
          periodId: management.periodId,
          photo: management.photo,
        },
      },
    });

    return management as Management;
  },

  async updateManagement(
    id: string,
    formData: ManagementServerData,
    user: UserWithId
  ): Promise<Management> {
    // Check if management exists
    const existingManagement = await prisma.management.findUnique({
      where: { id },
    });

    if (!existingManagement) {
      throw new Error("Management not found");
    }

    const { userId, periodId, position, department, photo } = formData;

    // Check for conflicts (excluding current management)
    const existingUserManagement = await prisma.management.findFirst({
      where: {
        userId,
        periodId,
        NOT: { id },
      },
    });

    if (existingUserManagement) {
      throw new Error("User already has a management position in this period");
    }

    const existingPositionManagement = await prisma.management.findFirst({
      where: {
        periodId,
        position,
        department,
        NOT: { id },
      },
    });

    if (existingPositionManagement) {
      throw new Error(
        "This position in the department is already taken for this period"
      );
    }

    const management = await prisma.management.update({
      where: { id },
      data: {
        userId,
        periodId,
        position,
        department,
        photo,
      },
      include: {
        user: true,
        period: true,
      },
    });

    // Log activity
    await logActivity({
      userId: user.id,
      activityType: ActivityType.UPDATE,
      entityType: "Management",
      entityId: management.id,
      description: `Updated management: ${management.user?.name || "Unknown"}`,
      metadata: {
        oldData: {
          userId: existingManagement.userId,
          position: existingManagement.position,
          periodId: existingManagement.periodId,
          photo: existingManagement.photo,
        },
        newData: {
          userId: management.userId,
          position: management.position,
          periodId: management.periodId,
          photo: management.photo,
        },
      },
    });

    return management as Management;
  },

  async updateManagementPhoto(
    id: string,
    photoUrl: string
  ): Promise<Management> {
    const management = await prisma.management.update({
      where: { id },
      data: { photo: photoUrl },
      include: {
        user: true,
        period: true,
      },
    });

    return management as Management;
  },

  async deleteManagement(id: string, user: UserWithId): Promise<void> {
    // Check if management exists
    const existingManagement = await prisma.management.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingManagement) {
      throw new Error("Management not found");
    }

    await prisma.management.delete({
      where: { id },
    });

    // Log activity
    await logActivity({
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "Management",
      entityId: id,
      description: `Deleted management: ${
        existingManagement.user?.name || "Unknown"
      }`,
      metadata: {
        oldData: {
          userId: existingManagement.userId,
          position: existingManagement.position,
          periodId: existingManagement.periodId,
          photo: existingManagement.photo,
        },
        newData: null,
      },
    });
  },
};

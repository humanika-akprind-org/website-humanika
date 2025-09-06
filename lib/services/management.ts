import { prisma } from "@/lib/prisma";
import type { Management, ManagementServerData } from "@/types/management";
// import { UserApi } from "@/lib/api/user";
// import { PeriodApi } from "@/lib/api/period";

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

  async createManagement(formData: ManagementServerData): Promise<Management> {
    const {
      userId,
      periodId,
      position,
      department,
      photo,
    } = formData;

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

    return management as Management;
  },

  async updateManagement(
    id: string,
    formData: ManagementServerData
  ): Promise<Management> {
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

  async deleteManagement(id: string): Promise<void> {
    await prisma.management.delete({
      where: { id },
    });
  },
};

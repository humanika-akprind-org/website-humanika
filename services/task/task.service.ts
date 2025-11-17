import prisma from "@/lib/prisma";
import type {
  CreateDepartmentTaskInput,
  UpdateDepartmentTaskInput,
} from "@/types/task";
import type { Department, Status } from "@/types/enums";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export const getDepartmentTasks = async (filter: {
  department?: Department;
  status?: Status;
  userId?: string;
  search?: string;
}) => {
  const where: Prisma.DepartmentTaskWhereInput = {};

  if (filter.department) where.department = filter.department;
  if (filter.status) {
    where.status = filter.status;
  }
  if (filter.userId) where.userId = filter.userId;
  if (filter.search) {
    where.OR = [{ note: { contains: filter.search, mode: "insensitive" } }];
  }

  const departmentTasks = await prisma.departmentTask.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return departmentTasks;
};

export const getDepartmentTask = async (id: string) => {
  const departmentTask = await prisma.departmentTask.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!departmentTask) {
    throw new Error("Department task not found");
  }

  return departmentTask;
};

export const createDepartmentTask = async (
  data: CreateDepartmentTaskInput,
  user: UserWithId
) => {
  const departmentTaskData: Prisma.DepartmentTaskCreateInput = {
    note: data.note,
    department: data.department,
    ...(data.userId && { user: { connect: { id: data.userId } } }),
    status: data.status || "PENDING",
  };

  const departmentTask = await prisma.departmentTask.create({
    data: departmentTaskData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "DepartmentTask",
    entityId: departmentTask.id,
    description: `Created department task: ${departmentTask.note}`,
    metadata: {
      newData: {
        note: departmentTask.note,
        department: departmentTask.department,
        userId: departmentTask.userId,
        status: departmentTask.status,
      },
    },
  });

  return departmentTask;
};

export const updateDepartmentTask = async (
  id: string,
  data: UpdateDepartmentTaskInput,
  user: UserWithId
) => {
  // Get existing task for logging
  const existingTask = await prisma.departmentTask.findUnique({
    where: { id },
  });

  if (!existingTask) {
    throw new Error("Department task not found");
  }

  const departmentTaskData: Prisma.DepartmentTaskUncheckedUpdateInput = {};
  if (data.note !== undefined) departmentTaskData.note = data.note;
  if (data.department !== undefined) {
    departmentTaskData.department = data.department;
  }
  if (data.userId !== undefined) departmentTaskData.userId = data.userId;
  if (data.status !== undefined) departmentTaskData.status = data.status;

  const departmentTask = await prisma.departmentTask.update({
    where: { id },
    data: departmentTaskData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "DepartmentTask",
    entityId: departmentTask.id,
    description: `Updated department task: ${departmentTask.note}`,
    metadata: {
      oldData: {
        note: existingTask.note,
        department: existingTask.department,
        userId: existingTask.userId,
        status: existingTask.status,
      },
      newData: {
        note: departmentTask.note,
        department: departmentTask.department,
        userId: departmentTask.userId,
        status: departmentTask.status,
      },
    },
  });

  return departmentTask;
};

export const deleteDepartmentTask = async (id: string, user: UserWithId) => {
  // Check if task exists
  const departmentTask = await prisma.departmentTask.findUnique({
    where: { id },
  });

  if (!departmentTask) {
    throw new Error("Department task not found");
  }

  await prisma.departmentTask.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "DepartmentTask",
    entityId: id,
    description: `Deleted department task: ${departmentTask.note}`,
    metadata: {
      oldData: {
        note: departmentTask.note,
        department: departmentTask.department,
        userId: departmentTask.userId,
        status: departmentTask.status,
      },
      newData: null,
    },
  });
};

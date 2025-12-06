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
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { subtitle: { contains: filter.search, mode: "insensitive" } },
      { note: { contains: filter.search, mode: "insensitive" } },
    ];
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
      workProgram: {
        select: {
          id: true,
          name: true,
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
      workProgram: {
        select: {
          id: true,
          name: true,
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
    title: data.title,
    subtitle: data.subtitle,
    note: data.note,
    department: data.department,
    ...(data.userId && { user: { connect: { id: data.userId } } }),
    ...(data.workProgramId && {
      workProgram: { connect: { id: data.workProgramId } },
    }),
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
      workProgram: {
        select: {
          id: true,
          name: true,
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
    description: `Created department task: ${departmentTask.title}`,
    metadata: {
      newData: {
        title: departmentTask.title,
        subtitle: departmentTask.subtitle,
        note: departmentTask.note,
        department: departmentTask.department,
        userId: departmentTask.userId,
        workProgramId: departmentTask.workProgramId,
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
  if (data.title !== undefined) departmentTaskData.title = data.title;
  if (data.subtitle !== undefined) departmentTaskData.subtitle = data.subtitle;
  if (data.note !== undefined) departmentTaskData.note = data.note;
  if (data.department !== undefined) {
    departmentTaskData.department = data.department;
  }
  if (data.userId !== undefined) departmentTaskData.userId = data.userId;
  if (data.workProgramId !== undefined) {
    departmentTaskData.workProgramId = data.workProgramId;
  }
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
      workProgram: {
        select: {
          id: true,
          name: true,
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
    description: `Updated department task: ${departmentTask.title}`,
    metadata: {
      oldData: {
        title: existingTask.title,
        subtitle: existingTask.subtitle,
        note: existingTask.note,
        department: existingTask.department,
        userId: existingTask.userId,
        workProgramId: existingTask.workProgramId,
        status: existingTask.status,
      },
      newData: {
        title: departmentTask.title,
        subtitle: departmentTask.subtitle,
        note: departmentTask.note,
        department: departmentTask.department,
        userId: departmentTask.userId,
        workProgramId: departmentTask.workProgramId,
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
    description: `Deleted department task: ${departmentTask.title}`,
    metadata: {
      oldData: {
        title: departmentTask.title,
        subtitle: departmentTask.subtitle,
        note: departmentTask.note,
        department: departmentTask.department,
        userId: departmentTask.userId,
        workProgramId: departmentTask.workProgramId,
        status: departmentTask.status,
      },
      newData: null,
    },
  });
};

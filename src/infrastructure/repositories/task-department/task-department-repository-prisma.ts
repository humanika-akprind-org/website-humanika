/**
 * Task Department Repository Prisma - Class-based repository implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the TaskDepartmentRepositoryPrisma class that implements
 * ITaskDepartmentRepository interface for use with the use case pattern.
 */

import prisma from "@/presentation/lib/prisma";
import type { ITaskDepartmentRepository } from "@/application/interface/task-department.repository.interface";
import type {
  CreateDepartmentTaskInput,
  DepartmentTask,
  DepartmentTaskFilter,
} from "@/domain/entities/task-department.entity";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

export class TaskDepartmentRepositoryPrisma implements ITaskDepartmentRepository {
  private prisma = prisma;

  /**
   * Get all department tasks with optional filters
   */
  async getDepartmentTasks(
    filter?: DepartmentTaskFilter,
  ): Promise<DepartmentTask[]> {
    const where: Prisma.DepartmentTaskWhereInput = {};

    if (filter?.department) where.department = filter.department;
    if (filter?.status) {
      where.status = filter.status;
    }
    if (filter?.userId) where.userId = filter.userId;
    if (filter?.search) {
      where.OR = [
        { title: { contains: filter.search, mode: "insensitive" } },
        { subtitle: { contains: filter.search, mode: "insensitive" } },
        { note: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const departmentTasks = await this.prisma.departmentTask.findMany({
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

    return departmentTasks as unknown as DepartmentTask[];
  }

  /**
   * Get a single department task by ID
   */
  async getDepartmentTaskById(id: string): Promise<DepartmentTask | null> {
    const departmentTask = await this.prisma.departmentTask.findUnique({
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

    return departmentTask as unknown as DepartmentTask | null;
  }

  /**
   * Create a new department task
   */
  async createDepartmentTask(
    data: CreateDepartmentTaskInput,
    user: { id: string },
  ): Promise<DepartmentTask> {
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

    const departmentTask = await this.prisma.departmentTask.create({
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

    return departmentTask as unknown as DepartmentTask;
  }

  /**
   * Update an existing department task
   */
  async updateDepartmentTask(
    id: string,
    data: Partial<CreateDepartmentTaskInput>,
    user: { id: string },
  ): Promise<DepartmentTask> {
    // Get existing task for logging
    const existingTask = await this.prisma.departmentTask.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    const updateData: Prisma.DepartmentTaskUpdateInput = {
      title: data.title,
      subtitle: data.subtitle,
      note: data.note,
      department: data.department,
      status: data.status,
    };

    if (data.userId) {
      updateData.user = { connect: { id: data.userId } };
    }

    if (data.workProgramId) {
      updateData.workProgram = { connect: { id: data.workProgramId } };
    }

    const departmentTask = await this.prisma.departmentTask.update({
      where: { id },
      data: updateData,
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
      entityId: id,
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

    return departmentTask as unknown as DepartmentTask;
  }

  /**
   * Delete a department task
   */
  async deleteDepartmentTask(id: string, user: { id: string }): Promise<void> {
    // Get existing task for logging
    const existingTask = await this.prisma.departmentTask.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new Error("Department task not found");
    }

    await this.prisma.departmentTask.delete({
      where: { id },
    });

    // Log activity
    await logActivity({
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "DepartmentTask",
      entityId: id,
      description: `Deleted department task: ${existingTask.title}`,
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
        newData: null,
      },
    });
  }
}

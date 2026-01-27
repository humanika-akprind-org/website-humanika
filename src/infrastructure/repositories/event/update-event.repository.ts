/**
 * Update Event Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UpdateEventInput } from "@/domain/entities/event.entity";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing event
 */
export const updateEvent = async (
  id: string,
  data: UpdateEventInput,
  user: UserWithId,
) => {
  const existingEvent = await prisma.event.findUnique({
    where: { id },
    include: { approvals: true },
  });

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  const updateData: Prisma.EventUpdateInput = {
    name: data.name,
    slug: data.name
      ? data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : undefined,
    thumbnail: data.thumbnail,
    description: data.description,
    goal: data.goal,
    department: data.department,
    schedules: data.schedules as unknown as Prisma.InputJsonValue | undefined,
    period: data.periodId ? { connect: { id: data.periodId } } : undefined,
    responsible: data.responsibleId
      ? { connect: { id: data.responsibleId } }
      : undefined,
    workProgram: data.workProgramId
      ? { connect: { id: data.workProgramId } }
      : undefined,
    category: data.categoryId
      ? { connect: { id: data.categoryId } }
      : undefined,
    status: data.status,
  };

  const hasChanges =
    (data.name !== undefined && data.name !== existingEvent.name) ||
    (data.thumbnail !== undefined &&
      data.thumbnail !== existingEvent.thumbnail) ||
    (data.description !== undefined &&
      data.description !== existingEvent.description) ||
    (data.goal !== undefined && data.goal !== existingEvent.goal) ||
    (data.department !== undefined &&
      data.department !== existingEvent.department) ||
    (data.responsibleId !== undefined &&
      data.responsibleId !== existingEvent.responsibleId) ||
    (data.workProgramId !== undefined &&
      data.workProgramId !== existingEvent.workProgramId) ||
    (data.categoryId !== undefined &&
      data.categoryId !== existingEvent.categoryId) ||
    (data.schedules !== undefined &&
      JSON.stringify(data.schedules) !==
        JSON.stringify(existingEvent.schedules));

  if (
    hasChanges &&
    existingEvent.approvals &&
    existingEvent.approvals.length > 0 &&
    (existingEvent.approvals[0].status === "APPROVED" ||
      existingEvent.approvals[0].status === "REJECTED")
  ) {
    await prisma.approval.update({
      where: { id: existingEvent.approvals[0].id },
      data: {
        status: "PENDING",
        note: "Event updated and resubmitted for approval",
      },
    });
    updateData.status = "PENDING";
  }

  if (data.status === "PENDING") {
    await prisma.approval.create({
      data: {
        entityType: "EVENT",
        entityId: id,
        userId: user.id,
        status: "PENDING",
        note: "Event submitted for approval",
      },
    });
  }

  const event = await prisma.event.update({
    where: { id },
    data: updateData,
    include: {
      period: true,
      responsible: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
        },
      },
      workProgram: {
        select: {
          id: true,
          name: true,
        },
      },
      category: true,
      approvals: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      galleries: true,
      letters: true,
    },
  });

  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Event",
    entityId: event.id,
    description: `Updated event: ${event.name}`,
    metadata: {
      oldData: {
        name: existingEvent.name,
        thumbnail: existingEvent.thumbnail,
        department: existingEvent.department,
        status: existingEvent.status,
        schedules: existingEvent.schedules,
      },
      newData: {
        name: event.name,
        thumbnail: event.thumbnail,
        department: event.department,
        status: event.status,
        schedules: event.schedules,
      },
    },
  });

  return event;
};

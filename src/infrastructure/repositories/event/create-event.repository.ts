/**
 * Create Event Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { CreateEventInput } from "@/domain/entities/event.entity";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Create a new event
 */
export const createEvent = async (data: CreateEventInput, user: UserWithId) => {
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const schedules = Array.isArray(data.schedules) ? data.schedules : [];

  const eventData: Prisma.EventCreateInput = {
    name: data.name,
    slug,
    thumbnail: data.thumbnail,
    description: data.description || "",
    goal: data.goal || "",
    department: data.department,
    schedules: schedules as unknown as Prisma.InputJsonValue,
    period: { connect: { id: data.periodId } },
    responsible: { connect: { id: data.responsibleId } },
  };

  if (data.workProgramId && data.workProgramId.trim() !== "") {
    eventData.workProgram = { connect: { id: data.workProgramId } };
  }

  if (data.categoryId && data.categoryId.trim() !== "") {
    eventData.category = { connect: { id: data.categoryId } };
  }

  const event = await prisma.event.create({
    data: eventData,
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

  // Create approval record
  await prisma.approval.create({
    data: {
      entityType: "EVENT",
      entityId: event.id,
      userId: user.id,
      status: "PENDING",
      note: "Event created and pending approval",
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "Event",
    entityId: event.id,
    description: `Created event: ${event.name}`,
    metadata: {
      newData: {
        name: event.name,
        department: event.department,
        periodId: event.periodId,
        responsibleId: event.responsibleId,
        schedules: event.schedules,
      },
    },
  });

  return event;
};

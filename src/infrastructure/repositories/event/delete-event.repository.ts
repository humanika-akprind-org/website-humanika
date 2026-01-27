/**
 * Delete Event Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete an event
 */
export const deleteEvent = async (id: string, user: UserWithId) => {
  const existingEvent = await prisma.event.findUnique({
    where: { id },
  });

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  await prisma.event.delete({
    where: { id },
  });

  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Event",
    entityId: id,
    description: `Deleted event: ${existingEvent.name}`,
    metadata: {
      oldData: {
        name: existingEvent.name,
        department: existingEvent.department,
        status: existingEvent.status,
        schedules: existingEvent.schedules,
      },
      newData: null,
    },
  });
};

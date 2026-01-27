/**
 * Delete Letter Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete a letter
 */
export async function deleteLetter(
  id: string,
  user: UserWithId,
): Promise<void> {
  // Check if letter exists
  const existingLetter = await prisma.letter.findUnique({
    where: { id },
  });

  if (!existingLetter) {
    throw new Error("Letter not found");
  }

  await prisma.letter.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Letter",
    entityId: id,
    description: `Deleted letter: ${existingLetter.regarding}`,
    metadata: {
      oldData: {
        regarding: existingLetter.regarding,
        number: existingLetter.number,
        origin: existingLetter.origin,
        destination: existingLetter.destination,
        type: existingLetter.type,
        priority: existingLetter.priority,
        status: existingLetter.status,
        periodId: existingLetter.periodId,
        eventId: existingLetter.eventId,
      },
      newData: null,
    },
  });
}

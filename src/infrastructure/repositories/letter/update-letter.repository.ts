/**
 * Update Letter Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UpdateLetterInput } from "@/domain/entities/letter.entity";
import { Status } from "@/domain/enums";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";
import type { LetterWithRelations } from "./get-letters.repository";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing letter
 */
export async function updateLetter(
  id: string,
  data: UpdateLetterInput,
  user: UserWithId,
): Promise<LetterWithRelations> {
  // Check if letter exists with approval
  const existingLetter = await prisma.letter.findUnique({
    where: { id },
    include: { approvals: true },
  });

  if (!existingLetter) {
    throw new Error("Letter not found");
  }

  // Check if there are changes to the letter (excluding status)
  const hasChanges =
    (data.number !== undefined && data.number !== existingLetter.number) ||
    (data.regarding !== undefined &&
      data.regarding !== existingLetter.regarding) ||
    (data.origin !== undefined && data.origin !== existingLetter.origin) ||
    (data.destination !== undefined &&
      data.destination !== existingLetter.destination) ||
    (data.date !== undefined &&
      new Date(data.date).getTime() !== existingLetter.date.getTime()) ||
    (data.type !== undefined && data.type !== existingLetter.type) ||
    (data.priority !== undefined &&
      data.priority !== existingLetter.priority) ||
    (data.body !== undefined && data.body !== existingLetter.body) ||
    (data.letter !== undefined && data.letter !== existingLetter.letter) ||
    (data.notes !== undefined && data.notes !== existingLetter.notes) ||
    (data.approvedById !== undefined &&
      data.approvedById !== existingLetter.approvedById) ||
    (data.periodId !== undefined &&
      data.periodId !== existingLetter.periodId) ||
    (data.eventId !== undefined && data.eventId !== existingLetter.eventId);

  // If there are changes and the letter has an existing approval that is APPROVED or REJECTED,
  // reset the approval to PENDING
  if (hasChanges) {
    const existingApproval = existingLetter.approvals.find(
      (approval) =>
        approval.status === "APPROVED" || approval.status === "REJECTED",
    );

    if (existingApproval) {
      await prisma.approval.update({
        where: { id: existingApproval.id },
        data: {
          status: "PENDING",
          note: "Letter updated and resubmitted for approval",
        },
      });
      // Also update the letter status to PENDING
      data.status = Status.PENDING;
    }
  }

  const updateData: Prisma.LetterUpdateInput = {};

  if (data.number !== undefined) updateData.number = data.number;
  if (data.classification !== undefined) {
    updateData.classification = data.classification;
  }
  if (data.regarding !== undefined) updateData.regarding = data.regarding;
  if (data.origin !== undefined) updateData.origin = data.origin;
  if (data.destination !== undefined) updateData.destination = data.destination;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.type !== undefined) updateData.type = data.type;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.body !== undefined) updateData.body = data.body;
  if (data.letter !== undefined) updateData.letter = data.letter;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.approvedById !== undefined) {
    updateData.approvedBy = data.approvedById
      ? { connect: { id: data.approvedById } }
      : { disconnect: true };
  }
  if (data.periodId !== undefined) {
    updateData.period = data.periodId
      ? { connect: { id: data.periodId } }
      : { disconnect: true };
  }
  if (data.eventId !== undefined) {
    updateData.event = data.eventId
      ? { connect: { id: data.eventId } }
      : { disconnect: true };
  }
  if (data.status !== undefined) updateData.status = data.status;

  // Handle status change to PENDING - create approval record
  if (data.status === "PENDING") {
    // Check if approval already exists for this letter
    const existingApproval = await prisma.approval.findFirst({
      where: {
        entityType: "LETTER",
        entityId: id,
      },
    });

    if (!existingApproval) {
      // Create approval record for the letter if it doesn't exist
      await prisma.approval.create({
        data: {
          entityType: "LETTER",
          entityId: id,
          userId: user.id,
          status: "PENDING",
          note: "Letter submitted for approval",
        },
      });
    } else {
      // Update existing approval status to PENDING
      await prisma.approval.update({
        where: { id: existingApproval.id },
        data: {
          status: "PENDING",
        },
      });
    }
  }

  const letter = await prisma.letter.update({
    where: { id },
    data: updateData,
    include: {
      period: true,
      event: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      approvedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      attachments: {
        select: {
          id: true,
          name: true,
          document: true,
        },
      },
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
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Letter",
    entityId: letter.id,
    description: `Updated letter: ${letter.regarding}`,
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
      newData: {
        regarding: letter.regarding,
        number: letter.number,
        origin: letter.origin,
        destination: letter.destination,
        type: letter.type,
        priority: letter.priority,
        status: letter.status,
        periodId: letter.periodId,
        eventId: letter.eventId,
      },
    },
  });

  return letter;
}

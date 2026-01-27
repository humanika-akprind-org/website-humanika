/**
 * Create Letter Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { CreateLetterInput } from "@/domain/entities/letter.entity";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";
import type { LetterWithRelations } from "./get-letters.repository";

type UserWithId = Pick<User, "id">;

/**
 * Create a new letter
 */
export async function createLetter(
  data: CreateLetterInput,
  user: UserWithId,
): Promise<LetterWithRelations> {
  const letterData: Prisma.LetterCreateInput = {
    regarding: data.regarding,
    origin: data.origin,
    destination: data.destination,
    date: new Date(data.date),
    type: data.type,
    priority: data.priority,
    status: (data.status as unknown as PrismaStatus) || "DRAFT",
    body: data.body || null,
    letter: data.letter || null,
    notes: data.notes || null,
    createdBy: { connect: { id: user.id } },
  };

  // Optional fields
  if (data.number) letterData.number = data.number;
  if (data.classification) letterData.classification = data.classification;
  if (data.periodId) letterData.period = { connect: { id: data.periodId } };
  if (data.eventId) letterData.event = { connect: { id: data.eventId } };

  const letter = await prisma.letter.create({
    data: letterData,
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

  // Create initial approval request for the letter if status is PENDING
  if (data.status === "PENDING") {
    await prisma.approval.create({
      data: {
        entityType: "LETTER",
        entityId: letter.id,
        userId: user.id,
        status: "PENDING",
        note: "Letter submitted for approval",
      },
    });
  }

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "Letter",
    entityId: letter.id,
    description: `Created letter: ${letter.regarding}`,
    metadata: {
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

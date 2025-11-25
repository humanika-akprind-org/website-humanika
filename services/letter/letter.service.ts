import prisma from "@/lib/prisma";
import type { CreateLetterInput, UpdateLetterInput } from "@/types/letter";
import type { LetterType, LetterPriority, Status } from "@/types/enums";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export const getLetters = async (filter: {
  type?: LetterType;
  priority?: LetterPriority;
  status?: Status;
  periodId?: string;
  eventId?: string;
  search?: string;
}) => {
  const where: Prisma.LetterWhereInput = {};

  if (filter.type) where.type = { equals: filter.type };
  if (filter.priority) where.priority = { equals: filter.priority };
  if (filter.status) {
    where.status = { equals: filter.status as unknown as PrismaStatus };
  }
  if (filter.periodId) where.periodId = filter.periodId;
  if (filter.eventId) where.eventId = filter.eventId;
  if (filter.search) {
    where.OR = [
      { regarding: { contains: filter.search, mode: "insensitive" } },
      { number: { contains: filter.search, mode: "insensitive" } },
      { origin: { contains: filter.search, mode: "insensitive" } },
      { destination: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  const letters = await prisma.letter.findMany({
    where,
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
      approval: {
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
    orderBy: { date: "desc" },
  });

  return letters;
};

export const getLetter = async (id: string) => {
  const letter = await prisma.letter.findUnique({
    where: { id },
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
      approval: {
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

  return letter;
};

export const createLetter = async (
  data: CreateLetterInput,
  user: UserWithId
) => {
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
      approval: {
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
};

export const updateLetter = async (
  id: string,
  data: UpdateLetterInput,
  user: UserWithId
) => {
  // Check if letter exists with approval
  const existingLetter = await prisma.letter.findUnique({
    where: { id },
    include: { approval: true },
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
  if (
    hasChanges &&
    existingLetter.approval &&
    (existingLetter.approval.status === "APPROVED" ||
      existingLetter.approval.status === "REJECTED")
  ) {
    await prisma.approval.update({
      where: { id: existingLetter.approval.id },
      data: {
        status: "PENDING",
        note: "Letter updated and resubmitted for approval",
      },
    });
    // Also update the letter status to PENDING
    data.status = "PENDING";
  }

  const updateData: Prisma.LetterUpdateInput = {};

  if (data.number !== undefined) updateData.number = data.number;
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
      approval: {
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
};

export const deleteLetter = async (id: string, user: UserWithId) => {
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
};

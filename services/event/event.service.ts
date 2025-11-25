import prisma from "@/lib/prisma";
import type { CreateEventInput, UpdateEventInput } from "@/types/event";
import type { Status, Department } from "@/types/enums";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export const getEvents = async (filter: {
  department?: Department;
  status?: Status;
  periodId?: string;
  workProgramId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const where: Prisma.EventWhereInput = {};

  if (filter.department) where.department = { equals: filter.department };
  if (filter.status) {
    where.status = { equals: filter.status as unknown as PrismaStatus };
  }
  if (filter.periodId) where.periodId = filter.periodId;
  if (filter.workProgramId) where.workProgramId = filter.workProgramId;
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
      { goal: { contains: filter.search, mode: "insensitive" } },
    ];
  }
  if (filter.startDate || filter.endDate) {
    where.startDate = {};
    if (filter.startDate) where.startDate.gte = new Date(filter.startDate);
    if (filter.endDate) where.startDate.lte = new Date(filter.endDate);
  }

  const events = await prisma.event.findMany({
    where,
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
      galleries: true,
      finances: true,
      letters: true,
      documents: true,
    },
    orderBy: { startDate: "desc" },
  });

  return events;
};

export const getEvent = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
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
      galleries: true,
      finances: true,
      letters: true,
      documents: true,
    },
  });

  return event;
};

export const createEvent = async (data: CreateEventInput, user: UserWithId) => {
  // Generate slug from name
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const eventData: Prisma.EventCreateInput = {
    name: data.name,
    slug,
    thumbnail: data.thumbnail,
    description: data.description || "",
    goal: data.goal || "",
    department: data.department,
    period: { connect: { id: data.periodId } },
    responsible: { connect: { id: data.responsibleId } },
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    funds:
      typeof data.funds === "string" ? parseFloat(data.funds) : data.funds || 0,
    usedFunds: 0,
    remainingFunds:
      typeof data.funds === "string" ? parseFloat(data.funds) : data.funds || 0,
  };

  // Only include workProgramId if it's provided and not empty
  if (data.workProgramId && data.workProgramId.trim() !== "") {
    eventData.workProgram = { connect: { id: data.workProgramId } };
  }

  // Only include categoryId if it's provided and not empty
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
      galleries: true,
      finances: true,
      letters: true,
      documents: true,
    },
  });

  // Always create approval record with PENDING status
  const approval = await prisma.approval.create({
    data: {
      entityType: "EVENT",
      entityId: event.id,
      userId: user.id,
      status: "PENDING",
      note: "Event created and pending approval",
    },
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

  // Update the event with the approval ID
  await prisma.event.update({
    where: { id: event.id },
    data: { approvalId: approval.id },
  });

  // Add the approval to the returned event
  event.approvalId = approval.id;
  event.approval = approval;

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
        startDate: event.startDate,
        endDate: event.endDate,
        funds: event.funds,
      },
    },
  });

  return event;
};

export const updateEvent = async (
  id: string,
  data: UpdateEventInput,
  user: UserWithId
) => {
  // Get existing event with approval
  const existingEvent = await prisma.event.findUnique({
    where: { id },
    include: { approval: true },
  });

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  const updateData = { ...data } as Prisma.EventUpdateInput;

  // Check if there are changes to the event (excluding status)
  const hasChanges =
    (data.name !== undefined && data.name !== existingEvent.name) ||
    (data.description !== undefined &&
      data.description !== existingEvent.description) ||
    (data.goal !== undefined && data.goal !== existingEvent.goal) ||
    (data.department !== undefined &&
      data.department !== existingEvent.department) ||
    (data.startDate !== undefined &&
      new Date(data.startDate).getTime() !==
        existingEvent.startDate.getTime()) ||
    (data.endDate !== undefined &&
      new Date(data.endDate).getTime() !== existingEvent.endDate.getTime()) ||
    (data.funds !== undefined && data.funds !== existingEvent.funds) ||
    (data.responsibleId !== undefined &&
      data.responsibleId !== existingEvent.responsibleId) ||
    (data.workProgramId !== undefined &&
      data.workProgramId !== existingEvent.workProgramId) ||
    (data.categoryId !== undefined &&
      data.categoryId !== existingEvent.categoryId);

  // If there are changes and the event has an existing approval that is APPROVED or REJECTED,
  // reset the approval to PENDING
  if (
    hasChanges &&
    existingEvent.approval &&
    (existingEvent.approval.status === "APPROVED" ||
      existingEvent.approval.status === "REJECTED")
  ) {
    await prisma.approval.update({
      where: { id: existingEvent.approval.id },
      data: {
        status: "PENDING",
        note: "Event updated and resubmitted for approval",
      },
    });
    // Also update the event status to PENDING
    updateData.status = "PENDING";
  }

  // Handle status change to PENDING - create approval record
  if (data.status === "PENDING") {
    // Create approval record for the event
    await prisma.approval.create({
      data: {
        entityType: "EVENT",
        entityId: id,
        userId: user.id, // Current user submitting for approval
        status: "PENDING",
        note: "Event submitted for approval",
      },
    });
  }

  // Calculate remaining funds if funds or usedFunds is updated
  if (data.funds !== undefined || data.usedFunds !== undefined) {
    const currentEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (currentEvent) {
      const funds = data.funds !== undefined ? data.funds : currentEvent.funds;
      const usedFunds =
        data.usedFunds !== undefined ? data.usedFunds : currentEvent.usedFunds;
      updateData.remainingFunds = funds - usedFunds;
    }
  }

  // Handle slug generation if name is updated
  if (data.name) {
    updateData.slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Handle date conversions
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);

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
      galleries: true,
      finances: true,
      letters: true,
      documents: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Event",
    entityId: event.id,
    description: `Updated event: ${event.name}`,
    metadata: {
      oldData: {
        name: existingEvent.name,
        department: existingEvent.department,
        status: existingEvent.status,
        startDate: existingEvent.startDate,
        endDate: existingEvent.endDate,
        funds: existingEvent.funds,
        usedFunds: existingEvent.usedFunds,
      },
      newData: {
        name: event.name,
        department: event.department,
        status: event.status,
        startDate: event.startDate,
        endDate: event.endDate,
        funds: event.funds,
        usedFunds: event.usedFunds,
      },
    },
  });

  return event;
};

export const deleteEvent = async (id: string, user: UserWithId) => {
  // Check if event exists
  const existingEvent = await prisma.event.findUnique({
    where: { id },
  });

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  await prisma.event.delete({
    where: { id },
  });

  // Log activity
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
        startDate: existingEvent.startDate,
        endDate: existingEvent.endDate,
        funds: existingEvent.funds,
        usedFunds: existingEvent.usedFunds,
      },
      newData: null,
    },
  });
};

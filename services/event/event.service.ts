import prisma from "@/lib/prisma";
import type { CreateEventInput, UpdateEventInput } from "@/types/event";
import type { Status, Department } from "@/types/enums";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

// Type for schedule filter conditions (used for MongoDB JSON array filtering)
type ScheduleFilterCondition = {
  date?: {
    gte?: string;
    lte?: string;
  };
  location?: {
    contains: string;
    mode: "insensitive";
  };
};

// Helper function to create MongoDB JSON array filter for schedules
// Uses Prisma's JSON path and array_contains for MongoDB JSON array filtering
function buildSchedulesFilter(condition: ScheduleFilterCondition) {
  return {
    path: [],
    array_contains: condition,
  } as any;
}

export const getEvents = async (filter: {
  department?: Department;
  status?: Status;
  periodId?: string;
  workProgramId?: string;
  search?: string;
  scheduleStartDate?: string;
  scheduleEndDate?: string;
  date?: string;
  location?: string;
}) => {
  const where: Prisma.EventWhereInput = {};

  if (filter.department) where.department = { equals: filter.department };
  if (filter.status) {
    where.status = { equals: filter.status as unknown as PrismaStatus };
  }
  if (filter.periodId) where.periodId = filter.periodId;
  if (filter.workProgramId) where.workProgramId = filter.workProgramId;

  const orConditions: Prisma.EventWhereInput[] = [];

  if (filter.search) {
    orConditions.push(
      { name: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
      { goal: { contains: filter.search, mode: "insensitive" } }
    );
  }

  // Handle date range filtering based on schedules
  if (filter.scheduleStartDate || filter.scheduleEndDate) {
    const rangeStart = filter.scheduleStartDate
      ? new Date(filter.scheduleStartDate)
      : undefined;
    const rangeEnd = filter.scheduleEndDate
      ? new Date(filter.scheduleEndDate)
      : undefined;

    const dateFilter: ScheduleFilterCondition = {};

    if (rangeStart && rangeEnd) {
      dateFilter.date = {
        gte: rangeStart.toISOString(),
        lte: rangeEnd.toISOString(),
      };
    } else if (rangeStart) {
      dateFilter.date = {
        gte: rangeStart.toISOString(),
      };
    } else if (rangeEnd) {
      dateFilter.date = {
        lte: rangeEnd.toISOString(),
      };
    }

    orConditions.push({
      schedules: buildSchedulesFilter(dateFilter),
    });
  }

  // Handle specific date filtering - find events that have a schedule on this exact date
  if (filter.date) {
    const targetDate = new Date(filter.date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    orConditions.push({
      schedules: buildSchedulesFilter({
        date: {
          gte: startOfDay.toISOString(),
          lte: endOfDay.toISOString(),
        },
      }),
    });
  }

  // Handle location filtering - find events that have a schedule at this location
  if (filter.location) {
    orConditions.push({
      schedules: buildSchedulesFilter({
        location: {
          contains: filter.location,
          mode: "insensitive",
        },
      }),
    });
  }

  if (orConditions.length > 0) {
    where.OR = orConditions;
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
    orderBy: { createdAt: "desc" },
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

  return event;
};

export const getEventBySlug = async (slug: string) => {
  const event = await prisma.event.findUnique({
    where: { slug },
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

  return event;
};

export const createEvent = async (data: CreateEventInput, user: UserWithId) => {
  // Generate slug from name
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Ensure schedules is an array
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

  // Always create approval record with PENDING status
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

export const updateEvent = async (
  id: string,
  data: UpdateEventInput,
  user: UserWithId
) => {
  // Get existing event with approval
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

  // Check if there are changes to the event (excluding status)
  const hasChanges =
    (data.name !== undefined && data.name !== existingEvent.name) ||
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

  // If there are changes and the event has an existing approval that is APPROVED or REJECTED,
  // reset the approval to PENDING
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
        schedules: existingEvent.schedules,
      },
      newData: {
        name: event.name,
        department: event.department,
        status: event.status,
        schedules: event.schedules,
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
        schedules: existingEvent.schedules,
      },
      newData: null,
    },
  });
};

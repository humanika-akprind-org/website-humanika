/**
 * Event Service - Hybrid pattern (functions + class exports)
 * Part of Clean Architecture: Infrastructure Layer
 *
 * This file provides both:
 * 1. Export functions for direct use (simple endpoints)
 * 2. Export classes for use case pattern (complex operations)
 *
 * Choose based on your needs:
 * - Simple CRUD → Use export functions directly
 * - Complex business logic → Use use cases with repository classes
 */

import prisma from "@/presentation/lib/prisma";
import type {
  CreateEventInput,
  UpdateEventInput,
  EventFilter,
} from "@/domain/entities/event.entity";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType, type Status } from "@/domain/enums/enums";
import type { Department } from "@/domain/enums/enums";
import type { User } from "@/domain/entities/user";

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
function buildSchedulesFilter(condition: ScheduleFilterCondition) {
  return {
    path: "",
    array_contains: condition,
  } as Record<string, unknown>;
}

// ============================================================================
// Export Functions (for direct use - simple endpoints)
// ============================================================================

export const getEvents = async (filter: EventFilter) => {
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
      { goal: { contains: filter.search, mode: "insensitive" } },
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

  // Handle specific date filtering
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

  // Handle location filtering
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

// ============================================================================
// Export Class (for use case pattern)
// ============================================================================

import type {
  IEventRepository,
  EventFilters,
  EventPagination,
  EventPaginationResult,
} from "@/application/interface/event.repository.interface";
import type { Event } from "@/domain/entities/event.entity";

export class EventRepositoryPrisma implements IEventRepository {
  private prisma = prisma;

  async findMany(
    filters?: EventFilters,
    pagination?: EventPagination,
  ): Promise<{ events: Event[]; pagination: EventPaginationResult }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};

    if (filters?.department) where.department = { equals: filters.department };
    if (filters?.status) {
      where.status = { equals: filters.status as unknown as PrismaStatus };
    }
    if (filters?.periodId) where.periodId = filters.periodId;
    if (filters?.workProgramId) where.workProgramId = filters.workProgramId;

    const orConditions: Prisma.EventWhereInput[] = [];

    if (filters?.search) {
      orConditions.push(
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { goal: { contains: filters.search, mode: "insensitive" } },
      );
    }

    // Handle date range filtering based on schedules
    if (filters?.scheduleStartDate || filters?.scheduleEndDate) {
      const rangeStart = filters.scheduleStartDate
        ? new Date(filters.scheduleStartDate)
        : undefined;
      const rangeEnd = filters.scheduleEndDate
        ? new Date(filters.scheduleEndDate)
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

    // Handle specific date filtering
    if (filters?.date) {
      const targetDate = new Date(filters.date);
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

    // Handle location filtering
    if (filters?.location) {
      orConditions.push({
        schedules: buildSchedulesFilter({
          location: {
            contains: filters.location,
            mode: "insensitive",
          },
        }),
      });
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
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
        skip,
        take: limit,
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      events: events as unknown as Event[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
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
    return event as unknown as Event | null;
  }

  async findByDepartment(department: Department): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { department },
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
    return events as unknown as Event[];
  }

  async findByStatus(status: Status): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { status },
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
    return events as unknown as Event[];
  }

  async findByPeriod(periodId: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { periodId },
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
    return events as unknown as Event[];
  }

  async create(data: CreateEventInput): Promise<Event> {
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

    const event = await this.prisma.event.create({
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

    return event as unknown as Event;
  }

  async update(id: string, data: UpdateEventInput): Promise<Event> {
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

    const event = await this.prisma.event.update({
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

    return event as unknown as Event;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({
      where: { id },
    });
  }

  // Base repository methods
  async findAll(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
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
    return events as unknown as Event[];
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
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
    return event as unknown as Event | null;
  }

  async count(where?: unknown): Promise<number> {
    return await this.prisma.event.count({
      where: where as Prisma.EventWhereInput,
    });
  }

  // Additional helper method for creating approval
  async createApproval(
    eventId: string,
    userId: string,
    note: string,
  ): Promise<void> {
    await this.prisma.approval.create({
      data: {
        entityType: "EVENT",
        entityId: eventId,
        userId,
        status: "PENDING",
        note,
      },
    });
  }
}

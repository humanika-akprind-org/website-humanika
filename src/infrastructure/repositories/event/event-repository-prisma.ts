/**
 * Event Repository Prisma - Class-based repository implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the EventRepositoryPrisma class that implements
 * IEventRepository interface for use with the use case pattern.
 */

import prisma from "@/presentation/lib/prisma";
import type {
  IEventRepository,
  EventFilters,
  EventPagination,
  EventPaginationResult,
} from "@/application/interface/event.repository.interface";
import type {
  CreateEventInput,
  UpdateEventInput,
} from "@/domain/entities/event.entity";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import type { Department, Status } from "@/domain/enums/enums";
import type { Event } from "@/domain/entities/event.entity";

// Type for schedule filter conditions (used for JSON array filtering)
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

// Helper function to create JSON array filter for schedules
function buildSchedulesFilter(condition: ScheduleFilterCondition) {
  return {
    path: "",
    array_contains: condition,
  } as Record<string, unknown>;
}

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

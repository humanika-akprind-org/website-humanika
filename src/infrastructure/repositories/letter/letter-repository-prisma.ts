/**
 * Letter Repository Prisma - Class-based repository implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the LetterRepositoryPrisma class that implements
 * ILetterRepository interface for use with the use case pattern.
 */

import prisma from "@/presentation/lib/prisma";
import type {
  ILetterRepository,
  LetterFilter,
  LetterPagination,
  LetterPaginationResult,
} from "@/application/interface/letter.repository.interface";
import type {
  CreateLetterInput,
  UpdateLetterInput,
} from "@/domain/entities/letter.entity";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import type { LetterType, LetterPriority, Status } from "@/domain/enums";
import type { Letter } from "@/domain/entities/letter.entity";

export class LetterRepositoryPrisma implements ILetterRepository {
  private prisma = prisma;

  async findMany(
    filters?: LetterFilter,
    pagination?: LetterPagination,
  ): Promise<{ letters: Letter[]; pagination: LetterPaginationResult }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.LetterWhereInput = {};

    if (filters?.type) where.type = { equals: filters.type };
    if (filters?.priority) where.priority = { equals: filters.priority };
    if (filters?.classification) {
      where.classification = { equals: filters.classification };
    }
    if (filters?.status) {
      where.status = { equals: filters.status as unknown as PrismaStatus };
    }
    if (filters?.periodId) where.periodId = filters.periodId;
    if (filters?.eventId) where.eventId = filters.eventId;

    const orConditions: Prisma.LetterWhereInput[] = [];

    if (filters?.search) {
      orConditions.push(
        { regarding: { contains: filters.search, mode: "insensitive" } },
        { number: { contains: filters.search, mode: "insensitive" } },
        { origin: { contains: filters.search, mode: "insensitive" } },
        { destination: { contains: filters.search, mode: "insensitive" } },
      );
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    const [letters, total] = await Promise.all([
      this.prisma.letter.findMany({
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
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.letter.count({ where }),
    ]);

    return {
      letters: letters as unknown as Letter[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByNumber(number: string): Promise<Letter | null> {
    const letter = await this.prisma.letter.findUnique({
      where: { number },
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
    return letter as unknown as Letter | null;
  }

  async findByType(type: LetterType): Promise<Letter[]> {
    const letters = await this.prisma.letter.findMany({
      where: { type },
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
      orderBy: { date: "desc" },
    });
    return letters as unknown as Letter[];
  }

  async findByPriority(priority: LetterPriority): Promise<Letter[]> {
    const letters = await this.prisma.letter.findMany({
      where: { priority },
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
      orderBy: { date: "desc" },
    });
    return letters as unknown as Letter[];
  }

  async findByStatus(status: Status): Promise<Letter[]> {
    const letters = await this.prisma.letter.findMany({
      where: { status },
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
      orderBy: { date: "desc" },
    });
    return letters as unknown as Letter[];
  }

  async findByPeriod(periodId: string): Promise<Letter[]> {
    const letters = await this.prisma.letter.findMany({
      where: { periodId },
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
      orderBy: { date: "desc" },
    });
    return letters as unknown as Letter[];
  }

  async findByEvent(eventId: string): Promise<Letter[]> {
    const letters = await this.prisma.letter.findMany({
      where: { eventId },
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
      orderBy: { date: "desc" },
    });
    return letters as unknown as Letter[];
  }

  async create(data: CreateLetterInput, userId: string): Promise<Letter> {
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
      createdBy: { connect: { id: userId } },
    };

    // Optional fields
    if (data.number) letterData.number = data.number;
    if (data.classification) letterData.classification = data.classification;
    if (data.periodId) letterData.period = { connect: { id: data.periodId } };
    if (data.eventId) letterData.event = { connect: { id: data.eventId } };

    const letter = await this.prisma.letter.create({
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

    return letter as unknown as Letter;
  }

  async update(id: string, data: UpdateLetterInput): Promise<Letter> {
    const updateData: Prisma.LetterUpdateInput = {
      regarding: data.regarding,
      origin: data.origin,
      destination: data.destination,
      date: data.date ? new Date(data.date) : undefined,
      type: data.type,
      priority: data.priority,
      status: data.status,
      body: data.body,
      letter: data.letter,
      notes: data.notes,
      number: data.number,
      classification: data.classification,
    };

    if (data.periodId) {
      updateData.period = { connect: { id: data.periodId } };
    }
    if (data.eventId) {
      updateData.event = { connect: { id: data.eventId } };
    }
    if (data.approvedById) {
      updateData.approvedBy = { connect: { id: data.approvedById } };
    }

    const letter = await this.prisma.letter.update({
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

    return letter as unknown as Letter;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.letter.delete({
      where: { id },
    });
  }

  // Base repository methods
  async findAll(): Promise<Letter[]> {
    const letters = await this.prisma.letter.findMany({
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
      orderBy: { date: "desc" },
    });
    return letters as unknown as Letter[];
  }

  async findById(id: string): Promise<Letter | null> {
    const letter = await this.prisma.letter.findUnique({
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
    return letter as unknown as Letter | null;
  }

  async count(where?: unknown): Promise<number> {
    return await this.prisma.letter.count({
      where: where as Prisma.LetterWhereInput,
    });
  }

  // Additional helper method for creating approval
  async createApproval(
    letterId: string,
    userId: string,
    note: string,
  ): Promise<void> {
    await this.prisma.approval.create({
      data: {
        entityType: "LETTER",
        entityId: letterId,
        userId,
        status: "PENDING",
        note,
      },
    });
  }
}

/**
 * Get Letters Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { LetterType, LetterPriority } from "@/domain/enums";
import { type Status } from "@/domain/enums";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";

export interface LetterFilter {
  type?: LetterType;
  priority?: LetterPriority;
  status?: Status;
  periodId?: string;
  eventId?: string;
  search?: string;
}

export type LetterWithRelations = Prisma.LetterGetPayload<{
  include: {
    period: true;
    event: true;
    createdBy: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    approvedBy: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    attachments: {
      select: {
        id: true;
        name: true;
        document: true;
      };
    };
    approvals: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
      };
    };
  };
}>;

/**
 * Get all letters with optional filters
 */
export async function getLetters(
  filter: LetterFilter,
): Promise<LetterWithRelations[]> {
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

  return letters;
}

/**
 * Get Event By Slug Repository - Read single event by slug
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get event by slug
 */
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

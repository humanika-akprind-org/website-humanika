/**
 * Gallery Form Helpers Repository - Helper functions for gallery form
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get events for gallery form dropdown
 */
export async function getEventsForGalleryForm() {
  return await prisma.event.findMany({
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
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get periods for gallery form dropdown
 */
export async function getPeriodsForForm() {
  return await prisma.period.findMany({
    orderBy: { startYear: "desc" },
  });
}

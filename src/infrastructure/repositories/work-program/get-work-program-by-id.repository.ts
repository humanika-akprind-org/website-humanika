/**
 * Get Work Program By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { type WorkProgram } from "@/domain/entities/work-program.entity";
import prisma from "@/presentation/lib/prisma";

/**
 * Get a single work program by its ID
 */
export async function getWorkProgram(id: string) {
  const workProgram = await prisma.workProgram.findUnique({
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

  return workProgram as unknown as WorkProgram;
}

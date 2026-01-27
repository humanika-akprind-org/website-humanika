/**
 * Get Finance By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get a single finance by ID
 */
export async function getFinance(id: string) {
  const finance = await prisma.finance.findUnique({
    where: { id },
    include: {
      workProgram: {
        select: {
          id: true,
          name: true,
        },
      },
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      approvals: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              department: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  return finance;
}

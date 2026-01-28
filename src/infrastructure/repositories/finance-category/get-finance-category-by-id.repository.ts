/**
 * Get Finance Category By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get a single finance category by ID
 */
export async function getFinanceCategoryById(id: string) {
  const financeCategory = await prisma.financeCategory.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          finances: true,
        },
      },
    },
  });

  return financeCategory;
}

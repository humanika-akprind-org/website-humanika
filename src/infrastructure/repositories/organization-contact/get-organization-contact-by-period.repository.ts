/**
 * Get Organization Contact By Period Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get organization contact by period ID
 */
export async function getOrganizationContactByPeriod(periodId: string) {
  return prisma.organizationContact.findFirst({
    where: { periodId },
    include: {
      period: true,
    },
  });
}

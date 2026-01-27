/**
 * Get Active Period Organization Contact Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get active period organization contact
 */
export async function getActivePeriodOrganizationContact() {
  return prisma.organizationContact.findFirst({
    where: {
      period: {
        isActive: true,
      },
    },
    include: {
      period: true,
    },
  });
}

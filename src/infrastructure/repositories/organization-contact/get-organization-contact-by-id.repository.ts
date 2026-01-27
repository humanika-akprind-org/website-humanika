/**
 * Get Organization Contact By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get a single organization contact by ID
 */
export async function getOrganizationContact(id: string) {
  return prisma.organizationContact.findUnique({
    where: { id },
    include: {
      period: true,
    },
  });
}

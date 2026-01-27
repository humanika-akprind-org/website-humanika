/**
 * Get Organization Contacts Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { OrganizationContactFilter } from "@/domain/entities/organization-contact.entity";
import type { Prisma } from "@prisma/client";

/**
 * Get all organization contacts with optional filter
 */
export async function getOrganizationContacts(
  filter?: OrganizationContactFilter,
) {
  const where: Prisma.OrganizationContactWhereInput = {};

  if (filter?.periodId) {
    where.periodId = filter.periodId;
  }

  return prisma.organizationContact.findMany({
    where,
    include: {
      period: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

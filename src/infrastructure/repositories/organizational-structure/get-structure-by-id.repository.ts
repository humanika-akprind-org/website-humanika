/**
 * Get Structure By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { OrganizationalStructure } from "@/domain/entities/organizational-structure.entity";

/**
 * Get a single organizational structure by ID
 */
export async function getStructure(id: string) {
  const structure = await prisma.organizationalStructure.findUnique({
    where: { id },
    include: {
      period: true,
    },
  });

  if (!structure) {
    throw new Error("Organizational structure not found");
  }

  return structure as OrganizationalStructure;
}

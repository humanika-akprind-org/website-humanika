/**
 * Get Management By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { prisma } from "@/presentation/lib/prisma";
import type { Management } from "@/domain/entities/management.entity";

/**
 * Get a single management by ID
 */
export async function getManagementById(
  id: string,
): Promise<Management | null> {
  const management = await prisma.management.findUnique({
    where: { id },
    include: {
      user: true,
      period: true,
    },
  });

  if (!management) {
    return null;
  }

  return management as unknown as Management;
}

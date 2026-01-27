/**
 * Update Management Photo Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { prisma } from "@/presentation/lib/prisma";
import type { Management } from "@/domain/entities/management.entity";

/**
 * Update management photo
 */
export async function updateManagementPhoto(
  id: string,
  photoUrl: string,
): Promise<Management> {
  const management = await prisma.management.update({
    where: { id },
    data: { photo: photoUrl },
    include: {
      user: true,
      period: true,
    },
  });

  return management as unknown as Management;
}

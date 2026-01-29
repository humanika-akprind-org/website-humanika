/**
 * Get Event Category By ID Repository
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the function to retrieve a single event category by ID.
 */

import prisma from "@/presentation/lib/prisma";
import type { EventCategory } from "@/domain/value-objects/event-category";

/**
 * Get a single event category by ID
 */
export async function getEventCategoryById(
  id: string,
): Promise<EventCategory | null> {
  const category = await prisma.eventCategory.findUnique({
    where: { id },
  });

  return category as unknown as EventCategory | null;
}

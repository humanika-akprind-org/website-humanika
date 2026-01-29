/**
 * Get Event Categories Repository
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the function to retrieve all event categories.
 */

import prisma from "@/presentation/lib/prisma";
import type { EventCategory } from "@/domain/value-objects/event-category";

/**
 * Get all event categories with optional filtering
 */
export async function getEventCategories(
  _filter?: Record<string, unknown>,
): Promise<EventCategory[]> {
  const categories = await prisma.eventCategory.findMany({
    orderBy: { name: "asc" },
  });

  return categories as unknown as EventCategory[];
}

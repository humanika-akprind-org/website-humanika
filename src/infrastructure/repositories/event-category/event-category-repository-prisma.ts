/**
 * Event Category Repository Prisma - Class-based repository implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the EventCategoryRepositoryPrisma class that implements
 * IEventCategoryRepository interface for use with the use case pattern.
 */

import prisma from "@/presentation/lib/prisma";
import type { IEventCategoryRepositoryExtended } from "@/application/interface/event-category.repository.interface";
import type {
  EventCategory,
  CreateEventCategoryInput,
  UpdateEventCategoryInput,
} from "@/domain/value-objects/event-category";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

export class EventCategoryRepositoryPrisma implements IEventCategoryRepositoryExtended {
  private prisma = prisma;

  /**
   * Find all event categories ordered by name
   */
  async findAll(): Promise<EventCategory[]> {
    const categories = await this.prisma.eventCategory.findMany({
      orderBy: { name: "asc" },
    });

    return categories as unknown as EventCategory[];
  }

  /**
   * Find a single event category by ID
   */
  async findById(id: string): Promise<EventCategory | null> {
    const category = await this.prisma.eventCategory.findUnique({
      where: { id },
    });

    return category as unknown as EventCategory | null;
  }

  /**
   * Find event category by name (for duplicate checking)
   */
  async findByName(name: string): Promise<EventCategory | null> {
    const category = await this.prisma.eventCategory.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    return category as unknown as EventCategory | null;
  }

  /**
   * Create a new event category with activity logging
   */
  async create(
    data: CreateEventCategoryInput,
    userId: string,
  ): Promise<EventCategory> {
    const category = await this.prisma.eventCategory.create({
      data: {
        name: data.name,
        description: data.description || null,
      },
    });

    // Log activity
    await logActivity({
      userId,
      activityType: ActivityType.CREATE,
      entityType: "EventCategory",
      entityId: category.id,
      description: `Created event category: ${category.name}`,
      metadata: {
        newData: {
          name: category.name,
          description: category.description,
        },
      },
    });

    return category as unknown as EventCategory;
  }

  /**
   * Update an existing event category with activity logging
   */
  async update(
    id: string,
    data: UpdateEventCategoryInput,
    userId: string,
  ): Promise<EventCategory> {
    // Get existing category for logging
    const existingCategory = await this.prisma.eventCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error("Event category not found");
    }

    const category = await this.prisma.eventCategory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });

    // Log activity
    await logActivity({
      userId,
      activityType: ActivityType.UPDATE,
      entityType: "EventCategory",
      entityId: category.id,
      description: `Updated event category: ${category.name}`,
      metadata: {
        oldData: {
          name: existingCategory.name,
          description: existingCategory.description,
        },
        newData: {
          name: category.name,
          description: category.description,
        },
      },
    });

    return category as unknown as EventCategory;
  }

  /**
   * Delete an event category with activity logging
   */
  async delete(id: string, userId: string): Promise<void> {
    // Check if category exists
    const existingCategory = await this.prisma.eventCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error("Event category not found");
    }

    await this.prisma.eventCategory.delete({
      where: { id },
    });

    // Log activity
    await logActivity({
      userId,
      activityType: ActivityType.DELETE,
      entityType: "EventCategory",
      entityId: id,
      description: `Deleted event category: ${existingCategory.name}`,
      metadata: {
        oldData: {
          name: existingCategory.name,
          description: existingCategory.description,
        },
        newData: null,
      },
    });
  }

  /**
   * Count event categories
   */
  async count(): Promise<number> {
    return await this.prisma.eventCategory.count();
  }
}

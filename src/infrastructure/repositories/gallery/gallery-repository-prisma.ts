/**
 * Gallery Repository Prisma - Class-based repository implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the GalleryRepositoryPrisma class that implements
 * IGalleryRepository interface for use with the use case pattern.
 */

import prisma from "@/presentation/lib/prisma";
import type {
  IGalleryRepository,
  GalleryFilter,
  GalleryPagination,
  GalleryPaginationResult,
} from "@/application/interface/gallery.repository.interface";
import type {
  CreateGalleryInput,
  UpdateGalleryInput,
} from "@/domain/entities/gallery.entity";
import type { Prisma } from "@prisma/client";
import type { Gallery } from "@/domain/entities/gallery.entity";

export class GalleryRepositoryPrisma implements IGalleryRepository {
  private prisma = prisma;

  async findMany(
    filters?: GalleryFilter,
    pagination?: GalleryPagination,
  ): Promise<{ galleries: Gallery[]; pagination: GalleryPaginationResult }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.GalleryWhereInput = {};

    if (filters?.eventId) where.eventId = filters.eventId;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.periodId) where.periodId = filters.periodId;

    const orConditions: Prisma.GalleryWhereInput[] = [];

    if (filters?.search) {
      orConditions.push(
        { title: { contains: filters.search, mode: "insensitive" } },
        { event: { name: { contains: filters.search, mode: "insensitive" } } },
      );
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    const [galleries, total] = await Promise.all([
      this.prisma.gallery.findMany({
        where,
        include: {
          event: true,
          category: true,
          period: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.gallery.count({ where }),
    ]);

    return {
      galleries: galleries as unknown as Gallery[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByEvent(eventId: string): Promise<Gallery[]> {
    const galleries = await this.prisma.gallery.findMany({
      where: { eventId },
      include: {
        event: true,
        category: true,
        period: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return galleries as unknown as Gallery[];
  }

  async findByCategory(categoryId: string): Promise<Gallery[]> {
    const galleries = await this.prisma.gallery.findMany({
      where: { categoryId },
      include: {
        event: true,
        category: true,
        period: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return galleries as unknown as Gallery[];
  }

  async create(data: CreateGalleryInput): Promise<Gallery> {
    const galleryData: Prisma.GalleryCreateInput = {
      title: data.title,
      event: { connect: { id: data.eventId } },
      image: data.image,
    };

    if (data.categoryId) {
      galleryData.category = { connect: { id: data.categoryId } };
    }

    if (data.periodId) {
      galleryData.period = { connect: { id: data.periodId } };
    }

    const gallery = await this.prisma.gallery.create({
      data: galleryData,
      include: {
        event: true,
        category: true,
        period: true,
      },
    });

    return gallery as unknown as Gallery;
  }

  async update(id: string, data: UpdateGalleryInput): Promise<Gallery> {
    const updateData: Prisma.GalleryUpdateInput = {
      title: data.title,
      image: data.image,
    };

    if (data.eventId) {
      updateData.event = { connect: { id: data.eventId } };
    }

    if (data.categoryId !== undefined) {
      if (data.categoryId) {
        updateData.category = { connect: { id: data.categoryId } };
      } else {
        updateData.category = { disconnect: true };
      }
    }

    if (data.periodId !== undefined) {
      if (data.periodId) {
        updateData.period = { connect: { id: data.periodId } };
      } else {
        updateData.period = { disconnect: true };
      }
    }

    const gallery = await this.prisma.gallery.update({
      where: { id },
      data: updateData,
      include: {
        event: true,
        category: true,
        period: true,
      },
    });

    return gallery as unknown as Gallery;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.gallery.delete({
      where: { id },
    });
  }

  // Base repository methods
  async findAll(): Promise<Gallery[]> {
    const galleries = await this.prisma.gallery.findMany({
      include: {
        event: true,
        category: true,
        period: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return galleries as unknown as Gallery[];
  }

  async findById(id: string): Promise<Gallery | null> {
    const gallery = await this.prisma.gallery.findUnique({
      where: { id },
      include: {
        event: true,
        category: true,
        period: true,
      },
    });
    return gallery as unknown as Gallery | null;
  }

  async count(where?: unknown): Promise<number> {
    return await this.prisma.gallery.count({
      where: where as Prisma.GalleryWhereInput,
    });
  }
}

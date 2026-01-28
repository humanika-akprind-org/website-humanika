/**
 * Gallery Category Repository Prisma - Class-based repository implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { IGalleryCategoryRepository } from "@/application/interface/gallery-category.repository.interface";
import type {
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/domain/value-objects/gallery-category";
import type { GalleryCategory } from "@/domain/value-objects/gallery-category";

export class GalleryCategoryRepositoryPrisma implements IGalleryCategoryRepository {
  private prisma = prisma;

  async findAll(): Promise<GalleryCategory[]> {
    const categories = await this.prisma.galleryCategory.findMany({
      orderBy: { name: "asc" },
    });
    return categories as unknown as GalleryCategory[];
  }

  async findById(id: string): Promise<GalleryCategory | null> {
    const category = await this.prisma.galleryCategory.findUnique({
      where: { id },
    });
    return category as unknown as GalleryCategory | null;
  }

  async findByName(name: string): Promise<GalleryCategory | null> {
    const category = await this.prisma.galleryCategory.findUnique({
      where: { name },
    });
    return category as unknown as GalleryCategory | null;
  }

  async create(data: CreateGalleryCategoryInput): Promise<GalleryCategory> {
    const category = await this.prisma.galleryCategory.create({
      data,
    });
    return category as unknown as GalleryCategory;
  }

  async update(
    id: string,
    data: UpdateGalleryCategoryInput,
  ): Promise<GalleryCategory> {
    const category = await this.prisma.galleryCategory.update({
      where: { id },
      data,
    });
    return category as unknown as GalleryCategory;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.galleryCategory.delete({
      where: { id },
    });
  }

  async count(where?: unknown): Promise<number> {
    return await this.prisma.galleryCategory.count({
      where: where as Record<string, unknown>,
    });
  }
}

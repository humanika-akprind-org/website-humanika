/**
 * Management Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements IManagementRepository using Prisma ORM.
 */

import { prisma } from "@/presentation/lib/prisma";
import type {
  IManagementRepository,
  ManagementFilters,
  ManagementPagination,
} from "@/application/interface/management.repository.interface";
import type {
  Management,
  ManagementServerData,
} from "@/domain/entities/management.entity";
import type { Department, Position } from "@/domain/enums";

interface PaginationResult {
  managements: Management[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ManagementRepositoryPrisma implements IManagementRepository {
  private prismaClient = prisma;

  /**
   * Find all management records
   */
  async findAll(): Promise<Management[]> {
    const managements = await this.prismaClient.management.findMany({
      include: {
        user: true,
        period: true,
      },
      orderBy: {
        department: "asc",
      },
    });

    return managements as unknown as Management[];
  }

  /**
   * Count management records
   */
  async count(where?: unknown): Promise<number> {
    return this.prismaClient.management.count({
      where: where as Record<string, unknown>,
    });
  }

  /**
   * Create a new management record
   */
  async create(data: ManagementServerData): Promise<Management> {
    const management = await this.prismaClient.management.create({
      data: {
        userId: data.userId,
        periodId: data.periodId,
        position: data.position,
        department: data.department,
        photo: data.photo,
      },
      include: {
        user: true,
        period: true,
      },
    });

    return management as unknown as Management;
  }

  /**
   * Find management by ID
   */
  async findById(id: string): Promise<Management | null> {
    const management = await this.prismaClient.management.findUnique({
      where: { id },
      include: {
        user: true,
        period: true,
      },
    });

    return management as unknown as Management | null;
  }

  /**
   * Find all managements with optional filters and pagination
   */
  async findMany(
    filters?: ManagementFilters,
    pagination?: ManagementPagination,
  ): Promise<PaginationResult> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (filters?.department) {
      where.department = filters.department;
    }

    if (filters?.position) {
      where.position = filters.position;
    }

    if (filters?.periodId) {
      where.periodId = filters.periodId;
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    // Search by user name or email
    if (filters?.search) {
      where.user = {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { email: { contains: filters.search, mode: "insensitive" } },
        ],
      };
    }

    // Get total count
    const total = await this.prismaClient.management.count({ where });

    // Get paginated results
    const managements = await this.prismaClient.management.findMany({
      where,
      include: {
        user: true,
        period: true,
      },
      orderBy: {
        department: "asc",
      },
      skip,
      take: limit,
    });

    return {
      managements: managements as unknown as Management[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update management record
   */
  async update(id: string, data: ManagementServerData): Promise<Management> {
    const management = await this.prismaClient.management.update({
      where: { id },
      data: {
        userId: data.userId,
        periodId: data.periodId,
        position: data.position,
        department: data.department,
        photo: data.photo,
      },
      include: {
        user: true,
        period: true,
      },
    });

    return management as unknown as Management;
  }

  /**
   * Delete management record
   */
  async delete(id: string): Promise<void> {
    await this.prismaClient.management.delete({
      where: { id },
    });
  }

  /**
   * Find management by user ID and period ID
   */
  async findByUserAndPeriod(
    userId: string,
    periodId: string,
  ): Promise<Management | null> {
    const management = await this.prismaClient.management.findFirst({
      where: {
        userId,
        periodId,
      },
      include: {
        user: true,
        period: true,
      },
    });

    return management as unknown as Management | null;
  }

  /**
   * Find management by position and department in a period
   */
  async findByPositionAndDepartment(
    position: Position,
    department: Department,
    periodId: string,
  ): Promise<Management | null> {
    const management = await this.prismaClient.management.findFirst({
      where: {
        position,
        department,
        periodId,
      },
      include: {
        user: true,
        period: true,
      },
    });

    return management as unknown as Management | null;
  }

  /**
   * Update management photo
   */
  async updatePhoto(id: string, photo: string): Promise<Management> {
    const management = await this.prismaClient.management.update({
      where: { id },
      data: { photo },
      include: {
        user: true,
        period: true,
      },
    });

    return management as unknown as Management;
  }
}

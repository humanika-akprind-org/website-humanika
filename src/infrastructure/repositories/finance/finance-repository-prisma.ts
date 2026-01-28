/**
 * Finance Repository Prisma - Class-based repository implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the FinanceRepositoryPrisma class that implements
 * IFinanceRepository interface for use with the use case pattern.
 */

import prisma from "@/presentation/lib/prisma";
import type { IFinanceRepository } from "@/application/interface/finance.repository.interface";
import type {
  CreateFinanceInput,
  Finance,
  FinanceFilter,
} from "@/domain/entities/finance.entity";
import type { Prisma } from "@prisma/client";
import type { FinanceType, Status } from "@/domain/enums";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

export class FinanceRepositoryPrisma implements IFinanceRepository {
  private prisma = prisma;

  /**
   * Get all finances with optional filters
   */
  async getFinances(filter?: FinanceFilter): Promise<Finance[]> {
    const where: Prisma.FinanceWhereInput = {};

    if (filter?.type) {
      where.type = { equals: filter.type as unknown as FinanceType };
    }
    if (filter?.status) {
      where.status = { equals: filter.status as unknown as Status };
    }
    if (filter?.periodId) where.periodId = filter.periodId;
    if (filter?.categoryId) where.categoryId = filter.categoryId;
    if (filter?.workProgramId) where.workProgramId = filter.workProgramId;
    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { description: { contains: filter.search, mode: "insensitive" } },
      ];
    }
    if (filter?.startDate || filter?.endDate) {
      where.date = {};
      if (filter.startDate) where.date.gte = new Date(filter.startDate);
      if (filter.endDate) where.date.lte = new Date(filter.endDate);
    }

    const finances = await this.prisma.finance.findMany({
      where,
      include: {
        workProgram: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
      orderBy: { date: "desc" },
    });

    return finances as unknown as Finance[];
  }

  /**
   * Get a single finance by ID
   */
  async getFinanceById(id: string): Promise<Finance | null> {
    const finance = await this.prisma.finance.findUnique({
      where: { id },
      include: {
        workProgram: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    return finance as unknown as Finance | null;
  }

  /**
   * Create a new finance
   */
  async createFinance(
    data: CreateFinanceInput,
    user: { id: string },
  ): Promise<Finance> {
    const financeData: Prisma.FinanceCreateInput = {
      name: data.name,
      amount: data.amount,
      description: data.description || "",
      date: new Date(data.date),
      type: data.type,
      user: { connect: { id: user.id } },
      proof: data.proof,
    };

    if (data.categoryId) {
      financeData.category = { connect: { id: data.categoryId } };
    }

    if (data.workProgramId) {
      financeData.workProgram = { connect: { id: data.workProgramId } };
    }

    if (data.periodId) {
      financeData.period = { connect: { id: data.periodId } };
    }

    const finance = await this.prisma.finance.create({
      data: financeData,
      include: {
        workProgram: {
          select: {
            id: true,
            name: true,
          },
        },
        period: true,
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
        },
      },
    });

    // Log activity
    await logActivity({
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "Finance",
      entityId: finance.id,
      description: `Created finance transaction: ${finance.name}`,
      metadata: {
        newData: {
          name: finance.name,
          amount: finance.amount,
          description: finance.description,
          date: finance.date,
          categoryId: finance.categoryId,
          type: finance.type,
          workProgramId: finance.workProgramId,
          userId: finance.userId,
          proof: finance.proof,
          status: finance.status,
        },
      },
    });

    // Create initial approval request for the finance if status is PENDING
    if (financeData.status === "PENDING") {
      await this.prisma.approval.create({
        data: {
          entityType: "FINANCE",
          entityId: finance.id,
          userId: user.id,
          status: "PENDING",
          note: "Finance transaction submitted for approval",
        },
      });
    }

    return finance as unknown as Finance;
  }

  /**
   * Update an existing finance
   */
  async updateFinance(
    id: string,
    data: Partial<CreateFinanceInput>,
  ): Promise<Finance> {
    const updateData: Prisma.FinanceUpdateInput = {
      name: data.name,
      amount: data.amount,
      description: data.description,
      date: data.date ? new Date(data.date) : undefined,
      type: data.type,
      proof: data.proof,
    };

    if (data.categoryId) {
      updateData.category = { connect: { id: data.categoryId } };
    }

    if (data.workProgramId) {
      updateData.workProgram = { connect: { id: data.workProgramId } };
    }

    if (data.periodId) {
      updateData.period = { connect: { id: data.periodId } };
    }

    const finance = await this.prisma.finance.update({
      where: { id },
      data: updateData,
      include: {
        workProgram: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    return finance as unknown as Finance;
  }

  /**
   * Delete a finance
   */
  async deleteFinance(id: string): Promise<void> {
    await this.prisma.finance.delete({
      where: { id },
    });
  }
}

/**
 * Update Finance Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UpdateFinanceInput } from "@/domain/entities/finance.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing finance transaction
 */
export async function updateFinance(
  id: string,
  data: UpdateFinanceInput,
  user: UserWithId,
) {
  // Check if finance exists
  const existingFinance = await prisma.finance.findUnique({
    where: { id },
  });

  if (!existingFinance) {
    throw new Error("Finance not found");
  }

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.workProgramId !== undefined) {
    updateData.workProgramId = data.workProgramId;
  }
  if (data.periodId !== undefined) {
    updateData.periodId = data.periodId;
  }
  if (data.proof !== undefined) updateData.proof = data.proof;
  if (data.status !== undefined) updateData.status = data.status;

  const finance = await prisma.finance.update({
    where: { id },
    data: updateData,
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
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Finance",
    entityId: finance.id,
    description: `Updated finance transaction: ${finance.name}`,
    metadata: {
      oldData: {
        name: existingFinance.name,
        amount: existingFinance.amount,
        description: existingFinance.description,
        date: existingFinance.date,
        categoryId: existingFinance.categoryId,
        type: existingFinance.type,
        workProgramId: existingFinance.workProgramId,
        userId: existingFinance.userId,
        proof: existingFinance.proof,
        status: existingFinance.status,
      },
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

  // Create approval request if status is changed to PENDING
  if (data.status === "PENDING" && existingFinance.status !== "PENDING") {
    await prisma.approval.create({
      data: {
        entityType: "FINANCE",
        entityId: finance.id,
        userId: user.id,
        status: "PENDING",
        note: "Finance transaction submitted for approval",
      },
    });
  }

  return finance;
}

/**
 * Create Finance Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { CreateFinanceInput } from "@/domain/entities/finance.entity";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Create a new finance transaction
 */
export async function createFinance(
  data: CreateFinanceInput,
  user: UserWithId,
) {
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

  const finance = await prisma.finance.create({
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

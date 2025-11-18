import prisma from "@/lib/prisma";
import type { CreateFinanceInput, UpdateFinanceInput } from "@/types/finance";
import type { FinanceType, Status } from "@/types/enums";
import type {
  Prisma,
  Status as PrismaStatus,
  FinanceType as PrismaFinanceType,
} from "@prisma/client";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export const getFinances = async (filter: {
  type?: FinanceType;
  status?: Status;
  periodId?: string;
  categoryId?: string;
  eventId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const where: Prisma.FinanceWhereInput = {};

  if (filter.type) {
    where.type = { equals: filter.type as PrismaFinanceType };
  }
  if (filter.status) {
    where.status = { equals: filter.status as unknown as PrismaStatus };
  }
  if (filter.periodId) where.periodId = filter.periodId;
  if (filter.categoryId) where.categoryId = filter.categoryId;
  if (filter.eventId) where.eventId = filter.eventId;
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
    ];
  }
  if (filter.startDate || filter.endDate) {
    where.date = {};
    if (filter.startDate) where.date.gte = new Date(filter.startDate);
    if (filter.endDate) where.date.lte = new Date(filter.endDate);
  }

  const finances = await prisma.finance.findMany({
    where,
    include: {
      period: true,
      category: true,
      event: {
        select: {
          id: true,
          name: true,
        },
      },
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

  return finances;
};

export const getFinance = async (id: string) => {
  const finance = await prisma.finance.findUnique({
    where: { id },
    include: {
      period: true,
      category: true,
      event: {
        select: {
          id: true,
          name: true,
        },
      },
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

  return finance;
};

export const createFinance = async (
  data: CreateFinanceInput,
  user: UserWithId
) => {
  const financeData: Prisma.FinanceCreateInput = {
    name: data.name,
    amount: data.amount,
    description: data.description || "",
    date: new Date(data.date),
    category: { connect: { id: data.categoryId } },
    type: data.type,
    period: { connect: { id: data.periodId } },
    user: { connect: { id: user.id } },
    proof: data.proof,
  };

  // Only include eventId if it's provided and not empty
  if (data.eventId && data.eventId.trim() !== "") {
    financeData.event = { connect: { id: data.eventId } };
  }

  const finance = await prisma.finance.create({
    data: financeData,
    include: {
      period: true,
      category: true,
      event: {
        select: {
          id: true,
          name: true,
        },
      },
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
        periodId: finance.periodId,
        eventId: finance.eventId,
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
};

export const updateFinance = async (
  id: string,
  data: UpdateFinanceInput,
  user: UserWithId
) => {
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
  if (data.periodId !== undefined) updateData.periodId = data.periodId;
  if (data.eventId !== undefined && data.eventId.trim() !== "") {
    updateData.eventId = data.eventId;
  } else if (data.eventId === "") {
    // If empty string is provided, set to null to clear the relation
    updateData.eventId = null;
  }
  if (data.proof !== undefined) updateData.proof = data.proof;
  if (data.status !== undefined) updateData.status = data.status;

  const finance = await prisma.finance.update({
    where: { id },
    data: updateData,
    include: {
      period: true,
      category: true,
      event: {
        select: {
          id: true,
          name: true,
        },
      },
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
        periodId: existingFinance.periodId,
        eventId: existingFinance.eventId,
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
        periodId: finance.periodId,
        eventId: finance.eventId,
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
};

export const deleteFinance = async (id: string, user: UserWithId) => {
  // Check if finance exists
  const existingFinance = await prisma.finance.findUnique({
    where: { id },
  });

  if (!existingFinance) {
    throw new Error("Finance not found");
  }

  await prisma.finance.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Finance",
    entityId: id,
    description: `Deleted finance transaction: ${existingFinance.name}`,
    metadata: {
      oldData: {
        name: existingFinance.name,
        amount: existingFinance.amount,
        description: existingFinance.description,
        date: existingFinance.date,
        categoryId: existingFinance.categoryId,
        type: existingFinance.type,
        periodId: existingFinance.periodId,
        eventId: existingFinance.eventId,
        userId: existingFinance.userId,
        proof: existingFinance.proof,
        status: existingFinance.status,
      },
      newData: null,
    },
  });
};

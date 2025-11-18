import { prisma } from "@/lib/prisma";
import type { StatusApproval } from "@prisma/client";
import type { ApprovalType } from "@/types/enums";
import type { ApprovalFilters, ApprovalsResponse } from "@/types/approval";

export async function getApprovals(
  filters: ApprovalFilters
): Promise<ApprovalsResponse> {
  const { status, entityType, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status as StatusApproval;
  }

  if (entityType) {
    where.entityType = entityType as ApprovalType;
  }

  // Get total count
  const total = await prisma.approval.count({ where });

  // Get approvals with related data
  const approvals = await prisma.approval.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
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
      workProgram: {
        select: {
          id: true,
          name: true,
          department: true,
          status: true,
        },
      },
      event: {
        select: {
          id: true,
          name: true,
          department: true,
          status: true,
        },
      },
      finance: {
        select: {
          id: true,
          name: true,
          amount: true,
          type: true,
          status: true,
        },
      },
      document: {
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
        },
      },
      letter: {
        select: {
          id: true,
          regarding: true,
          type: true,
          status: true,
        },
      },
    },
  });

  const pages = Math.ceil(total / limit);

  return {
    approvals,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
}

export async function findApprovalById(id: string) {
  return await prisma.approval.findUnique({
    where: { id },
    include: {
      workProgram: true,
      event: true,
      finance: true,
      document: true,
      letter: true,
    },
  });
}

export async function findApprovalByEntity(
  entityType: ApprovalType,
  entityId: string,
  userId: string
) {
  return await prisma.approval.findFirst({
    where: {
      entityType,
      entityId,
      userId,
    },
  });
}

export async function createApprovalRecord(data: {
  entityType: ApprovalType;
  entityId: string;
  userId: string;
  status: StatusApproval;
  note?: string;
}) {
  return await prisma.approval.create({
    data,
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
  });
}

export async function updateApprovalRecord(
  id: string,
  data: {
    status: StatusApproval;
    note?: string;
  }
) {
  return await prisma.approval.update({
    where: { id },
    data,
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
      workProgram: {
        select: {
          id: true,
          name: true,
          department: true,
          status: true,
        },
      },
      event: {
        select: {
          id: true,
          name: true,
          department: true,
          status: true,
        },
      },
      finance: {
        select: {
          id: true,
          name: true,
          amount: true,
          type: true,
          status: true,
        },
      },
      document: {
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
        },
      },
      letter: {
        select: {
          id: true,
          regarding: true,
          type: true,
          status: true,
        },
      },
    },
  });
}

export async function deleteApprovalRecord(id: string) {
  return await prisma.approval.delete({
    where: { id },
  });
}

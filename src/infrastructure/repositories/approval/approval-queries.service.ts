import { prisma } from "@/lib/prisma";
import type { ApprovalType } from "@/types/enums";
import type { StatusApproval } from "@prisma/client";
import type {
  ApprovalFilters,
  ApprovalsResponse,
  ApprovalWithRelations,
} from "@/types/approval";

export async function getApprovals(
  filters: ApprovalFilters
): Promise<ApprovalsResponse> {
  const { status, entityType, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Record<string, unknown> = {};

  if (status && status !== "all") {
    where.status = status as StatusApproval;
  }

  if (entityType) {
    where.entityType = entityType as ApprovalType;
  }

  // Get total count
  const total = await prisma.approval.count({ where });

  // Get approvals with related data
  const rawApprovals = await prisma.approval.findMany({
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
          documentTypeId: true,
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

  const approvals = rawApprovals.map((approval) => {
    const nameApproval =
      approval.workProgram?.name ||
      approval.event?.name ||
      approval.finance?.name ||
      approval.document?.name ||
      approval.letter?.regarding ||
      "";

    return {
      ...approval,
      nameApproval,
    };
  }) as ApprovalWithRelations[];

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

export async function findApprovalById(
  id: string
): Promise<ApprovalWithRelations | null> {
  const result = await prisma.approval.findUnique({
    where: { id },
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
          documentTypeId: true,
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

  if (!result) return null;

  const nameApproval =
    result.workProgram?.name ||
    result.event?.name ||
    result.finance?.name ||
    result.document?.name ||
    result.letter?.regarding ||
    "";

  return {
    ...result,
    nameApproval,
  };
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
}): Promise<ApprovalWithRelations> {
  const approval = await prisma.approval.create({
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
          documentTypeId: true,
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

  const nameApproval =
    approval.workProgram?.name ||
    approval.event?.name ||
    approval.finance?.name ||
    approval.document?.name ||
    approval.letter?.regarding ||
    "";

  return {
    ...approval,
    nameApproval,
  };
}

export async function updateApprovalRecord(
  id: string,
  data: {
    status: StatusApproval;
    note?: string;
  }
): Promise<ApprovalWithRelations> {
  const approval = await prisma.approval.update({
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
          documentTypeId: true,
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

  const nameApproval =
    approval.workProgram?.name ||
    approval.event?.name ||
    approval.finance?.name ||
    approval.document?.name ||
    approval.letter?.regarding ||
    "";

  return {
    ...approval,
    nameApproval,
  };
}

export async function deleteApprovalRecord(id: string) {
  return await prisma.approval.delete({
    where: { id },
  });
}

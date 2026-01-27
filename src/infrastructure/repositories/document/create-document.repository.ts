import prisma from "@/presentation/lib/prisma";
import type { CreateDocumentInput } from "@/domain/entities/document.entity";
import { ApprovalType } from "@/domain/enums";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";
import type { DocumentType as DocumentTypeEnum } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export const createDocument = async (
  data: CreateDocumentInput,
  user: UserWithId,
) => {
  const documentData: Prisma.DocumentCreateInput = {
    name: data.name,
    documentType: { connect: { id: data.documentTypeId } },
    status: (data.status as unknown as PrismaStatus) || "DRAFT",
    document: data.document,
    user: { connect: { id: user.id } },
  };

  if (data.letterId) {
    documentData.letter = { connect: { id: data.letterId } };
  }

  // Handle periodId
  if (data.periodId) {
    documentData.period = { connect: { id: data.periodId } };
  }

  const document = await prisma.document.create({
    data: documentData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      period: true,
      letter: {
        select: {
          id: true,
          number: true,
          regarding: true,
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
      documentType: true,
    },
  });

  // Add type field
  const documentWithType = {
    ...document,
    type: document.documentType?.name
      ? (document.documentType.name
          .toUpperCase()
          .replace(/ /g, "_") as DocumentTypeEnum)
      : undefined,
  };

  // Only create approval record for proposals and accountability reports
  // Regular documents do not require approval
  const normalizedDocType =
    document.documentType?.name?.toLowerCase().replace(/[\s\-]/g, "") || "";
  const requiresApproval =
    normalizedDocType === "proposal" ||
    normalizedDocType === "accountabilityreport";

  if (requiresApproval) {
    // Determine entityType based on documentType
    const entityType =
      normalizedDocType === "proposal"
        ? ApprovalType.DOCUMENT_PROPOSAL
        : ApprovalType.DOCUMENT_ACCOUNTABILITY_REPORT;

    // Create approval record with PENDING status
    await prisma.approval.create({
      data: {
        entityType,
        entityId: document.id,
        userId: user.id,
        status: "PENDING",
        note: "Document created and pending approval",
      },
    });
  }

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "Document",
    entityId: documentWithType.id,
    description: `Created document: ${documentWithType.name}`,
    metadata: {
      newData: {
        name: documentWithType.name,
        documentTypeId: documentWithType.documentTypeId,
        status: documentWithType.status,
        letterId: documentWithType.letterId,
      },
    },
  });

  return documentWithType;
};

import prisma from "@/lib/prisma";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";
import {
  type Status,
  type DocumentType as DocumentTypeEnum,
  ApprovalType,
} from "@/types/enums";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export const getDocuments = async (filter: {
  documentTypeId?: string;
  status?: Status;
  userId?: string;
  letterId?: string;
  search?: string;
}) => {
  const where: Prisma.DocumentWhereInput = {};

  if (filter.documentTypeId) {
    where.documentTypeId = filter.documentTypeId;
  }
  if (filter.status) {
    where.status = { equals: filter.status as unknown as PrismaStatus };
  }
  if (filter.userId) where.userId = filter.userId;
  if (filter.letterId) where.letterId = filter.letterId;
  if (filter.search) {
    where.OR = [{ name: { contains: filter.search, mode: "insensitive" } }];
  }

  const documents = await prisma.document.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
    orderBy: { createdAt: "desc" },
  });

  // Add type field by converting documentType name to enum format
  const documentsWithType = documents.map((doc) => ({
    ...doc,
    type: doc.documentType?.name
      ? (doc.documentType.name
          .toUpperCase()
          .replace(/ /g, "_") as DocumentTypeEnum)
      : undefined,
  }));

  return documentsWithType;
};

export const getDocument = async (id: string) => {
  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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

  if (!document) return null;

  // Add type field
  const documentWithType = {
    ...document,
    type: document.documentType?.name
      ? (document.documentType.name
          .toUpperCase()
          .replace(/ /g, "_") as DocumentTypeEnum)
      : undefined,
  };

  return documentWithType;
};

export const createDocument = async (
  data: CreateDocumentInput,
  user: UserWithId
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

  // Determine entityType based on documentType
  const entityType =
    document.documentType?.name?.toLowerCase().replace(/[\s\-]/g, "") ===
    "proposal"
      ? ApprovalType.DOCUMENT_PROPOSAL
      : document.documentType?.name?.toLowerCase().replace(/[\s\-]/g, "") ===
        "accountabilityreport"
      ? ApprovalType.DOCUMENT_ACCOUNTABILITY_REPORT
      : ApprovalType.DOCUMENT;

  // Always create approval record with PENDING status
  await prisma.approval.create({
    data: {
      entityType,
      entityId: document.id,
      userId: user.id,
      status: "PENDING",
      note: "Document created and pending approval",
    },
  });

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

export const updateDocument = async (
  id: string,
  data: UpdateDocumentInput,
  user: UserWithId
) => {
  // Check if document exists with approval
  const existingDocument = await prisma.document.findUnique({
    where: { id },
    include: { approvals: true, documentType: true },
  });

  if (!existingDocument) {
    throw new Error("Document not found");
  }

  // Check if there are changes to the document (excluding status)
  const hasChanges =
    (data.name !== undefined && data.name !== existingDocument.name) ||
    (data.letterId !== undefined &&
      data.letterId !== existingDocument.letterId) ||
    (data.documentTypeId !== undefined &&
      data.documentTypeId !== existingDocument.documentTypeId) ||
    (data.document !== undefined &&
      data.document !== existingDocument.document);

  const updateData: Record<string, unknown> = {};

  // If there are changes and the document has an existing approval that is APPROVED or REJECTED,
  // reset the approval to PENDING
  if (
    hasChanges &&
    existingDocument.approvals &&
    existingDocument.approvals.length > 0 &&
    (existingDocument.approvals[0].status === "APPROVED" ||
      existingDocument.approvals[0].status === "REJECTED")
  ) {
    await prisma.approval.update({
      where: { id: existingDocument.approvals[0].id },
      data: {
        status: "PENDING",
        note: "Document updated and resubmitted for approval",
      },
    });
    // Also update the document status to PENDING
    updateData.status = "PENDING";
  }

  if (data.name !== undefined) updateData.name = data.name;
  if (data.letterId !== undefined) updateData.letterId = data.letterId;
  if (data.documentTypeId) updateData.documentTypeId = data.documentTypeId;
  if (data.document !== undefined) updateData.document = data.document;
  if (data.status) updateData.status = data.status;

  // Handle status change to PENDING - create approval record
  if (data.status === "PENDING") {
    // Determine entityType based on documentType
    const entityType =
      existingDocument.documentType?.name
        ?.toLowerCase()
        .replace(/[\s\-]/g, "") === "proposal"
        ? ApprovalType.DOCUMENT_PROPOSAL
        : ApprovalType.DOCUMENT;

    // Create approval record for the document
    await prisma.approval.create({
      data: {
        entityType,
        entityId: id,
        userId: user.id, // Current user submitting for approval
        status: "PENDING",
        note: "Document submitted for approval",
      },
    });
  }

  const document = await prisma.document.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Document",
    entityId: documentWithType.id,
    description: `Updated document: ${documentWithType.name}`,
    metadata: {
      oldData: {
        name: existingDocument.name,
        documentTypeId: existingDocument.documentTypeId,
        status: existingDocument.status,
        letterId: existingDocument.letterId,
      },
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

export const deleteDocument = async (id: string, user: UserWithId) => {
  // Check if document exists
  const existingDocument = await prisma.document.findUnique({
    where: { id },
  });

  if (!existingDocument) {
    throw new Error("Document not found");
  }

  await prisma.document.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Document",
    entityId: id,
    description: `Deleted document: ${existingDocument.name}`,
    metadata: {
      oldData: {
        name: existingDocument.name,
        documentTypeId: existingDocument.documentTypeId,
        status: existingDocument.status,
        letterId: existingDocument.letterId,
      },
      newData: null,
    },
  });
};

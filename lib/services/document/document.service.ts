import prisma from "@/lib/prisma";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";
import type { Status, DocumentType } from "@/types/enums";
import { ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/enums";
import type {
  Prisma,
  Status as PrismaStatus,
  DocumentType as PrismaDocumentType,
} from "@prisma/client";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export const getDocuments = async (filter: {
  type?: DocumentType;
  status?: Status;
  userId?: string;
  eventId?: string;
  letterId?: string;
  search?: string;
}) => {
  const where: Prisma.DocumentWhereInput = {};

  if (filter.type) {
    where.type = { equals: filter.type as unknown as PrismaDocumentType };
  }
  if (filter.status) {
    where.status = { equals: filter.status as unknown as PrismaStatus };
  }
  if (filter.userId) where.userId = filter.userId;
  if (filter.eventId) where.eventId = filter.eventId;
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
      event: {
        select: {
          id: true,
          name: true,
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
        orderBy: { updatedAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return documents;
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
      event: {
        select: {
          id: true,
          name: true,
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
    },
  });

  return document;
};

export const createDocument = async (
  data: CreateDocumentInput,
  user: UserWithId
) => {
  const documentData: Prisma.DocumentCreateInput = {
    name: data.name,
    type: data.type as unknown as PrismaDocumentType,
    status: (data.status as unknown as PrismaStatus) || "DRAFT",
    document: data.document,
    user: { connect: { id: user.id } },
  };

  if (data.eventId) {
    documentData.event = { connect: { id: data.eventId } };
  }

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
      event: {
        select: {
          id: true,
          name: true,
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
    },
  });

  // Create initial approval request for the document if status is PENDING
  if (data.status === "PENDING") {
    await prisma.approval.create({
      data: {
        entityType: ApprovalType.DOCUMENT,
        entityId: document.id,
        userId: user.id,
        status: StatusApproval.PENDING,
        note: "Document submitted for approval",
      },
    });
  }

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "Document",
    entityId: document.id,
    description: `Created document: ${document.name}`,
    metadata: {
      newData: {
        name: document.name,
        type: document.type,
        status: document.status,
        eventId: document.eventId,
        letterId: document.letterId,
      },
    },
  });

  return document;
};

export const updateDocument = async (
  id: string,
  data: UpdateDocumentInput,
  user: UserWithId
) => {
  // Check if document exists
  const existingDocument = await prisma.document.findUnique({
    where: { id },
  });

  if (!existingDocument) {
    throw new Error("Document not found");
  }

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.eventId !== undefined) updateData.eventId = data.eventId;
  if (data.letterId !== undefined) updateData.letterId = data.letterId;
  if (data.type) updateData.type = data.type;
  if (data.document !== undefined) updateData.document = data.document;
  if (data.status) updateData.status = data.status;

  // Handle status change to PENDING - create approval record
  if (data.status === "PENDING") {
    // Check if approval already exists for this document
    const existingApproval = await prisma.approval.findFirst({
      where: {
        entityType: "DOCUMENT",
        entityId: id,
      },
    });

    if (!existingApproval) {
      // Create approval record for the document if it doesn't exist
      await prisma.approval.create({
        data: {
          entityType: "DOCUMENT",
          entityId: id,
          userId: user.id,
          status: "PENDING",
          note: "Document submitted for approval",
        },
      });
    } else {
      // Update existing approval status to PENDING
      await prisma.approval.update({
        where: { id: existingApproval.id },
        data: {
          status: "PENDING",
        },
      });
    }
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
      event: {
        select: {
          id: true,
          name: true,
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
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Document",
    entityId: document.id,
    description: `Updated document: ${document.name}`,
    metadata: {
      oldData: {
        name: existingDocument.name,
        type: existingDocument.type,
        status: existingDocument.status,
        eventId: existingDocument.eventId,
        letterId: existingDocument.letterId,
      },
      newData: {
        name: document.name,
        type: document.type,
        status: document.status,
        eventId: document.eventId,
        letterId: document.letterId,
      },
    },
  });

  return document;
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
        type: existingDocument.type,
        status: existingDocument.status,
        eventId: existingDocument.eventId,
        letterId: existingDocument.letterId,
      },
      newData: null,
    },
  });
};

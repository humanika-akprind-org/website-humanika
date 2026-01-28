import prisma from "@/presentation/lib/prisma";
import type { Status, DocumentType as DocumentTypeEnum } from "@/domain/enums";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";

export type GetDocumentsFilter = {
  documentTypeId?: string;
  status?: Status;
  userId?: string;
  letterId?: string;
  search?: string;
};

export const getDocuments = async (filter: GetDocumentsFilter) => {
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

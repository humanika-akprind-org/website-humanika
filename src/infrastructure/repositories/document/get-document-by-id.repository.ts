import prisma from "@/presentation/lib/prisma";
import type { DocumentType as DocumentTypeEnum } from "@/domain/enums";

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

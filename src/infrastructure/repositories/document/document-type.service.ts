import { PrismaClient } from "@prisma/client";
import type {
  DocumentType,
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
} from "@/types/document-type";
import type { User } from "@/types/user";

const prisma = new PrismaClient();

export async function getDocumentTypes(): Promise<DocumentType[]> {
  return prisma.documentType.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getDocumentType(
  id: string
): Promise<DocumentType | null> {
  return prisma.documentType.findUnique({
    where: { id },
  });
}

export async function createDocumentType(
  data: CreateDocumentTypeInput,
  _user: User
): Promise<DocumentType> {
  // Check if document type with same name already exists
  const existingDocumentType = await prisma.documentType.findFirst({
    where: {
      name: {
        equals: data.name,
        mode: "insensitive",
      },
    },
  });

  if (existingDocumentType) {
    throw new Error("Document type with this name already exists");
  }

  return prisma.documentType.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function updateDocumentType(
  id: string,
  data: UpdateDocumentTypeInput,
  _user: User
): Promise<DocumentType> {
  // Check if document type exists
  const existingDocumentType = await prisma.documentType.findUnique({
    where: { id },
  });

  if (!existingDocumentType) {
    throw new Error("Document type not found");
  }

  // Check if another document type with same name already exists
  if (data.name) {
    const duplicateDocumentType = await prisma.documentType.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: "insensitive",
        },
        id: {
          not: id,
        },
      },
    });

    if (duplicateDocumentType) {
      throw new Error("Document type with this name already exists");
    }
  }

  return prisma.documentType.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function deleteDocumentType(
  id: string,
  _user: User
): Promise<void> {
  // Check if document type exists
  const existingDocumentType = await prisma.documentType.findUnique({
    where: { id },
  });

  if (!existingDocumentType) {
    throw new Error("Document type not found");
  }

  // Check if document type is being used by any documents
  const documentsCount = await prisma.document.count({
    where: {
      documentTypeId: id,
    },
  });

  if (documentsCount > 0) {
    throw new Error(
      "Cannot delete document type that is being used by documents"
    );
  }

  await prisma.documentType.delete({
    where: { id },
  });
}

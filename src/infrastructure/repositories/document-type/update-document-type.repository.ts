/**
 * Update Document Type Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type {
  DocumentType,
  UpdateDocumentTypeInput,
} from "@/domain/value-objects/document-type";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing document type
 * @throws Error if document type is not found
 * @throws Error if another document type with the same name already exists
 */
export async function updateDocumentType(
  id: string,
  data: UpdateDocumentTypeInput,
  _user: UserWithId,
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

  return await prisma.documentType.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

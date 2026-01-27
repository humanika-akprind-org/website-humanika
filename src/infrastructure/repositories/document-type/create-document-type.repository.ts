/**
 * Create Document Type Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type {
  DocumentType,
  CreateDocumentTypeInput,
} from "@/domain/value-objects/document-type";
import type { User } from "@/domain/entities/user.entity";

/**
 * Create a new document type
 * @throws Error if document type with the same name already exists
 */
export async function createDocumentType(
  data: CreateDocumentTypeInput,
  _user: User,
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

  return await prisma.documentType.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

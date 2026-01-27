/**
 * Delete Document Type Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { User } from "@/domain/entities/user.entity";

/**
 * Delete a document type
 * @throws Error if document type is not found
 * @throws Error if document type is being used by any documents
 */
export async function deleteDocumentType(
  id: string,
  _user: User,
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
      "Cannot delete document type that is being used by documents",
    );
  }

  await prisma.documentType.delete({
    where: { id },
  });
}

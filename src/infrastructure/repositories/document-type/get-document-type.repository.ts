/**
 * Get Document Type By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { DocumentType } from "@/domain/value-objects/document-type";

/**
 * Get a single document type by its ID
 */
export async function getDocumentType(
  id: string,
): Promise<DocumentType | null> {
  return await prisma.documentType.findUnique({
    where: { id },
  });
}

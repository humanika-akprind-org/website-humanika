/**
 * Get Document Types Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { DocumentType } from "@/domain/value-objects/document-type";

/**
 * Get all document types sorted by creation date (newest first)
 */
export async function getDocumentTypes(): Promise<DocumentType[]> {
  return await prisma.documentType.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

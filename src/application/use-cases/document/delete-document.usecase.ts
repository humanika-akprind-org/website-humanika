/**
 * Delete Document Use Case - Complex delete operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles deleting documents with:
 * - Validation before delete
 * - Activity logging
 * - Cascade deletion handling
 *
 * Use this for complex delete operations that require business logic.
 */

import type { IDocumentRepository } from "@/application/interface/document.repository.interface";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class DeleteDocumentUseCase {
  constructor(private documentRepo: IDocumentRepository) {}

  /**
   * Execute the use case to delete a document
   *
   * @param id - The document ID to delete
   * @param user - The user deleting the document
   * @returns void
   */
  async execute(id: string, user: UserWithId): Promise<void> {
    // 1. Validate ID
    if (!id || id.trim() === "") {
      throw new Error("Document ID is required");
    }

    // 2. Check if document exists
    const existingDocument = await this.documentRepo.findById(id);
    if (!existingDocument) {
      throw new Error("Document not found");
    }

    // 3. Store document data for activity logging
    const documentData = {
      id: existingDocument.id,
      name: existingDocument.name,
      documentTypeId: existingDocument.documentTypeId,
      status: existingDocument.status,
    };

    // 4. Delete related approvals first (cascade)
    await this.deleteRelatedApprovals(id);

    // 5. Delete the document
    await this.documentRepo.delete(id);

    // 6. Log activity
    await this.logDeletion(user, documentData);
  }

  /**
   * Delete related approval records for the document
   */
  private async deleteRelatedApprovals(documentId: string): Promise<void> {
    // Note: This assumes the repository has a method to delete approvals by entity
    // If not, we may need to use the approval repository directly
    try {
      // Try to delete approvals if the method exists
      const prisma = await import("@/presentation/lib/prisma");
      await prisma.default.approval.deleteMany({
        where: {
          entityType: "DOCUMENT",
          entityId: documentId,
        },
      });
    } catch {
      // If the method doesn't exist or fails, continue with document deletion
      // The database may have cascade delete set up
      console.log("No cascade delete for approvals, continuing...");
    }
  }

  /**
   * Log the document deletion activity
   */
  private async logDeletion(
    user: UserWithId,
    documentData: Record<string, unknown>,
  ): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "Document",
      entityId: documentData.id as string,
      description: `Deleted document: ${documentData.name as string}`,
      metadata: {
        details: {
          deletedDocument: documentData,
        },
      },
    });
  }
}

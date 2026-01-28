/**
 * Update Document Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles updating documents with:
 * - Input validation
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IDocumentRepository } from "@/application/interface/document.repository.interface";
import type {
  UpdateDocumentInput,
  Document,
} from "@/domain/entities/document.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class UpdateDocumentUseCase {
  constructor(private documentRepo: IDocumentRepository) {}

  /**
   * Execute the use case to update a document
   *
   * @param id - The document ID to update
   * @param input - Validated document input data
   * @param user - The user updating the document
   * @returns The updated document
   */
  async execute(
    id: string,
    input: UpdateDocumentInput,
    user: UserWithId,
  ): Promise<Document> {
    // 1. Validate ID
    if (!id || id.trim() === "") {
      throw new Error("Document ID is required");
    }

    // 2. Validate input
    this.validateInput(input);

    // 3. Check if document exists
    const existingDocument = await this.documentRepo.findById(id);
    if (!existingDocument) {
      throw new Error("Document not found");
    }

    // 4. Store old data for activity logging
    const oldData = {
      name: existingDocument.name,
      documentTypeId: existingDocument.documentTypeId,
      status: existingDocument.status,
      letterId: existingDocument.letterId,
    };

    // 5. Update the document
    const document = await this.documentRepo.update(id, input);

    // 6. Log activity
    await this.logUpdate(user, document, oldData, input);

    return document;
  }

  /**
   * Validate required fields for document update
   */
  private validateInput(input: UpdateDocumentInput): void {
    const errors: string[] = [];

    // At least one field must be provided
    if (
      !input.name &&
      !input.documentTypeId &&
      !input.status &&
      !input.letterId &&
      input.document === undefined
    ) {
      errors.push("At least one field is required");
    }

    if (input.name !== undefined && input.name.trim() === "") {
      errors.push("Name cannot be empty");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Log the document update activity
   */
  private async logUpdate(
    user: UserWithId,
    document: Document,
    oldData: Record<string, unknown>,
    newData: UpdateDocumentInput,
  ): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.UPDATE,
      entityType: "Document",
      entityId: document.id,
      description: `Updated document: ${document.name}`,
      metadata: {
        oldData,
        newData: {
          name: newData.name,
          documentTypeId: newData.documentTypeId,
          status: newData.status,
          letterId: newData.letterId,
          document: newData.document,
        },
      },
    });
  }
}

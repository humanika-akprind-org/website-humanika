/**
 * Create Document Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating documents with:
 * - Input validation
 * - Approval record creation for proposals and accountability reports
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IDocumentRepository } from "@/application/interface/document.repository.interface";
import type {
  CreateDocumentInput,
  Document,
} from "@/domain/entities/document.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType, ApprovalType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class CreateDocumentUseCase {
  constructor(private documentRepo: IDocumentRepository) {}

  /**
   * Execute the use case to create a new document
   *
   * @param input - Validated document input data
   * @param user - The user creating the document
   * @returns The created document
   */
  async execute(
    input: CreateDocumentInput,
    user: UserWithId,
  ): Promise<Document> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Create the document
    const document = await this.documentRepo.create(input, user);

    // 3. Create approval record for proposals and accountability reports
    await this.createApprovalIfNeeded(document, user);

    // 4. Log activity
    await this.logCreation(user, document);

    return document;
  }

  /**
   * Validate required fields for document creation
   */
  private validateInput(input: CreateDocumentInput): void {
    const errors: string[] = [];

    if (!input.name || input.name.trim() === "") {
      errors.push("Name is required");
    }

    if (!input.documentTypeId) {
      errors.push("Document type ID is required");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Create approval record for proposals and accountability reports
   */
  private async createApprovalIfNeeded(
    document: Document,
    user: UserWithId,
  ): Promise<void> {
    // Only create approval record for proposals and accountability reports
    const normalizedDocType =
      document.documentType?.name?.toLowerCase().replace(/[\s\-]/g, "") || "";
    const requiresApproval =
      normalizedDocType === "proposal" ||
      normalizedDocType === "accountabilityreport" ||
      normalizedDocType === "lpj";

    if (requiresApproval) {
      // Determine entityType based on documentType
      const entityType =
        normalizedDocType === "proposal"
          ? ApprovalType.DOCUMENT_PROPOSAL
          : ApprovalType.DOCUMENT_ACCOUNTABILITY_REPORT;

      // Create approval record with PENDING status
      await this.documentRepo.createApproval(
        document.id,
        user.id,
        entityType,
        "Document created and pending approval",
      );
    }
  }

  /**
   * Log the document creation activity
   */
  private async logCreation(
    user: UserWithId,
    document: Document,
  ): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "Document",
      entityId: document.id,
      description: `Created document: ${document.name}`,
      metadata: {
        newData: {
          name: document.name,
          documentTypeId: document.documentTypeId,
          status: document.status,
          letterId: document.letterId,
        },
      },
    });
  }
}

/**
 * Extension to IDocumentRepository for approval creation
 * This is needed because the base repository doesn't have this method
 */
export interface IDocumentRepositoryWithApproval extends IDocumentRepository {
  createApproval(
    documentId: string,
    userId: string,
    entityType: ApprovalType,
    note: string,
  ): Promise<void>;
}

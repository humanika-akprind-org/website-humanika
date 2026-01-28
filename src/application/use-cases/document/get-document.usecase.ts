/**
 * Get Document Use Case - Single read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching a single document by ID.
 * Use this for single read operations that require business logic validation.
 */

import type { IDocumentRepository } from "@/application/interface/document.repository.interface";
import type { Document } from "@/domain/entities/document.entity";

export class GetDocumentUseCase {
  constructor(private documentRepo: IDocumentRepository) {}

  /**
   * Execute the use case to get a document by ID
   *
   * @param id - The document ID
   * @returns The document if found
   * @throws Error if document is not found
   */
  async execute(id: string): Promise<Document> {
    // Validate ID
    if (!id || id.trim() === "") {
      throw new Error("Document ID is required");
    }

    // Fetch the document
    const document = await this.documentRepo.findById(id);

    if (!document) {
      throw new Error("Document not found");
    }

    return document;
  }
}

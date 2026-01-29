/**
 * Get Documents Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching documents with filtering and pagination.
 * Use this for complex read operations that require business logic.
 */

import type {
  IDocumentRepository,
  DocumentFilters,
  DocumentPagination,
  DocumentPaginationResult,
} from "@/application/interface/document.repository.interface";
import type { Document } from "@/domain/entities/document.entity";
import type { Status } from "@/domain/enums";

interface DocumentResult {
  documents: Document[];
  pagination: DocumentPaginationResult;
}

export class GetDocumentsUseCase {
  constructor(private documentRepo: IDocumentRepository) {}

  /**
   * Execute the use case to get documents with optional filters and pagination
   *
   * @param filters - Optional filters for querying documents
   * @param pagination - Optional pagination parameters
   * @returns Documents with pagination info
   */
  async execute(
    filters?: DocumentFilters,
    pagination?: DocumentPagination,
  ): Promise<DocumentResult> {
    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    // Validate pagination parameters
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1) throw new Error("Limit must be greater than 0");
    if (limit > 100) throw new Error("Limit cannot exceed 100");

    // Execute the repository method
    const result = await this.documentRepo.findMany(filters, { page, limit });

    return {
      documents: result.records,
      pagination: result.pagination,
    };
  }

  /**
   * Execute with query parameters from request URL
   * Useful for converting URL search params to filters
   */
  async executeFromQueryParams(
    searchParams: URLSearchParams,
  ): Promise<DocumentResult> {
    const statusParam = searchParams.get("status") as Status | null;
    const filters: DocumentFilters = {
      status: statusParam || undefined,
      documentTypeId: searchParams.get("documentTypeId") || undefined,
      userId: searchParams.get("userId") || undefined,
      letterId: searchParams.get("letterId") || undefined,
      search: searchParams.get("search") || undefined,
      periodId: searchParams.get("periodId") || undefined,
    };

    const pagination: DocumentPagination = {
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    return this.execute(filters, pagination);
  }
}

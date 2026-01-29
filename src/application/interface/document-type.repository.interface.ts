import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";
import type {
  DocumentType,
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
} from "@/domain/value-objects/document-type";

/**
 * Document Type Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines DocumentType-specific operations.
 */
export interface IDocumentTypeRepository {
  /** Find all document types */
  findAll(): Promise<DocumentType[]>;

  /** Find a document type by ID */
  findById(id: string): Promise<DocumentType | null>;

  /** Find document types with filters and pagination */
  findMany(
    filters?: DocumentTypeFilter,
    pagination?: BasePagination,
  ): Promise<{ records: DocumentType[]; pagination: BasePaginationResult }>;

  /** Create a new document type */
  create(data: CreateDocumentTypeInput, userId: string): Promise<DocumentType>;

  /** Update an existing document type */
  update(
    id: string,
    data: UpdateDocumentTypeInput,
    userId: string,
  ): Promise<DocumentType>;

  /** Delete a document type */
  delete(id: string, userId: string): Promise<void>;

  /** Count document types with optional filter */
  count(where?: BaseFilter): Promise<number>;

  /** Get statistics/filters */
  getStats(filters?: BaseFilter): Promise<BaseStats>;
}

/**
 * Filter types for DocumentType queries
 */
export interface DocumentTypeFilter extends BaseFilter {
  search?: string;
}

// Re-export base types with DocumentType-specific names for convenience
export type { BasePagination as DocumentTypePagination };
export type { BasePaginationResult as DocumentTypePaginationResult };
export type { BaseStats as DocumentTypeStats };

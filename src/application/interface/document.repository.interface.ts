/**
 * Document Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface extends IBaseRepository with Document-specific operations.
 */

import type { IBaseRepository } from "./base.repository.interface";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/domain/entities/document.entity";
import type { Status, ApprovalType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

// Extend the base interface for Document entity
export interface IDocumentRepository extends IBaseRepository<
  Document,
  string,
  CreateDocumentInput,
  UpdateDocumentInput
> {
  // Document-specific methods

  /** Find documents with filters and pagination */
  findMany(
    filters?: DocumentFilters,
    pagination?: DocumentPagination,
  ): Promise<{ documents: Document[]; pagination: DocumentPaginationResult }>;

  /** Find document by letter ID */
  findByLetterId(letterId: string): Promise<Document[]>;

  /** Find documents by user ID */
  findByUserId(userId: string): Promise<Document[]>;

  /** Find documents by status */
  findByStatus(status: Status): Promise<Document[]>;

  /** Find documents by document type ID */
  findByDocumentTypeId(documentTypeId: string): Promise<Document[]>;

  /** Create a new document */
  create(data: CreateDocumentInput): Promise<Document>;
  create(data: CreateDocumentInput, user: UserWithId): Promise<Document>;

  /** Create approval record for a document */
  createApproval(
    documentId: string,
    userId: string,
    entityType: ApprovalType,
    note: string,
  ): Promise<void>;
}

// Filter types for Document queries
export interface DocumentFilters {
  status?: Status;
  userId?: string;
  letterId?: string;
  documentTypeId?: string;
  search?: string;
  periodId?: string;
}

// Pagination input
export interface DocumentPagination {
  page?: number;
  limit?: number;
}

// Pagination result
export interface DocumentPaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

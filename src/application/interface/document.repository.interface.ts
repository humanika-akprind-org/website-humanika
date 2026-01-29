import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
} from "./base.repository.interface";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/domain/entities/document.entity";
import type { Status, ApprovalType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

// Extend the base interface for Document entity
export interface IDocumentRepository {
  /** Find all documents */
  findAll(): Promise<Document[]>;

  /** Find a document by ID */
  findById(id: string): Promise<Document | null>;

  /** Find documents with filters and pagination */
  findMany(
    filters?: DocumentFilters,
    pagination?: BasePagination,
  ): Promise<{ records: Document[]; pagination: BasePaginationResult }>;

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

  /** Update an existing document */
  update(id: string, data: UpdateDocumentInput): Promise<Document>;

  /** Delete a document */
  delete(id: string): Promise<void>;

  /** Count documents with optional filter */
  count(where?: BaseFilter): Promise<number>;

  /** Create approval record for a document */
  createApproval(
    documentId: string,
    userId: string,
    entityType: ApprovalType,
    note: string,
  ): Promise<void>;
}

// Filter types for Document queries
export interface DocumentFilters extends BaseFilter {
  status?: Status;
  userId?: string;
  letterId?: string;
  documentTypeId?: string;
  search?: string;
  periodId?: string;
}

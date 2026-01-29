/**
 * Document Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements IDocumentRepository using Prisma ORM.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IDocumentRepository,
  DocumentFilters,
  DocumentPagination,
  DocumentPaginationResult,
} from "@/application/interface/document.repository.interface";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/domain/entities/document.entity";
import type { User } from "@/domain/entities/user.entity";
import { type ApprovalType, type Status } from "@/domain/enums";
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from "./index";

// Type alias for user context
type UserWithId = Pick<User, "id">;

/**
 * Document Repository Prisma Implementation
 *
 * This class implements the IDocumentRepository interface
 * for Clean Architecture compliance.
 */
export class DocumentRepositoryPrisma implements IDocumentRepository {
  /**
   * Find all documents
   */
  async findAll(): Promise<Document[]> {
    return (await getDocuments({})) as unknown as Document[];
  }

  /**
   * Find documents with filters and pagination
   */
  async findMany(
    filters?: DocumentFilters,
    pagination?: DocumentPagination,
  ): Promise<{ records: Document[]; pagination: DocumentPaginationResult }> {
    const filterParam = {
      documentTypeId: filters?.documentTypeId,
      status: filters?.status,
      userId: filters?.userId,
      letterId: filters?.letterId,
      search: filters?.search,
    };

    const records = await getDocuments(filterParam);

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated documents
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as unknown as Document[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Find document by ID
   */
  async findById(id: string): Promise<Document | null> {
    return (await getDocument(id)) as unknown as Document | null;
  }

  /**
   * Find documents by letter ID
   */
  async findByLetterId(letterId: string): Promise<Document[]> {
    const records = await getDocuments({ letterId });
    return records as unknown as Document[];
  }

  /**
   * Find documents by user ID
   */
  async findByUserId(userId: string): Promise<Document[]> {
    const records = await getDocuments({ userId });
    return records as unknown as Document[];
  }

  /**
   * Find documents by status
   */
  async findByStatus(status: Status): Promise<Document[]> {
    const records = await getDocuments({ status });
    return records as unknown as Document[];
  }

  /**
   * Find documents by document type ID
   */
  async findByDocumentTypeId(documentTypeId: string): Promise<Document[]> {
    const records = await getDocuments({ documentTypeId });
    return records as unknown as Document[];
  }

  /**
   * Create a new document
   */
  async create(data: CreateDocumentInput): Promise<Document>;
  async create(data: CreateDocumentInput, user: UserWithId): Promise<Document>;
  async create(
    data: CreateDocumentInput,
    user?: UserWithId,
  ): Promise<Document> {
    const userWithId: UserWithId = user || { id: "" };
    return (await createDocument(data, userWithId)) as unknown as Document;
  }

  /**
   * Update an existing document
   */
  async update(id: string, data: UpdateDocumentInput): Promise<Document> {
    // Get current user from session/auth context
    const user: UserWithId = { id: "" };
    return (await updateDocument(id, data, user)) as unknown as Document;
  }

  /**
   * Delete a document
   */
  async delete(id: string): Promise<void> {
    // Get current user from session/auth context
    const user: UserWithId = { id: "" };
    await deleteDocument(id, user);
  }

  /**
   * Count documents with optional filter
   */
  async count(_where?: Record<string, unknown>): Promise<number> {
    const records = await getDocuments({});
    return records.length;
  }

  /**
   * Create approval record for a document
   */
  async createApproval(
    documentId: string,
    userId: string,
    _entityType: ApprovalType,
    note: string,
  ): Promise<void> {
    // Import prisma directly for this operation
    const prisma = (await import("@/presentation/lib/prisma")).default;
    await prisma.approval.create({
      data: {
        entityType: "DOCUMENT",
        entityId: documentId,
        userId,
        status: "PENDING",
        note,
      },
    });
  }

  // Aliases for backward compatibility with existing use cases
  async getDocumentById(id: string): Promise<Document | null> {
    return this.findById(id);
  }

  async getDocuments(filter?: DocumentFilters): Promise<Document[]> {
    const result = await this.findMany(filter);
    return result.records;
  }

  async createDocument(
    data: CreateDocumentInput,
    user?: UserWithId,
  ): Promise<Document> {
    return this.create(data, user || { id: "" });
  }

  async updateDocument(
    id: string,
    data: UpdateDocumentInput,
  ): Promise<Document> {
    return this.update(id, data);
  }

  async deleteDocument(id: string): Promise<void> {
    return this.delete(id);
  }
}

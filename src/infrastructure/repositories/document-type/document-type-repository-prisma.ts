/**
 * Document Type Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IDocumentTypeRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IDocumentTypeRepository,
  DocumentTypeFilter,
  DocumentTypePagination,
  DocumentTypePaginationResult,
  DocumentTypeStats,
} from "@/application/interface/document-type.repository.interface";
import type {
  DocumentType,
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
} from "@/domain/value-objects/document-type";
import {
  getDocumentTypes,
  getDocumentType,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

/**
 * Document Type Repository Prisma Implementation
 *
 * This class implements the IDocumentTypeRepository interface
 * for Clean Architecture compliance.
 */
export class DocumentTypeRepositoryPrisma implements IDocumentTypeRepository {
  /**
   * Get all document types
   */
  async findAll(): Promise<DocumentType[]> {
    return (await getDocumentTypes()) as DocumentType[];
  }

  /**
   * Get all document types with optional filtering and pagination
   */
  async findMany(
    filter?: DocumentTypeFilter,
    pagination?: DocumentTypePagination,
  ): Promise<{
    records: DocumentType[];
    pagination: DocumentTypePaginationResult;
  }> {
    let records = await getDocumentTypes();

    // Apply search filter if provided
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      records = records.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchLower) ||
          (doc.description?.toLowerCase().includes(searchLower) ?? false),
      );
    }

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated document types
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as DocumentType[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single document type by ID
   */
  async findById(id: string): Promise<DocumentType | null> {
    return (await getDocumentType(id)) as DocumentType | null;
  }

  /**
   * Create a new document type
   */
  async create(
    data: CreateDocumentTypeInput,
    userId: string,
  ): Promise<DocumentType> {
    const user: UserWithId = { id: userId };
    return (await createDocumentType(data, user)) as DocumentType;
  }

  /**
   * Update an existing document type
   */
  async update(
    id: string,
    data: UpdateDocumentTypeInput,
    userId: string,
  ): Promise<DocumentType> {
    const user: UserWithId = { id: userId };
    return (await updateDocumentType(id, data, user)) as DocumentType;
  }

  /**
   * Delete a document type
   */
  async delete(id: string, userId: string): Promise<void> {
    const user: UserWithId = { id: userId };
    await deleteDocumentType(id, user);
  }

  /**
   * Count document types with optional filter
   */
  async count(_where?: Record<string, unknown>): Promise<number> {
    const records = await getDocumentTypes();
    return records.length;
  }

  /**
   * Get aggregated statistics
   */
  async getStats(_where?: Record<string, unknown>): Promise<DocumentTypeStats> {
    const documentTypes = await getDocumentTypes();
    return {
      total: documentTypes.length,
    };
  }
}

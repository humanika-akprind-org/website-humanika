/**
 * Document Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements IDocumentRepository using Prisma ORM.
 */

import prisma from "@/presentation/lib/prisma";
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
import type { Status as PrismaStatus } from "@prisma/client";
import type { User } from "@/domain/entities/user.entity";
import { type ApprovalType, type Status } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class DocumentRepositoryPrisma implements IDocumentRepository {
  private prisma = prisma;

  /**
   * Find all documents
   */
  async findAll(): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        documentType: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return documents as unknown as Document[];
  }

  /**
   * Find document by ID
   */
  async findById(id: string): Promise<Document | null> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        letter: {
          select: { id: true, number: true, regarding: true },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
        },
        documentType: true,
      },
    });

    return document as unknown as Document | null;
  }

  /**
   * Find documents with filters and pagination
   */
  async findMany(
    filters?: DocumentFilters,
    pagination?: DocumentPagination,
  ): Promise<{ documents: Document[]; pagination: DocumentPaginationResult }> {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters?.documentTypeId) {
      where.documentTypeId = filters.documentTypeId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.letterId) where.letterId = filters.letterId;
    if (filters?.periodId) where.periodId = filters.periodId;
    if (filters?.search) {
      where.OR = [{ name: { contains: filters.search, mode: "insensitive" } }];
    }

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          letter: {
            select: { id: true, number: true, regarding: true },
          },
          approvals: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  department: true,
                },
              },
            },
          },
          documentType: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.document.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      documents: documents as unknown as Document[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Find documents by letter ID
   */
  async findByLetterId(letterId: string): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      where: { letterId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        documentType: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return documents as unknown as Document[];
  }

  /**
   * Find documents by user ID
   */
  async findByUserId(userId: string): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        documentType: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return documents as unknown as Document[];
  }

  /**
   * Find documents by status
   */
  async findByStatus(status: Status): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      where: { status: status as PrismaStatus },
      include: {
        user: { select: { id: true, name: true, email: true } },
        documentType: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return documents as unknown as Document[];
  }

  /**
   * Find documents by document type ID
   */
  async findByDocumentTypeId(documentTypeId: string): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      where: { documentTypeId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        documentType: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return documents as unknown as Document[];
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
    const document = await this.prisma.document.create({
      data: {
        name: data.name,
        documentTypeId: data.documentTypeId,
        status: (data.status as PrismaStatus) || "DRAFT",
        document: data.document,
        userId: user?.id ?? "",
        letterId: data.letterId || null,
        periodId: data.periodId || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        period: true,
        letter: { select: { id: true, number: true, regarding: true } },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
        },
        documentType: true,
      },
    });

    return document as unknown as Document;
  }

  /**
   * Update an existing document
   */
  async update(id: string, data: UpdateDocumentInput): Promise<Document> {
    const updateData: Record<string, unknown> = {};

    if (data.name) updateData.name = data.name;
    if (data.documentTypeId) updateData.documentTypeId = data.documentTypeId;
    if (data.status) updateData.status = data.status;
    if (data.document !== undefined) updateData.document = data.document;
    if (data.letterId) updateData.letterId = data.letterId;
    if (data.periodId) updateData.periodId = data.periodId;

    const document = await this.prisma.document.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        period: true,
        letter: { select: { id: true, number: true, regarding: true } },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
        },
        documentType: true,
      },
    });

    return document as unknown as Document;
  }

  /**
   * Delete a document
   */
  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({ where: { id } });
  }

  /**
   * Count documents with optional filter
   */
  async count(where?: unknown): Promise<number> {
    return this.prisma.document.count({
      where: where as Record<string, unknown>,
    });
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
    await this.prisma.approval.create({
      data: {
        entityType: "DOCUMENT",
        entityId: documentId,
        userId,
        status: "PENDING",
        note,
      },
    });
  }
}

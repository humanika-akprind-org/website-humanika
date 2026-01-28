/**
 * Letter Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines Letter-specific operations.
 */

import type {
  Letter,
  CreateLetterInput,
  UpdateLetterInput,
} from "@/domain/entities/letter.entity";
import type {
  LetterType,
  LetterPriority,
  LetterClassification,
  Status,
} from "@/domain/enums";

// Letter-specific repository interface
export interface ILetterRepository {
  /** Find all letters */
  findAll(): Promise<Letter[]>;

  /** Find a letter by ID */
  findById(id: string): Promise<Letter | null>;

  /** Find letters with filters and pagination */
  findMany(
    filters?: LetterFilter,
    pagination?: LetterPagination,
  ): Promise<{ letters: Letter[]; pagination: LetterPaginationResult }>;

  /** Find letter by number */
  findByNumber(number: string): Promise<Letter | null>;

  /** Find letters by type */
  findByType(type: LetterType): Promise<Letter[]>;

  /** Find letters by priority */
  findByPriority(priority: LetterPriority): Promise<Letter[]>;

  /** Find letters by status */
  findByStatus(status: Status): Promise<Letter[]>;

  /** Find letters by period */
  findByPeriod(periodId: string): Promise<Letter[]>;

  /** Find letters by event */
  findByEvent(eventId: string): Promise<Letter[]>;

  /** Create a letter with user ID */
  create(data: CreateLetterInput, userId: string): Promise<Letter>;

  /** Update an existing letter */
  update(id: string, data: UpdateLetterInput): Promise<Letter>;

  /** Delete a letter */
  delete(id: string): Promise<void>;

  /** Count letters with optional filter */
  count(where?: unknown): Promise<number>;

  /** Create approval record for a letter */
  createApproval(letterId: string, userId: string, note: string): Promise<void>;
}

// Filter types for Letter queries
export interface LetterFilter {
  type?: LetterType;
  priority?: LetterPriority;
  classification?: LetterClassification;
  status?: Status;
  periodId?: string;
  eventId?: string;
  search?: string;
}

// Pagination input
export interface LetterPagination {
  page?: number;
  limit?: number;
}

// Pagination result
export interface LetterPaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

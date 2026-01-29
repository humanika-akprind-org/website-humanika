/**
 * Letter Repository Prisma - Class-based repository implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the LetterRepositoryPrisma class that implements
 * ILetterRepository interface for use with the use case pattern.
 * Following the statistic repository pattern - delegates to exported functions.
 */

import type {
  ILetterRepository,
  LetterFilter,
  LetterPagination,
  LetterPaginationResult,
} from "@/application/interface/letter.repository.interface";
import type {
  CreateLetterInput,
  UpdateLetterInput,
} from "@/domain/entities/letter.entity";
import type { LetterType, LetterPriority, Status } from "@/domain/enums";
import type { Letter } from "@/domain/entities/letter.entity";
import {
  getLetters,
  getLetter,
  getLetterByNumber,
  createLetter,
  updateLetter,
  deleteLetter,
  createLetterApproval,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

/**
 * Letter Repository Prisma Implementation
 *
 * This class implements the ILetterRepository interface
 * for Clean Architecture compliance.
 * Follows the statistic pattern - delegates to exported functions.
 */
export class LetterRepositoryPrisma implements ILetterRepository {
  /**
   * Get all letters
   */
  async findAll(): Promise<Letter[]> {
    return (await getLetters({})) as unknown as Letter[];
  }

  /**
   * Get all letters with optional filtering and pagination
   */
  async findMany(
    filter?: LetterFilter,
    pagination?: LetterPagination,
  ): Promise<{ records: Letter[]; pagination: LetterPaginationResult }> {
    const records = await getLetters(filter || {});

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated records
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as unknown as Letter[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single letter by ID
   */
  async findById(id: string): Promise<Letter | null> {
    return (await getLetter(id)) as Letter | null;
  }

  /**
   * Get letter by number
   */
  async findByNumber(number: string): Promise<Letter | null> {
    return (await getLetterByNumber(number)) as Letter | null;
  }

  /**
   * Get letters by type
   */
  async findByType(type: LetterType): Promise<Letter[]> {
    const letters = await getLetters({ type });
    return letters as unknown as Letter[];
  }

  /**
   * Get letters by priority
   */
  async findByPriority(priority: LetterPriority): Promise<Letter[]> {
    const letters = await getLetters({ priority });
    return letters as unknown as Letter[];
  }

  /**
   * Get letters by status
   */
  async findByStatus(status: Status): Promise<Letter[]> {
    const letters = await getLetters({ status });
    return letters as unknown as Letter[];
  }

  /**
   * Get letters by period
   */
  async findByPeriod(periodId: string): Promise<Letter[]> {
    const letters = await getLetters({ periodId });
    return letters as unknown as Letter[];
  }

  /**
   * Get letters by event
   */
  async findByEvent(eventId: string): Promise<Letter[]> {
    const letters = await getLetters({ eventId });
    return letters as unknown as Letter[];
  }

  /**
   * Create a new letter
   */
  async create(data: CreateLetterInput, userId: string): Promise<Letter> {
    const user: UserWithId = { id: userId };
    return (await createLetter(data, user)) as unknown as Letter;
  }

  /**
   * Update an existing letter
   */
  async update(
    id: string,
    data: UpdateLetterInput,
    userId: string,
  ): Promise<Letter> {
    const user: UserWithId = { id: userId };
    return (await updateLetter(id, data, user)) as unknown as Letter;
  }

  /**
   * Delete a letter
   */
  async delete(id: string, userId: string): Promise<void> {
    const user: UserWithId = { id: userId };
    await deleteLetter(id, user);
  }

  /**
   * Count letters with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const letters = await getLetters({
      periodId: where?.periodId as string,
      eventId: where?.eventId as string,
      type: where?.type as LetterType,
      priority: where?.priority as LetterPriority,
      status: where?.status as Status,
    });
    return letters.length;
  }

  /**
   * Create approval record for a letter
   */
  async createApproval(
    letterId: string,
    userId: string,
    note: string,
  ): Promise<void> {
    await createLetterApproval(letterId, userId, note);
  }

  // Aliases for backward compatibility with existing use cases
  async getLetters(filter?: LetterFilter): Promise<Letter[]> {
    const result = await this.findMany(filter);
    return result.records;
  }

  async getLetterById(id: string): Promise<Letter | null> {
    return this.findById(id);
  }

  async createLetter(data: CreateLetterInput, userId: string): Promise<Letter> {
    return this.create(data, userId);
  }

  async updateLetter(
    id: string,
    data: UpdateLetterInput,
    userId: string,
  ): Promise<Letter> {
    return this.update(id, data, userId);
  }

  async deleteLetter(id: string, userId: string): Promise<void> {
    return this.delete(id, userId);
  }
}

/**
 * Get Letters Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching letters with filtering and pagination.
 * Use this for complex read operations that require business logic.
 */

import type {
  ILetterRepository,
  LetterFilter,
  LetterPagination,
} from "@/application/interface/letter.repository.interface";
import type { Letter } from "@/domain/entities/letter.entity";

interface LetterResult {
  letters: Letter[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class GetLettersUseCase {
  constructor(private letterRepo: ILetterRepository) {}

  /**
   * Execute the use case to get letters with optional filters and pagination
   *
   * @param filters - Optional filters for querying letters
   * @param pagination - Optional pagination parameters
   * @returns Letters with pagination info
   */
  async execute(
    filters?: LetterFilter,
    pagination?: LetterPagination,
  ): Promise<LetterResult> {
    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    // Validate pagination parameters
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1) throw new Error("Limit must be greater than 0");
    if (limit > 100) throw new Error("Limit cannot exceed 100");

    // Execute the repository method
    const result = await this.letterRepo.findMany(filters, { page, limit });

    return {
      letters: result.letters,
      pagination: result.pagination,
    };
  }

  /**
   * Execute with query parameters from request URL
   * Useful for converting URL search params to filters
   */
  async executeFromQueryParams(
    searchParams: URLSearchParams,
  ): Promise<LetterResult> {
    const filters: LetterFilter = {
      type: searchParams.has("type")
        ? (searchParams.get("type") as LetterType)
        : undefined,
      priority: searchParams.has("priority")
        ? (searchParams.get("priority") as LetterPriority)
        : undefined,
      status: searchParams.has("status")
        ? (searchParams.get("status") as Status)
        : undefined,
      periodId: searchParams.get("periodId") || undefined,
      eventId: searchParams.get("eventId") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const pagination: LetterPagination = {
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    return this.execute(filters, pagination);
  }
}

// Import types needed for executeFromQueryParams
import type { LetterType, LetterPriority, Status } from "@/domain/enums";

import type {
  OrganizationalStructure,
  OrganizationalStructureFilter,
} from "@/domain/entities/organizational-structure.entity";
import type { IOrganizationalStructureRepository } from "@/application/interface/organizational-structure.repository.interface";

/**
 * Result type for GetStructuresUseCase
 */
export interface GetStructuresResult {
  structures: OrganizationalStructure[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get Structures Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching organizational structures with filtering.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class GetStructuresUseCase {
  constructor(
    private readonly structureRepository: IOrganizationalStructureRepository,
  ) {}

  /**
   * Execute the use case
   * @param filter - Filter criteria for structures
   * @returns Promise resolving to filtered structures with pagination info
   */
  async execute(
    filter?: OrganizationalStructureFilter,
  ): Promise<GetStructuresResult> {
    // Sanitize and validate filter parameters
    const sanitizedFilter = this.sanitizeFilter(filter);

    // Execute repository call
    const structures =
      await this.structureRepository.getStructures(sanitizedFilter);

    // Return structured result with pagination
    return {
      structures,
      pagination: {
        page: 1,
        limit: 10,
        total: structures.length,
        totalPages: Math.ceil(structures.length / 10),
      },
    };
  }

  /**
   * Sanitize and validate filter parameters
   */
  private sanitizeFilter(
    filter?: OrganizationalStructureFilter,
  ): OrganizationalStructureFilter | undefined {
    if (!filter) return undefined;

    return {
      status: filter.status,
      periodId: filter.periodId?.trim() || undefined,
      search: filter.search?.trim() || undefined,
    };
  }
}

import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";
import type {
  OrganizationalStructure,
  OrganizationalStructureFilter,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
} from "@/domain/entities/organizational-structure.entity";

/**
 * Organizational Structure Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines OrganizationalStructure-specific operations.
 */
export interface IOrganizationalStructureRepository {
  /** Find all organizational structures */
  findAll(): Promise<OrganizationalStructure[]>;

  /** Find an organizational structure by ID */
  findById(id: string): Promise<OrganizationalStructure | null>;

  /** Find organizational structures with filters and pagination */
  findMany(
    filters?: OrganizationalStructureFilter,
    pagination?: BasePagination,
  ): Promise<{
    records: OrganizationalStructure[];
    pagination: BasePaginationResult;
  }>;

  /** Create a new organizational structure */
  create(
    data: CreateOrganizationalStructureInput,
    user: { id: string },
  ): Promise<OrganizationalStructure>;

  /** Update an existing organizational structure */
  update(
    id: string,
    data: UpdateOrganizationalStructureInput,
  ): Promise<OrganizationalStructure>;

  /** Delete an organizational structure */
  delete(id: string): Promise<void>;

  /** Count organizational structures with optional filter */
  count(where?: BaseFilter): Promise<number>;
}

// Re-export for convenience
export type { OrganizationalStructureFilter };

// Re-export base types with OrganizationalStructure-specific names for convenience
export type { BasePagination as OrganizationalStructurePagination };
export type { BasePaginationResult as OrganizationalStructurePaginationResult };
export type { BaseStats as OrganizationalStructureStats };

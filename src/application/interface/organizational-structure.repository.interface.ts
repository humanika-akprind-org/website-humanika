import type {
  OrganizationalStructure,
  OrganizationalStructureFilter,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
} from "@/domain/entities/organizational-structure.entity";

/**
 * Organizational Structure Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * Defines the contract for organizational structure data access.
 * Following Dependency Inversion Principle - depends on abstractions, not concretions.
 */
export interface IOrganizationalStructureRepository {
  /**
   * Get all organizational structures with optional filters
   */
  getStructures(
    filter?: OrganizationalStructureFilter,
  ): Promise<OrganizationalStructure[]>;

  /**
   * Get a single organizational structure by ID
   */
  getStructureById(id: string): Promise<OrganizationalStructure>;

  /**
   * Create a new organizational structure
   */
  createStructure(
    data: CreateOrganizationalStructureInput,
    user: { id: string },
  ): Promise<OrganizationalStructure>;

  /**
   * Update an existing organizational structure
   */
  updateStructure(
    id: string,
    data: UpdateOrganizationalStructureInput,
    user: { id: string },
  ): Promise<OrganizationalStructure>;

  /**
   * Delete an organizational structure
   */
  deleteStructure(id: string, user: { id: string }): Promise<void>;
}

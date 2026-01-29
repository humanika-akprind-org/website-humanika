import type {
  OrganizationalStructure,
  UpdateOrganizationalStructureInput,
} from "@/domain/entities/organizational-structure.entity";
import type { IOrganizationalStructureRepository } from "@/application/interface/organizational-structure.repository.interface";

/**
 * Get Structure By ID Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching a single organizational structure.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class GetStructureByIdUseCase {
  constructor(
    private readonly structureRepository: IOrganizationalStructureRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - Structure ID to fetch
   * @returns Promise resolving to the structure
   */
  async execute(id: string): Promise<OrganizationalStructure> {
    // Validate ID
    if (!id || id.trim() === "") {
      throw new Error("Structure ID is required");
    }

    // Execute repository call
    const structure = await this.structureRepository.getStructureById(id);

    if (!structure) {
      throw new Error("Structure not found");
    }

    return structure;
  }
}

/**
 * Update Structure Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for updating organizational structures with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class UpdateStructureUseCase {
  constructor(
    private readonly structureRepository: IOrganizationalStructureRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - Structure ID to update
   * @param input - Structure update input data
   * @param user - User context for logging
   * @returns Promise resolving to updated structure
   */
  async execute(
    id: string,
    input: UpdateOrganizationalStructureInput,
    user: { id: string },
  ): Promise<OrganizationalStructure> {
    // Validate ID
    if (!id || id.trim() === "") {
      throw new Error("Structure ID is required");
    }

    // Validate input
    this.validateInput(input);

    // Execute repository call
    const structure = await this.structureRepository.updateStructure(
      id,
      input,
      user,
    );

    return structure;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: UpdateOrganizationalStructureInput): void {
    const errors: string[] = [];

    // Name validation (optional but if provided must be valid)
    if (input.name !== undefined) {
      if (input.name.trim() === "") {
        errors.push("Name cannot be empty");
      } else if (input.name.length < 3) {
        errors.push("Name must be at least 3 characters");
      } else if (input.name.length > 255) {
        errors.push("Name must be less than 255 characters");
      }
    }

    // Period ID validation (optional but if provided must be valid)
    if (input.periodId !== undefined && input.periodId.trim() === "") {
      errors.push("Period ID cannot be empty if provided");
    }

    // Decree validation (optional but if provided must be valid)
    if (input.decree !== undefined && input.decree.trim() === "") {
      errors.push("Decree cannot be empty if provided");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}

/**
 * Delete Structure Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for deleting organizational structures.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class DeleteStructureUseCase {
  constructor(
    private readonly structureRepository: IOrganizationalStructureRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - Structure ID to delete
   * @param user - User context for logging
   * @returns Promise resolving when deleted
   */
  async execute(id: string, user: { id: string }): Promise<void> {
    // Validate ID
    if (!id || id.trim() === "") {
      throw new Error("Structure ID is required");
    }

    // Execute repository call
    await this.structureRepository.deleteStructure(id, user);
  }
}

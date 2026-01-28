import type {
  OrganizationalStructure,
  CreateOrganizationalStructureInput,
} from "@/domain/entities/organizational-structure.entity";
import type { IOrganizationalStructureRepository } from "@/application/interface/organizational-structure.repository.interface";

/**
 * Create Structure Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for creating organizational structures with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class CreateStructureUseCase {
  constructor(
    private readonly structureRepository: IOrganizationalStructureRepository,
  ) {}

  /**
   * Execute the use case
   * @param input - Structure creation input data
   * @param user - User context for logging
   * @returns Promise resolving to created structure
   */
  async execute(
    input: CreateOrganizationalStructureInput,
    user: { id: string },
  ): Promise<OrganizationalStructure> {
    // Validate input
    this.validateInput(input);

    // Execute repository call
    const structure = await this.structureRepository.createStructure(
      input,
      user,
    );

    return structure;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: CreateOrganizationalStructureInput): void {
    const errors: string[] = [];

    // Name validation
    if (!input.name || input.name.trim() === "") {
      errors.push("Name is required");
    } else if (input.name.length < 3) {
      errors.push("Name must be at least 3 characters");
    } else if (input.name.length > 255) {
      errors.push("Name must be less than 255 characters");
    }

    // Period ID validation
    if (!input.periodId || input.periodId.trim() === "") {
      errors.push("Period ID is required");
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

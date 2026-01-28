/**
 * Get Organization Contact By ID Use Case - Simple read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching a single organization contact by ID.
 */

import type { IOrganizationContactRepository } from "@/application/interface/organization-contact.repository.interface";
import type { OrganizationContact } from "@/domain/entities/organization-contact.entity";

export class GetOrganizationContactByIdUseCase {
  constructor(
    private organizationContactRepo: IOrganizationContactRepository,
  ) {}

  /**
   * Execute the use case to get an organization contact by ID
   *
   * @param id - Organization contact ID
   * @returns The organization contact or null if not found
   */
  async execute(id: string): Promise<OrganizationContact | null> {
    return this.organizationContactRepo.findById(id);
  }
}
